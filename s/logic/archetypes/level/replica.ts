
import {LevelArchetype} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../../dungeons/dungeon-layout.js"
import {DungeonRenderer} from "../../dungeons/dungeon-renderer.js"

export const levelReplica = Realm.replica<LevelArchetype>(
	({realm, facts}) => {
		const {dungeonOptions} = facts
		const dungeon = new DungeonLayout(dungeonOptions)
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
			replicate({feed, feedback}) {},
			dispose() {
				dungeonRenderer.dispose()
				stopDrops()
			},
		}
	}
)

