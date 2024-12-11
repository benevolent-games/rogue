
import {Map2} from "@benev/slate"
import {Prop, Vec2} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core"
import {Queue} from "../../../../tools/queue.js"
import {Circle} from "../../../physics/shapes/circle.js"
import {Hypergrid, Hyperzone} from "../../../physics/facilities/hypergrid.js"

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
			this.#prop = undefined
		}
	}
}

export class CullingZone {
	enabled = false

	constructor(
		public zone: Hyperzone,
		public subjects: CullingSubject[],
	) {}
}

export class Culler {
	#hypergrid = new Hypergrid(Vec2.new(16, 16))
	#subjectsByLocation = new Map2<Vec2, CullingSubject>()
	#subjectsByZone = new Map2<Hyperzone, CullingSubject[]>()
	#enabled = new Set<Hyperzone>()
	#queue = new Queue<() => void>()

	add(location: Vec2, spawner: () => TransformNode) {
		const subject = new CullingSubject(location, spawner)
		const zone = this.#hypergrid.add(subject.location)
		this.#subjectsByLocation.set(subject.location, subject)
		const subjectArray = this.#subjectsByZone.guarantee(zone, () => [])
		subjectArray.push(subject)
	}

	plan(point: Vec2, radius: number) {
		this.#queue.clear()
		const circle = new Circle(point, radius)
		const activeZones = this.#hypergrid.getZonesTouchingCircle(circle)

		for (const [zone, subjects] of this.#subjectsByZone) {
			const nowEnabled = activeZones.includes(zone)
			const wasEnabled = this.#enabled.has(zone)

			if (nowEnabled && !wasEnabled) {
				this.#enabled.add(zone)
				for (const subject of subjects)
					this.#queue.give(() => subject.spawn())
			}
			else if (!nowEnabled && wasEnabled) {
				this.#enabled.delete(zone)
				for (const subject of subjects)
					subject.dispose()
					// this.#queue.give(() => subject.dispose())
			}
		}
	}

	execute(n: number) {
		const fns = this.#queue.take(n)
		for (const fn of fns)
			fn()
		return fns.length
	}
}

