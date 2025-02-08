
import {Kv} from "../tools/kv/kv.js"
import {Keychain} from "./utils/keychain.js"
import {Accountant} from "./accounts/accountant.js"
import {Characters} from "./characters/characters.js"

export type Api = ReturnType<typeof makeApi>

export async function makeApi(kv: Kv) {
	const keychain = await Keychain.temp()
	const accountant = new Accountant(kv, keychain)
	const characters = new Characters(keychain)

	return {
		v1: {
			pubkey: async() => keychain.pubkeyJson,
			accounting: accountant.api(),
			characters: characters.api(),
		}
	}
}

