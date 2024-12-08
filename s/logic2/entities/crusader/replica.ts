
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/exports.js"
import {getPlayerInput} from "./utils/get-player-input.js"

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm}) => {

	console.log("TODO crusader replica")

	return {
		replicate: (tick, state) => {
			return {
				input: {
					data: getPlayerInput(realm.tact),
					messages: [],
				},
			}
		},
		dispose: () => {},
	}
})

