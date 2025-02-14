
import {Map2, signal} from "@benev/slate"
import {Commons} from "../../../types.js"
import {CharacterSource} from "./types.js"
import {Session} from "../../accounts/ui/types.js"
import {Character, CharacterAccess} from "../types.js"
import {Store} from "../../../../packs/kv/parts/store.js"

export class CharacterManager {
	characters = signal<Character[]>([])
	#custodyStore: Store<string[]>
	#sources = new Map2<string, CharacterSource>()

	constructor(public options: Commons) {
		this.#custodyStore = options.kv.store("characters.custody")
	}

	#updateCharactersSignal() {
		this.characters.value = [...this.#sources.values()]
			.map(source => source.access.character)
	}

	async remember() {
		const decrees = await this.#custodyStore.guarantee(() => [])

		const verifications = decrees.map(async decree => ({
			decree,
			access: await this.options.verifier.verify<CharacterAccess>(decree),
		} as CharacterSource))

		const sources = (await Promise.allSettled(verifications))
			.filter(result => result.status === "fulfilled")
			.map(result => result.value)

		this.#sources.clear()

		for (const source of sources)
			this.#sources.set(source.access.character.id, source)

		this.#updateCharactersSignal()
	}

	async download(session: Session) {
		const proofToken = session.login.proof.token
		const sources = await this.options.api.v1.characters.owner.list({proofToken})
		this.#custodyStore.put(sources)
		return this.remember()
	}
}

