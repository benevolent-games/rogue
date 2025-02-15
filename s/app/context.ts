
import {Pubkey} from "@authlocal/authlocal"

import {Commons} from "./types.js"
import {Kv} from "../packs/kv/kv.js"
import {Api, makeApi} from "./api.js"
import {StorageCore} from "../packs/kv/cores/storage.js"
import {AccountManager} from "./features/accounts/ui/manager.js"
import {CharacterManager} from "./features/characters/ui/manager.js"
import {DecreeVerifier} from "./features/security/decree/verifier.js"

export class Context {
	static #context: Context | null = null

	static get context() {
		if (!this.#context) throw new Error("context not set")
		return this.#context
	}

	static async #prepare(kv: Kv, api: Api) {
		const pubkey = await Pubkey.fromData(await api.v1.pubkey())
		const verifier = new DecreeVerifier(pubkey)
		const commons: Commons = {kv, api, verifier}
		const accountManager = await AccountManager.make(commons)
		const characterManager = new CharacterManager(commons)
		return new this(accountManager, characterManager)
	}

	static async mock() {
		const kv = new Kv(new StorageCore).namespace("rogue.v1")
		const mockServerKv = new Kv(new StorageCore).namespace("rogueMockServer.v1")
		const api = await makeApi(mockServerKv)
		const context = await this.#prepare(kv, api)
		this.#context = context
		return context
	}

	static async make() {
		return this.mock()
	}

	constructor(
			public accountManager: AccountManager,
			public characterManager: CharacterManager,
		) {

		accountManager.onSessionChange(async session => {
			if (session)
				await characterManager.downloadFromApi(session)
		})
	}
}

