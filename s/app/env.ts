
import {Keypair, KeypairData} from "@authlocal/authlocal"
import {uncrunch} from "../tools/crunch.js"

export type Env = {
	keypair: Keypair
	databasePath: string
}

export async function readEnv(): Promise<Env> {
	const databasePath = requireEnv("ROGUE_API_DATABASE_PATH")

	const keypairData = uncrunch<KeypairData>(requireEnv("ROGUE_API_KEYPAIR"))
	const keypair = await Keypair.fromData(keypairData)

	return {
		keypair,
		databasePath,
	}
}

function requireEnv(key: string) {
	const value = process.env[key]
	if (value === undefined)
		throw new Error(`missing required env variable "${key}"`)
	return value
}

