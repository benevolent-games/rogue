
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/exports.js"
import {DungeonLayout} from "../../dungeons/dungeon-layout.js"
import {DungeonRenderer} from "../../dungeons/dungeon-renderer.js"

export const dungeonReplica = replica<RogueEntities, Realm>()<"dungeon">(
	({realm, state}) => {

	const dungeon = new DungeonLayout(state.options)
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
		replicate: (tick) => {
			if (tick % 120 === 0) {
				const start = performance.now()
				const report = dungeonRenderer.skin.culler.cull(realm.cameraman.coordinates, 20)
				console.log("culltime", performance.now() - start, report)
			}
		},
		dispose: () => {
			dungeonRenderer.dispose()
			stopDrops()
		},
	}
})

