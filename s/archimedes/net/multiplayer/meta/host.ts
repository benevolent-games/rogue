
import {Identity} from "../types.js"

export type MetaHost = ReturnType<typeof metaHostApi>

export function metaHostApi({author, updateIdentity}: {
		author: number
		updateIdentity: (identity: Identity) => void
	}) {

	return {
		async hello(identity: Identity) {
			updateIdentity(identity)
			return {author}
		},
	}
}

