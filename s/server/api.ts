
import {Kv} from "../packs/kv/kv.js"
import {Keychain} from "./utils/keychain.js"
import {Accountant} from "./accounts/accountant.js"
import {Characters} from "./characters/characters.js"
import {enhanceHardcodedAccounts} from "./accounts/hardcoded.js"

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

