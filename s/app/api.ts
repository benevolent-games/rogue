
import {Keypair} from "@authlocal/authlocal"
import {DatabaseSchema} from "./features/schema/database.js"
import {makeAccountingApi} from "./features/accounts/api.js"
import {makeCharacterApi} from "./features/characters/api.js"
import {DecreeSigner} from "./features/security/decree/signer.js"

export type Api = Awaited<ReturnType<typeof makeApi>>

export async function makeApi(schema: DatabaseSchema, keypair: Keypair) {
	const signer = new DecreeSigner(keypair)
	const pubkeyData = await signer.pubkey.toData()

	const accounting = await makeAccountingApi(schema, signer)
	const characters = await makeCharacterApi(schema, signer)

	return {
		v1: {
			pubkey: async() => pubkeyData,
			accounting,
			characters,
		}
	}
}

