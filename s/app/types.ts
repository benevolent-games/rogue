
import {Api} from "./api.js"
import {Kv} from "../packs/kv/kv.js"
import {DecreeVerifier} from "./features/security/decree/verifier.js"

export type Commons = {
	kv: Kv
	api: Api
	verifier: DecreeVerifier
}

