
import {authorize} from "renraku"
import {Map2, Signal, signal} from "@benev/slate"

import {Commons} from "../../../types.js"
import {CharacterSource} from "./types.js"
import {Session} from "../../accounts/ui/types.js"
import {Store} from "../../../../packs/kv/parts/store.js"
import {StorageCore} from "../../../../packs/kv/cores/storage.js"
import {CharacterRecord, CharacterAccess, CharacterGenesis} from "../types.js"

export class CharacterManager {
	characters = signal<CharacterRecord[]>([])
	dispose = StorageCore.onStorageEvent(() => void this.#rememberFromStore())

	#custodyStore: Store<string[]>
	#sources = new Map2<string, CharacterSource>()

	constructor(public options: Commons, public session: Signal<Session | null>) {
		this.#custodyStore = options.schema.characters.custody
	}

	#requireApi() {
		const session = this.session.value
		if (!session) throw new Error("not authorized to make this api call")
		return authorize(
			this.options.api.v1.characters,
			async() => ({accountDecree: session.accountDecree}),
		)
	}

	#updateSignals() {
		this.characters.value = [...this.#sources.values()]
			.map(source => source.access.character)
	}

	async #verify(decrees: string[]) {
		const verifications = decrees.map(async decree => ({
			decree,
			access: await this.options.verifier.verify<CharacterAccess>(decree),
		} as CharacterSource))

		const sources = (await Promise.allSettled(verifications))
			.filter(result => result.status === "fulfilled")
			.map(result => result.value)

		return sources
	}

	async #addSources(sources: CharacterSource[]) {
		for (const source of sources)
			this.#sources.set(source.access.character.id, source)
		this.#updateSignals()
	}

	async #removeSources(...ids: string[]) {
		for (const id of ids)
			this.#sources.delete(id)
		this.#updateSignals()
	}

	async #rememberFromStore() {
		const decrees = await this.#custodyStore.guarantee(() => [])
		const sources = await this.#verify(decrees)
		await this.#addSources(sources)
	}

	async #saveToStore() {
		await this.#custodyStore.put(
			[...this.#sources.values()].map(source => source.decree)
		)
	}

	async downloadFromApi() {
		const api = this.#requireApi()
		await this.#rememberFromStore()
		const decrees = await api.list()
		const sources = await this.#verify(decrees)
		await this.#addSources(sources)
		await this.#saveToStore()
	}

	async create(genesis: CharacterGenesis) {
		const api = this.#requireApi()
		const decree = await api.create(genesis)
		const sources = await this.#verify([decree])
		await this.#addSources(sources)
		await this.#saveToStore()
	}

	async delete(id: string) {
		const api = this.#requireApi()
		await api.delete(id)
		await this.#removeSources(id)
		await this.#saveToStore()
	}

	async claim(id: string) {
		const api = this.#requireApi()
		const source = this.#sources.require(id)
		const decree = await api.claim(source.decree)
		const sources = await this.#verify([decree])
		await this.#addSources(sources)
		await this.#saveToStore()
	}
}

