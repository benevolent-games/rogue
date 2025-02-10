
import {Kv} from "../packs/kv/kv.js"
import {Keychain} from "./features/security/keychain.js"
import {Characters} from "./features/characters/characters.js"
import {makeAccountantApi} from "./features/accounts/accountant.js"

export type Api = ReturnType<typeof makeApi>

export async function makeApi(kv: Kv) {
	const keychain = await Keychain.temp()
	const accountant = await makeAccountantApi(kv, keychain)
	const characters = new Characters(keychain)

	return {
		v1: {
			pubkey: async() => keychain.pubkeyData,
			accountant,
			characters: characters.api(),
		}
	}
}

