
import {Map2} from "@benev/slate"
import {Prop, Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"
import {Gridzone, Hashgrid} from "../../../physics/facilities/hashgrid.js"

export class CullingSubject {
	#prop: Prop | undefined

	constructor(
		public location: Vec2,
		private spawner: () => TransformNode
	) {}

	spawn() {
		if (!this.#prop) {
			this.#prop = this.spawner()
		}
	}

	dispose() {
		if (this.#prop) {
			this.#prop.dispose()
		}
	}
}

export class CullingZone {
	enabled = false

	constructor(
		public zone: Gridzone,
		public subjects: CullingSubject[],
	) {}
}

export class Culler {
	#hashgrid = new Hashgrid(16)
	#subjectsByLocation = new Map2<Vec2, CullingSubject>()
	#subjectsByZone = new Map2<Gridzone, CullingSubject[]>
	#enabled = new Set<Gridzone>()

	add(location: Vec2, spawner: () => TransformNode) {
		const subject = new CullingSubject(location, spawner)
		this.#hashgrid.add(subject.location)
		this.#subjectsByLocation.set(subject.location, subject)
	}

	indexZones() {
		for (const zone of this.#hashgrid.getZones()) {
			const subjects = zone.vectors.map(v => this.#subjectsByLocation.require(v))
			this.#subjectsByZone.set(zone, subjects)
		}
	}

	cull(point: Vec2, radius: number) {
		const report = {enabled: 0, disabled: 0}
		const nearby = this.#hashgrid.zonesNear(point, radius)

		for (const zone of this.#hashgrid.getZones()) {
			const isNearby = nearby.includes(zone)
			const wasEnabled = this.#enabled.has(zone)

			// spawn nearby subject
			if (isNearby && !wasEnabled) {
				this.#enabled.add(zone)
				for (const subject of this.#subjectsByZone.require(zone)) {
					subject.spawn()
					report.enabled++
				}
			}

			// dispose distant subject
			else if (!isNearby && wasEnabled) {
				this.#enabled.delete(zone)
				for (const subject of this.#subjectsByZone.require(zone)) {
					subject.dispose()
					report.disabled++
				}
			}
		}

		return report
	}
}

// export class CullingScheduler {
// 	#queue: (() => void)[] = []
//
// 	clear() {
// 		this.#queue = []
// 	}
//
// 	give(fn: () => void) {
// 		this.#queue.push(fn)
// 	}
//
// 	take(n: number) {
// 		if (this.#queue.length === 0)
// 			return []
// 		return this.#queue.splice(0, Math.min(n, this.#queue.length))
// 	}
// }
//
