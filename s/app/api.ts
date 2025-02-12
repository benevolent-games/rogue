
import {Kv} from "../packs/kv/kv.js"
import {makeAccountantApi} from "./features/accounts/api.js"
import {makeCharacterApi} from "./features/characters/api.js"
import {DecreeSigner} from "./features/security/decree/signer.js"

export type Api = Awaited<ReturnType<typeof makeApi>>

export async function makeApi(kv: Kv) {
	const signer = await DecreeSigner.temp()
	const pubkeyData = await signer.pubkey.toData()

	const accountant = await makeAccountantApi(kv, signer)
	const characters = await makeCharacterApi(kv, signer)

	return {
		v1: {
			pubkey: async() => pubkeyData,
			accountant,
			characters,
		}
	}
}

