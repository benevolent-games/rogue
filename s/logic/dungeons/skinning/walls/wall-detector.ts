
import {Vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Realm} from "../../../realm/realm.js"
import {WallSubject} from "./wall-subject.js"
import {Box3} from "../../../physics/shapes/box3.js"
import {Cameraman} from "../../../realm/utils/cameraman.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"
import {Collisions3} from "../../../physics/facilities/collisions3.js"

export class WallDetector {
	debug = false
	rugExtent = Vec3.new(3, 1, 3)
	rugGraphic?: Mesh
	seen = new Set<WallSubject>()

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
		const material = realm.materials.pearl.clone("")
		material.alpha = 0.4
		mesh.material = material
		return mesh
	}

	dispose() {
		this.rugGraphic?.material!.dispose()
		this.rugGraphic?.dispose()
	}

	detect(wall: WallSubject, playerPosition: Vec3, cameraman: Cameraman) {
		const tileExtent = new Vec3(1, 10, 1)

		const wallBoxes = wall.segment.tiles.map(tile => {
			const tileCenter = Coordinates.from(tile)
				.add_(0.5, 0.5)
				.position()
			return new Box3(tileCenter, tileExtent)
		})

		if (this.debug && this.seen.size < 500 && !this.seen.has(wall)) {
			this.seen.add(wall)
			for (const wallBox of wallBoxes) {
				const mesh = this.#makeWallGraphic()
				mesh.position.set(...wallBox.center.array())
				mesh.scaling.set(...wallBox.extent.array())
			}
		}

		const camdir = new Coordinates(0, 1)
			.multiply_(
				this.rugExtent.x / 2,
				this.rugExtent.z / 2,
			)
			.multiplyBy(Math.SQRT2)
			.addBy(Number.EPSILON)
			.rotate(cameraman.state.swivel)
			.position()

		const rugBox = new Box3(
			playerPosition.clone()
				.subtract(camdir),
			this.rugExtent,
		)

		this.rugGraphic?.position.set(...rugBox.center.array())
		this.rugGraphic?.scaling.set(...rugBox.extent.array())

		const collision = wallBoxes.some(wallBox => Collisions3.boxVsBox(rugBox, wallBox))

		if (wallBoxes.length > 2, collision)
			console.log("collision!")

		return collision
	}
}

