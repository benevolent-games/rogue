
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {WallSubject} from "./wall-subject.js"
import {SubjectGrid} from "../culling/subject-grid.js"
import {Circle} from "../../../physics/shapes/circle.js"
import {Hyperzone} from "../../../physics/facilities/hypergrid.js"
import {Collisions} from "../../../physics/facilities/collisions.js"

export class WallFader {
	speed = 10 / 100
	#proximalZones = new Set<Hyperzone>()
	#fadeOutWorkload = new Map2<Hyperzone, Set<WallSubject>>()
	#fadeInWorkload = new Map2<Hyperzone, Set<WallSubject>>()

	constructor(public subjectGrid: SubjectGrid<WallSubject>) {}

	animate(point: Vec2, radius: number) {
		this.#plan(point, radius)
		this.#work()
		// const remaining = this.#work()
		// if (remaining === 0)
		// 	this.#plan(point, radius)
	}

	#plan(point: Vec2, radius: number) {
		const circle = new Circle(point, radius)

		// find which zones touch the circle
		const newProximalZones = new Set(
			this.subjectGrid.hypergrid.getZonesTouchingCircle(circle)
		)

		// handle new zones entering proximity
		for (const zone of newProximalZones) {

			// fade out walls in new zones
			const jobs = this.#fadeOutWorkload.guarantee(zone, () => new Set())

			// subject grid
			for (const subject of this.subjectGrid.subjectsByZone.get(zone) ?? []) {
				const inProximity = Collisions.pointVsCircle(subject.location, circle)
				subject.targetOpacity = (inProximity)
					? 0
					: 1
				if (!subject.done)
					jobs.add(subject)
			}
		}

		// handle zones leaving proximity
		for (const zone of this.#proximalZones) {
			if (!newProximalZones.has(zone)) {

				// fade in walls in zones that left proximity
				const jobs = this.#fadeInWorkload.guarantee(zone, () => new Set())

				for (const subject of this.subjectGrid.subjectsByZone.get(zone) ?? []) {
					subject.targetOpacity = 1
					if (!subject.done)
						jobs.add(subject)
				}
			}
		}

		this.#proximalZones = newProximalZones
	}

	#work() {
		this.#executeWorkload(this.#fadeOutWorkload)
		this.#executeWorkload(this.#fadeInWorkload)
		return this.#fadeOutWorkload.size + this.#fadeInWorkload.size
	}

	#executeWorkload(workload: Map2<Hyperzone, Set<WallSubject>>) {
		for (const [zone, subjects] of workload) {
			for (const subject of subjects) {
				subject.animateOpacity(this.speed)
				if (subject.done)
					subjects.delete(subject)
			}
			if (subjects.size === 0)
				workload.delete(zone)
		}
	}
}

