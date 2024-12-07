
import {DemoRealm} from "../../realm.js"
import {GameEntities} from "../entities.js"
import {replica} from "../../../framework/replication/types.js"

export const bootstrapReplica = replica<GameEntities, DemoRealm>()<"bootstrap">(
	({realm, id}) => {

	return {
		replicate: (tick, state) => {
			return {inputs: []}
		},
		dispose: () => {},
	}
})

