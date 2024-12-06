
import {Realm} from "../../realm.js"
import {GameEntities} from "../entities.js"
import {replica} from "../../../framework/replication/types.js"

export const bootstrapReplica = replica<GameEntities, Realm>()<"bootstrap">(
	({realm, id}) => {

	return {
		replicate: (tick, state) => {
			return {inputs: []}
		},
		dispose: () => {},
	}
})

