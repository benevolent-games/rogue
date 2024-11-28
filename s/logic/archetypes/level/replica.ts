
import {LevelArchetype} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {Dungeon} from "../../dungeons/dungeon.js"
import {DungeonRenderer} from "../../dungeons/rendering/renderer.js"

export const levelReplica = Realm.replica<LevelArchetype>(
	({realm, facts}) => {
		const {dungeonOptions} = facts

		const dungeon = new Dungeon(dungeonOptions)
		const dungeonRenderer = new DungeonRenderer(realm, dungeon)

		const stopDrops = realm.onFilesDropped(files => {
			for (const file of files) {
				if (file.name.endsWith(".glb")) {
					dungeonRenderer.load(URL.createObjectURL(file))
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

