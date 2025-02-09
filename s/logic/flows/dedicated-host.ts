
import {repeat} from "@benev/slate"

import {constants} from "../../constants.js"
import {Simtron} from "../station/simtron.js"
import {DungeonStore} from "../dungeons/store.js"
import {Smartloop} from "../../tools/smartloop.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {dungeonStartup} from "../dungeons/startup.js"
import {Cathedral} from "../../packs/archimedes/net/relay/cathedral.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {MultiplayerHost} from "../../packs/archimedes/net/multiplayer/multiplayer-host.js"
import { Identity } from "../../ui/accounts/types.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const dungeonStore = new DungeonStore()
	const simtron = new Simtron(dungeonStore)
	const dungeonLayout = dungeonStore.make(stdDungeonOptions())

	dungeonStartup(simtron, dungeonLayout)

	const cathedral = new Cathedral<Identity>({
		lag,
		onBundle: ({author}) => {
			return simtron.spawnCrusader(author)
		},
	})

	const smartloop = new Smartloop(constants.sim.tickRate)

	const stopSnapshots = repeat.hz(constants.sim.snapshotRate, async() => {
		cathedral.distributeTailoredSnapshots(
			smartloop.tick,
			bundle => simtron.getTailoredSnapshot(bundle.author),
		)
	})

	const stopTicks = smartloop.start(tick => {
		const {inputPayloads} = cathedral.collectivize()
		const inputs = inputPayloads.flatMap(payload => payload.inputs)
		simtron.simulate(tick, inputs)
		if (inputs.length > 0)
			cathedral.broadcastInputs({tick, inputs})
	})

	async function startMultiplayer() {
		return MultiplayerHost.host<Identity>(cathedral)
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		cathedral.dispose()
		dungeonStore.clear()
	}

	return {cathedral, dungeonStore, simtron, smartloop, startMultiplayer, dispose}
}

