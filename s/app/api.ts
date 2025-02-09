
import {Kv} from "../packs/kv/kv.js"
import {Keychain} from "./features/security/keychain.js"
import {Accountant} from "./features/accounts/accountant.js"
import {Characters} from "./features/characters/characters.js"
import {enhanceHardcodedAccounts} from "./features/accounts/hardcoded.js"

export type Api = ReturnType<typeof makeApi>

export async function makeApi(kv: Kv) {
	const keychain = await Keychain.temp()
	const accountant = new Accountant(kv, keychain)
	const characters = new Characters(keychain)

	await enhanceHardcodedAccounts(accountant.database)

	return {
		v1: {
			pubkey: async() => keychain.pubkeyData,
			accounting: accountant.api(),
			characters: characters.api(),
		}
	}
}

