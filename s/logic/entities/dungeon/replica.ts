
import {Vec2} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Clock} from "../../../tools/clock.js"
import {DungeonRenderer} from "../../dungeons/dungeon-renderer.js"
import {replica} from "../../../archimedes/framework/replication/types.js"
import {WallDetector} from "../../dungeons/skinning/walls/wall-detector.js"

export const dungeonReplica = replica<RogueEntities, Realm>()<"dungeon">(
	({realm, state}) => {

	const fadeRange = 10
	const cullingRange = 20
	const wallDetector = new WallDetector(realm)

	const layout = realm.dungeonStore.make(state.options)
	const dungeonRenderer = new DungeonRenderer(realm, layout)

	console.log("🏰 dungeon seed", layout.options.seed)

	const camfadeOffset = Vec2.new(0, 0).rotate(realm.cameraman.desired.swivel)

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

	return {
		gatherInputs: () => undefined,
		replicate: (_) => {
			const {culler, wallFader} = dungeonRenderer.skin

			const c1 = new Clock()
			culler.cull(realm.cameraman.desired.pivot, cullingRange)
			if (c1.elapsed > 3)
				c1.log("culling was slow")

			const c2 = new Clock()
			wallFader.animate(
				realm.cameraman.desired.pivot.clone().add(camfadeOffset),
				fadeRange,
				wall => wallDetector.detect(
					wall,
					realm.cameraman.desired.pivot.position(),
					realm.cameraman,
				),
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

