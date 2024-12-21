
import {Vec3} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"

import {Realm} from "../../../realm/realm.js"
import {WallSubject} from "./wall-subject.js"
import {Box3} from "../../../physics/shapes/box3.js"
import {Line3} from "../../../physics/shapes/line3.js"
import {Sausage3} from "../../../physics/shapes/sausage.js"
import {Cameraman} from "../../../realm/utils/cameraman.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"
import {Collisions3} from "../../../physics/facilities/collisions3.js"

const rugSize = 3
const wallHeight = 7
const sausageRadius = 0.4

export class WallDetector {
	debug = false
	rugExtent = Vec3.new(rugSize, 1, rugSize)
	seen = new Set<WallSubject>()

	rugGraphic?: Mesh
	sausageCap?: Mesh
	sausageLine: [number, Mesh][] = []

	constructor(public realm: Realm) {
		if (this.debug) {
			this.rugGraphic = this.#makeRugGraphic()
			this.sausageLine = [
				[0.0, this.#makeSausageBox()],
				[0.2, this.#makeSausageBox()],
				[0.4, this.#makeSausageBox()],
				[0.6, this.#makeSausageBox()],
				[0.8, this.#makeSausageBox()],
			] as [number, Mesh][]
			this.sausageCap = MeshBuilder.CreateIcoSphere("sausage", {radius: sausageRadius})
			this.sausageCap.material = realm.materials.pearl
			this.sausageCap.visibility = 0.5
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

	#makeSausageBox() {
		const {realm} = this
		const mesh = MeshBuilder.CreateBox("s", {size: 0.2}, realm.world.scene)
		const material = realm.materials.cyan.clone("")
		material.alpha = 0.4
		mesh.material = material
		return mesh
	}

	dispose() {
		this.rugGraphic?.material!.dispose()
		this.rugGraphic?.dispose()
	}

	detect(wall: WallSubject, playerPosition: Vec3, cameraman: Cameraman) {
		const tileExtent = new Vec3(1, wallHeight * 2, 1)

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

		const camline = new Line3(playerPosition.clone(), cameraman.position.clone())
		const sausage = new Sausage3(sausageRadius, new Line3(
			camline.fromStart(sausageRadius * 4),
			camline.end.clone(),
		))

		if (this.debug) {
			if (this.sausageCap)
				this.sausageCap.position.set(...sausage.line.start.array())
			for (const [fraction, mesh] of this.sausageLine)
				mesh.position.set(...sausage.line.point(fraction).array())
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

		const rugCollision = wallBoxes.some(wallBox => Collisions3.boxVsBox(rugBox, wallBox))
		const sausageCollision = wallBoxes.some(wallBox => Collisions3.sausageVsBox(sausage, wallBox))
		return rugCollision || sausageCollision
	}
}

