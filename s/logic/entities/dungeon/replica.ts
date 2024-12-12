
import {Vec2} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Clock} from "../../../tools/clock.js"
import {constants} from "../../../constants.js"
import {replica} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/dungeon-layout.js"
import {DungeonRenderer} from "../../dungeons/dungeon-renderer.js"

export const dungeonReplica = replica<RogueEntities, Realm>()<"dungeon">(
	({realm, state}) => {

	const fadeRange = 4
	const cullingRange = 30
	const camfadeOffset = Vec2.new(0, 0).rotate(constants.game.cameraRotation)
	const dungeon = new DungeonLayout(state.options, true)
	const dungeonRenderer = new DungeonRenderer(realm, dungeon)

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
			culler.cull(realm.cameraman.coordinates, cullingRange)
			if (c1.elapsed > 3)
				c1.log("culling was slow")

			const c2 = new Clock()
			wallFader.animate(realm.cameraman.coordinates.clone().add(camfadeOffset), fadeRange)
			if (c2.elapsed > 3)
				c2.log("wallFader was slow")
		},
		dispose: () => {
			dungeonRenderer.dispose()
			stopDrops()
		},
	}
})

