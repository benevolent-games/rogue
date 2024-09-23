
import {Vec3} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {getPlayerInput} from "./utils/get-player-input.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {PlayerRollbackDriver} from "./utils/player-rollback-driver.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({realm, replicator, facts}) => {

	const cameraPosition = Vec3.zero()

	const driver = new PlayerRollbackDriver({
		config: facts.config,
		maxChronicleEntries: 30,
		coordinates: Coordinates.array(facts.coordinates),
	})

	const guys = {
		hostRaw: realm.instance(realm.env.guys.raw),
		hostSmooth: realm.instance(realm.env.guys.authentic),
		clientRaw: realm.instance(realm.env.guys.local),
		clientSmooth: realm.instance(realm.env.guys.target),
	}

	guys.clientSmooth.scaling.setAll(96 / 100)
	guys.hostRaw.scaling.setAll(98 / 100)
	guys.hostSmooth.scaling.setAll(99 / 100)

	function guyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
			.array()
	}

	let previousRaw = Coordinates.zero()
	const hostSmooth = Coordinates.zero()
	const clientSmooth = Coordinates.zero()

	return {
		replicate({feed, feedback}) {
			const input = getPlayerInput(realm.tact)

			const hostRaw = Coordinates.array(feed.facts.coordinates)
			const fresh = !previousRaw.equals(hostRaw)
			previousRaw.set(hostRaw)

			if (fresh) {
				const estimatedTime = Date.now() - replicator.ping
				driver.rollbackAndCatchUp(estimatedTime, hostRaw)
			}

			driver.simulate({input, obstacles: []})
			const clientRaw = driver.coordinates

			hostSmooth.lerp(hostRaw, 30 / 100)
			clientSmooth.lerp(clientRaw, 30 / 100)

			guys.hostRaw.position.set(...guyPosition(hostRaw))
			guys.hostSmooth.position.set(...guyPosition(hostSmooth))

			guys.clientRaw.position.set(...guyPosition(clientRaw))
			guys.clientSmooth.position.set(...guyPosition(clientSmooth))

			realm.env.camera.target.set(
				...cameraPosition
					.lerp(clientSmooth.position(), 10 / 100)
					.array()
			)

			feedback.sendData({input})
		},
		dispose() {},
	}
})

