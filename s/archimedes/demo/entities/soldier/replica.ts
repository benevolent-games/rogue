
import {DemoRealm} from "../../realm.js"
import {GameEntities} from "../entities.js"
import {replica} from "../../../framework/replication/types.js"
import { Vec2 } from "@benev/toolbox"

export const soldierReplica = replica<GameEntities, DemoRealm>()<"soldier">(
	(_) => {

	return {
		gatherInputs: () => ({
			messages: [],
			data: {movement: Vec2.new(1, 0).array()},
		}),
		replicate: (_) => {},
		dispose: () => {},
	}
})

