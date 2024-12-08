
import {DemoRealm} from "../../realm.js"
import {GameEntities} from "../entities.js"
import {replica} from "../../../framework/replication/types.js"

export const landmineReplica = replica<GameEntities, DemoRealm>()<"landmine">(
	(_) => {

	return {
		replicate: (_) => {
			return {
				input: {
					data: undefined,
					messages: [],
				},
			}
		},
		dispose: () => {},
	}
})

