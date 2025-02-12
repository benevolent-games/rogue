
import {Kv} from "../packs/kv/kv.js"
import {Keychain} from "./features/security/keychain.js"
import {makeAccountantApi} from "./features/accounts/api.js"
import {makeCharacterApi} from "./features/characters/api.js"

export type Api = ReturnType<typeof makeApi>

export async function makeApi(kv: Kv) {
	const keychain = await Keychain.temp()
	const accountant = await makeAccountantApi(kv, keychain)
	const characters = await makeCharacterApi(kv, keychain)

	return {
		v1: {
			pubkey: async() => keychain.pubkeyData,
			accountant,
			characters,
		}
	}
}

