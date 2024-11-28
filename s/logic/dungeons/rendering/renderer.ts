
import {Trashbin} from "@benev/slate"
import {Realm} from "../../realm/realm.js"
import {Glb} from "../../../tools/babylon/glb.js"

export class DungeonRenderer {
	loaded: {glb: Glb, trashbin: Trashbin}

	constructor(public realm: Realm) {
		const glb = realm.glbs.templateGlb
		const trashbin = new Trashbin()
		this.loaded = {glb, trashbin}
	}

	async load(url: string) {
		const container = await this.realm.world.loadContainer(url)
		const glb = new Glb(container)
		return this.skin(glb)
	}

	skin(glb: Glb) {
		this.loaded.trashbin.dispose()
		const trashbin = new Trashbin()
		this.loaded = {glb, trashbin}
	}
}

