
import {deep, interval} from "@benev/slate"

import {Fiber} from "../tools/fiber.js"
import {Station} from "../logic/station/station.js"
import {simulas} from "../logic/archetypes/simulas.js"
import {Clientele} from "../logic/framework/relay/clientele.js"
import {Coordinates} from "../logic/realm/utils/coordinates.js"
import {Simulator} from "../logic/framework/simulation/simulator.js"
import {multiplayerFibers} from "../logic/multiplayer/utils/multiplayer-fibers.js"
import {MultiplayerHost} from "../logic/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow() {
	const station = new Station()
	const simulator = new Simulator(station, simulas)
	const clientele = new Clientele()

	const dispose = interval.hz(60, () => {
		const feedbacks = clientele.collectAllFeedbacks()
		simulator.simulate(feedbacks)
		const feed = deep.clone(simulator.collector.take())
		clientele.broadcastFeed(feed)
	})

	async function startMultiplayer() {
		return MultiplayerHost.host({
			hello: connection => {
				const fibers = multiplayerFibers()
				const megafiber = Fiber.multiplex(fibers)
				megafiber.proxyCable(connection.cable)
				const contact = clientele.add(fibers)
				return () => {
					clientele.delete(contact)
				}
			},
		})
	}

	return {station, simulator, clientele, startMultiplayer, dispose}
}

