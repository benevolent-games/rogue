
import {Vec2} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Clock} from "../../../tools/clock.js"
import {constants} from "../../../constants.js"
import {DungeonLayout} from "../../dungeons/layout.js"
import {DungeonRenderer} from "../../dungeons/dungeon-renderer.js"
import {replica} from "../../../archimedes/framework/replication/types.js"
import {WallDetector} from "../../dungeons/skinning/walls/wall-detector.js"

export const dungeonReplica = replica<RogueEntities, Realm>()<"dungeon">(
	({realm, state}) => {

	const fadeRange = 4
	const cullingRange = 30
	const camfadeOffset = Vec2.new(0, 0).rotate(constants.game.cameraRotation)
	const dungeonLayout = new DungeonLayout(state.options)
	const dungeonRenderer = new DungeonRenderer(realm, dungeonLayout)

	console.log("🏰 dungeon seed", dungeonLayout.options.seed)

	const stopDrops = realm.onFilesDropped(files => {
		for (const file of files) {
			if (file.name.endsWith(".glb")) {
				console.log("loading", file.name)
				dungeonRenderer.loadGlb(URL.createObjectURL(file))
					.then(() => console.log("loaded", file.name))
					.catch(error => console.error("error", file.name, error))
			}
		}
	})

	const wallDetector = new WallDetector(realm)

	return {
		gatherInputs: () => undefined,
		replicate: (_) => {
			const {culler, wallFader} = dungeonRenderer.skin
			const playerPosition = realm.playerPosition.clone()
			const cameraPosition = realm.cameraman.position.clone()

			const c1 = new Clock()
			culler.cull(realm.cameraman.target, cullingRange)
			if (c1.elapsed > 3)
				c1.log("culling was slow")

			const c2 = new Clock()
			wallFader.animate(
				realm.cameraman.target.clone().add(camfadeOffset),
				fadeRange,
				wall => wallDetector.detect(wall, playerPosition, cameraPosition),
			)
			if (c2.elapsed > 3)
				c2.log("wallFader was slow")
		},
		dispose: () => {
			wallDetector.dispose()
			dungeonRenderer.dispose()
			stopDrops()
		},
	}
})

