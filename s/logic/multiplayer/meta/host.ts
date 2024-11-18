
import {Identity} from "../types.js"

export type MetaHost = ReturnType<typeof metaHostApi>

export function metaHostApi({replicatorId, updateIdentity}: {
		replicatorId: number
		updateIdentity: (identity: Identity) => void
	}) {

	return {
		async hello(identity: Identity) {
			console.log("GOT IDENTITY", identity)
			updateIdentity(identity)
			return {replicatorId}
		},
	}
}

