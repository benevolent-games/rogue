
import {Kv} from "../packs/kv/kv.js"
import {Keychain} from "./utils/keychain.js"
import {Accountant} from "../app/features/accounts/accountant.js"
import {Characters} from "../app/features/characters/characters.js"
import {enhanceHardcodedAccounts} from "../app/features/accounts/hardcoded.js"

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

