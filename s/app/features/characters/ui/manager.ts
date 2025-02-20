
import {Map2, signal} from "@benev/slate"
import {Login} from "@authlocal/authlocal"
import {Commons} from "../../../types.js"
import {CharacterSource} from "./types.js"
import {Session} from "../../accounts/ui/types.js"
import {Store} from "../../../../packs/kv/parts/store.js"
import {CharacterRecord, CharacterAccess, CharacterGenesis} from "../types.js"
import {StorageCore} from "../../../../packs/kv/cores/storage.js"

export class CharacterManager {
	characters = signal<CharacterRecord[]>([])

	#custodyStore: Store<string[]>
	#sources = new Map2<string, CharacterSource>()

	dispose = StorageCore.onStorageEvent(() => void this.#rememberFromStore())

	constructor(public options: Commons) {
		this.#custodyStore = options.kv.store("characters.custody")
	}

	#updateCharactersSignal() {
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
		this.#updateCharactersSignal()
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

	async downloadFromApi(session: Session) {
		await this.#rememberFromStore()
		const proofToken = session.login.proof.token
		const decrees = await this.options.api.v1.characters.owner.list({proofToken})
		const sources = await this.#verify(decrees)
		await this.#addSources(sources)
		await this.#saveToStore()
	}

	async create(login: Login, genesis: CharacterGenesis) {
		const proofToken = login.proof.token
		const decree = await this.options.api.v1.characters.owner.create({proofToken}, genesis)
		const sources = await this.#verify([decree])
		await this.#addSources(sources)
		await this.#saveToStore()
	}
}

