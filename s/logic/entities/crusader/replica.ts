
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/exports.js"
import {getPlayerInput} from "./utils/get-player-input.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import { Trashbin } from "@benev/slate"

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const {lighting, buddies, materials} = realm
	const inControl = state.author === replicator.author

	function buddyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
	}

	const buddy = inControl
		? buddies.create(materials.cyan)
		: buddies.create(materials.yellow)

	const initial = Coordinates.from(state.coordinates)
	const buddyCoordinates = initial.clone()

	const trashbin = new Trashbin()

	const controller = inControl
		? (() => {
			realm.cameraman.pivotInstantly(buddyCoordinates.clone())
			const cursorGraphic = realm.indicators.cursor.instance()
			return {cursorGraphic}
		})()
		: null

	return {
		gatherInputs: () => {
			if (inControl) {
				const input = getPlayerInput(realm.tact, realm.cameraman)
				return [input]
			}
		},

		replicate: (_, state) => {
			buddyCoordinates.lerp_(...state.coordinates, 30 / 100)
			const position = buddyPosition(buddyCoordinates)
			buddy.position.set(...position.array())

			if (controller) {
				realm.cameraman.desired.pivot = buddyCoordinates
				realm.playerPosition = position
				lighting.torch.position.set(...buddyCoordinates.position().add_(0, 3, 0).array())

				const {cursorGraphic} = controller
				cursorGraphic.position.set(...realm.cursor.worldPosition.array())
			}
		},

		dispose: () => {
			buddy.dispose()
			trashbin.dispose()
		},
	}
})

