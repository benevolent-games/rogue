
import {Station} from "./station.js"
import {constants} from "../../constants.js"
import {simulas} from "../entities/simulas.js"
import {Box2} from "../physics/shapes/box2.js"
import {Watchman} from "../../tools/watchman.js"
import {DungeonStore} from "../dungeons/store.js"
import {RogueEntities} from "../entities/entities.js"
import {Coordinates} from "../realm/utils/coordinates.js"
import {TimingReport} from "../realm/parts/game-stats.js"
import {InputShell} from "../../archimedes/framework/parts/types.js"
import {GameState} from "../../archimedes/framework/parts/game-state.js"
import {Simulator} from "../../archimedes/framework/simulation/simulator.js"

export class Simtron {
	gameState = new GameState()
	watchman = new Watchman(constants.sim.tickRate)

	station: Station
	simulator: Simulator<RogueEntities, Station>

	constructor(dungeonStore: DungeonStore) {
		this.station = new Station(dungeonStore)
		this.simulator = new Simulator<RogueEntities, Station>(
			this.station,
			this.gameState,
			simulas,
		)
	}

	simulate(tick: number, inputs: InputShell<any>[], physicsTiming = new TimingReport()) {
		this.simulator.simulate(tick, inputs)
		const dungeon = this.station.possibleDungeon
		if (dungeon) {
			const clockPhysics = physicsTiming.measure()
			dungeon.phys.simulate()
			clockPhysics()
		}
	}

	spawnCrusader(author: number) {
		const dungeon = this.station.dungeon
		const spawnpoint = dungeon.getSpawnpoint()

		if (!spawnpoint) {
			console.error("no available space to spawn player")
			return () => {}
		}

		const playerId = this.simulator.create("crusader", {
			author,
			rotation: 0,
			speed: constants.crusader.speed,
			speedSprint: constants.crusader.speedSprint,
			coordinates: Coordinates.import(spawnpoint).array(),
		})

		console.log("SPAWN PLAYER", spawnpoint)
		return () => this.simulator.delete(playerId)
	}

	getTailoredSnapshot(author: number) {
		const coordinates = this.station.getAuthorCoordinates(author)
		// console.log(`author #${author} coordinates ${coordinates.toString()}`)
		const entityIds = new Set([
			...this.station.importantEntities,
			...this.station.entityHashgrid.queryItems(
				new Box2(coordinates, constants.sim.localSnapshotArea)
			)
		])
		const snapshot = this.gameState.snapshot()
		snapshot.entities = snapshot.entities.filter(([id]) => entityIds.has(id))
		return snapshot
	}
}

