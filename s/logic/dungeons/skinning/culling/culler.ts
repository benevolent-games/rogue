
import {Vec2} from "@benev/toolbox"
import {SubjectGrid} from "./subject-grid.js"
import {Queue} from "../../../../tools/queue.js"
import {Circle} from "../../../physics/shapes/circle.js"
import {Hyperzone} from "../../../physics/facilities/hypergrid.js"

export class Culler {
	workLimit = 1
	#enabled = new Set<Hyperzone>()
	#queue = new Queue<() => void>()

	constructor(public subjectGrid: SubjectGrid) {}

	cull(point: Vec2, radius: number) {
		const done = this.#executeQueuedWork(this.workLimit)
		if (done === 0) {
			this.#plan(point, radius)
			this.#executeQueuedWork(this.workLimit)
		}
	}

	#plan(point: Vec2, radius: number) {
		this.#queue.clear()
		const circle = new Circle(point, radius)
		const activeZones = this.subjectGrid.hypergrid.getZonesTouchingCircle(circle)

		for (const [zone, subjects] of this.subjectGrid.subjectsByZone) {
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
			}
		}
	}

	#executeQueuedWork(n: number) {
		const fns = this.#queue.take(n)
		for (const fn of fns)
			fn()
		return fns.length
	}
}

