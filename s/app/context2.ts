
import {Pubkey} from "@authlocal/authlocal"
import {makeApi} from "./api.js"
import {Kv} from "../packs/kv/kv.js"
import {StorageCore} from "../packs/kv/cores/storage.js"
import {AccountManager} from "./features/accounts/ui/manager.js"
import {DecreeVerifier} from "./features/security/decree/verifier.js"

export class Context {
	static async make() {
		const kv = new Kv(new StorageCore)
		const mockServerKv = kv.namespace("mockServer")
		const api = await makeApi(mockServerKv)
		const pubkey = await Pubkey.fromData(await api.v1.pubkey())
		const verifier = new DecreeVerifier(pubkey)
		const accountManager = await AccountManager.make({kv, api, verifier})
		return new this(accountManager)
	}

	constructor(public accountManager: AccountManager) {}
}

export const context = await Context.make()

