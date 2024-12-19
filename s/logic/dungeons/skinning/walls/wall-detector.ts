
import {Vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Realm} from "../../../realm/realm.js"
import {WallSubject} from "./wall-subject.js"
import {Vecset2} from "../../layouting/vecset2.js"
import {Box3} from "../../../physics/shapes/box3.js"
import {Cameraman} from "../../../realm/utils/cameraman.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"
import {Collisions3} from "../../../physics/facilities/collisions3.js"

export class WallDetector {
	debug = false

	wallExtent = Vec3.new(1, 10, 1)
	rugExtent = Vec3.new(3, 1, 3)

	rugGraphic?: Mesh
	seen = new Vecset2()

	constructor(public realm: Realm) {
		if (this.debug) {
			this.rugGraphic = this.#makeRugGraphic()
		}
	}

	#makeRugGraphic() {
		const {realm} = this
		const mesh = MeshBuilder.CreateBox("b", {size: 1}, realm.world.scene)
		const material = realm.materials.deepPurple.clone("sadclone")
		material.alpha = 0.5
		mesh.material = material
		return mesh
	}

	#makeWallGraphic() {
		const {realm} = this
		const mesh = MeshBuilder.CreateBox("b", {size: 1}, realm.world.scene)
		const material = realm.materials.yellow.clone("spicy")
		material.alpha = 0.1
		mesh.material = material
		return mesh
	}

	dispose() {
		this.rugGraphic?.material!.dispose()
		this.rugGraphic?.dispose()
	}

	detect(wall: WallSubject, playerPosition: Vec3, cameraman: Cameraman) {

		// TODO wtf cursed! why are all the wall subjects misaligned!?!?
		const tile = wall.tile.clone().add_(1, 0)

		const wallTilePosition = Coordinates.from(tile).position()
		const wallBox = new Box3(wallTilePosition, this.wallExtent.clone())

		if (this.debug && this.seen.size < 500 && !this.seen.has(tile)) {
			const mesh = this.#makeWallGraphic()
			mesh.position.set(...wallBox.center.array())
			mesh.scaling.set(...wallBox.extent.array())
			this.seen.add(tile)
		}

		const camdir = new Coordinates(0, 1)
			.multiply_(this.rugExtent.x / 2, this.rugExtent.z / 2)
			.rotate(cameraman.state.swivel)
			.position()

		const rugBox = Box3.centered(
			playerPosition.clone()
				.subtract(camdir),
			this.rugExtent.clone(),
		)

		this.rugGraphic?.position.set(...rugBox.center.array())
		this.rugGraphic?.scaling.set(...rugBox.extent.array())

		return Collisions3.boxVsBox(rugBox, wallBox)
	}
}

