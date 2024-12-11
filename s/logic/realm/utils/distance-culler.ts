
// // TODO delete because obsolete

//
// import {Map2} from "@benev/slate"
// import {Prop, Vec2} from "@benev/toolbox"
// import {Hashgrid} from "../../../logic/physics/facilities/hashgrid.js"
//
// class Subject {
// 	constructor(
// 		public prop: Prop,
// 		public location: Vec2,
// 		public enabled: boolean,
// 	) {}
// }
//
// export class DistanceCuller {
// 	#hashgrid = new Hashgrid(16)
// 	#subjects = new Map2<Vec2, Subject>()
//
// 	add(prop: Prop, location: Vec2) {
// 		const subject = new Subject(prop, location, false)
// 		this.#hashgrid.add(location)
// 		this.#subjects.set(location, subject)
// 	}
//
// 	cull(point: Vec2, radius: number) {
// 		const nearby = this.#hashgrid.near(point, radius)
// 			.map(location => this.#subjects.get(location))
// 			.filter(subject => !!subject)
//
// 		let enabledCount = 0
// 		let disabledCount = 0
//
// 		for (const subject of this.#subjects.values()) {
// 			const isNearby = nearby.includes(subject)
//
// 			if (isNearby) {
// 				enabledCount++
// 				if (subject.enabled !== true) {
// 					subject.prop.setEnabled(true)
// 					subject.enabled = true
// 				}
// 			}
// 			else {
// 				disabledCount++
// 				if (subject.enabled !== false) {
// 					subject.prop.setEnabled(false)
// 					subject.enabled = false
// 				}
// 			}
// 		}
//
// 		console.log(`culled out ${Math.floor((disabledCount / this.#subjects.size) * 100)}% of graphics`)
// 	}
// }
//
