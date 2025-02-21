
import {Vec2} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Box2} from "../../physics/shapes/box2.js"
import {DungeonRenderer} from "../../dungeons/renderer.js"
import {replica} from "../../../packs/archimedes/framework/replication/types.js"

export const dungeonReplica = replica<RogueEntities, Realm>()<"dungeon">(
	({realm, getState}) => {

	const state = getState()
	const cullingRange = 20

	const localArea = new Box2(
		realm.cameraman.desired.pivot,
		Vec2.all(cullingRange),
	)

	const layout = realm.dungeonStore.make(state.options)
	const dungeonRenderer = new DungeonRenderer(realm, layout)
	realm.ready.resolve()

	console.log("🏰 dungeon seed", layout.options.seed)

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
		replicate: _ => {
			localArea.center.set(realm.cameraman.desired.pivot)
			dungeonRenderer.render(realm.seconds, localArea)
		},
		dispose: () => {
			dungeonRenderer.dispose()
			stopDrops()
		},
	}
})

