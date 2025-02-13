
import {Pubkey} from "@authlocal/authlocal"

import {makeApi} from "../../api.js"
import {Kv} from "../../../packs/kv/kv.js"
import {DecreeVerifier} from "../../features/security/decree/verifier.js"

export type Mocks = Awaited<ReturnType<typeof prepareMocks>>

export async function prepareMocks() {
	const kv = new Kv()
	const mockServerKv = kv.namespace("mockServer")
	const api = await makeApi(mockServerKv)
	const pubkey = await Pubkey.fromData(await api.v1.pubkey())
	const verifier = new DecreeVerifier(pubkey)
	return {kv, api, pubkey, verifier}
}

