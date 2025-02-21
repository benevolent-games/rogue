
import {Api} from "./api.js"
import {LocalSchema} from "./features/schema/local.js"
import {DecreeVerifier} from "./features/security/decree/verifier.js"

export type Commons = {
	schema: LocalSchema
	api: Api
	verifier: DecreeVerifier
}

