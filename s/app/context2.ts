
import {Pubkey} from "@authlocal/authlocal"
import {makeApi} from "./api.js"
import {Commons} from "./types.js"
import {Kv} from "../packs/kv/kv.js"
import {StorageCore} from "../packs/kv/cores/storage.js"
import {AccountManager} from "./features/accounts/ui/manager.js"
import {CharacterManager} from "./features/characters/ui/manager.js"
import {DecreeVerifier} from "./features/security/decree/verifier.js"

export class Context {
	static async make() {
		const kv = new Kv(new StorageCore)
		const mockServerKv = kv.namespace("mockServer")
		const api = await makeApi(mockServerKv)
		const pubkey = await Pubkey.fromData(await api.v1.pubkey())
		const verifier = new DecreeVerifier(pubkey)
		const commons: Commons = {kv, api, verifier}
		const accountManager = await AccountManager.make(commons)
		const characterManager = new CharacterManager(commons)
		return new this(accountManager, characterManager)
	}

	constructor(
			public accountManager: AccountManager,
			public characterManager: CharacterManager,
		) {

		accountManager.onSessionChange(session => {
			if (session)
				characterManager.download(session)
		})
	}
}

export const context = await Context.make()

