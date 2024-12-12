
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {CullingSubject} from "./culling-subject.js"
import {Hypergrid, Hyperzone} from "../../../physics/facilities/hypergrid.js"

export class SubjectGrid<S extends CullingSubject = CullingSubject> {
	hypergrid = new Hypergrid(Vec2.new(16, 16))
	subjectsByLocation = new Map2<Vec2, S>()
	subjectsByZone = new Map2<Hyperzone, S[]>()

	add(subject: S) {
		const zone = this.hypergrid.add(subject.location)
		this.subjectsByLocation.set(subject.location, subject)
		const subjectArray = this.subjectsByZone.guarantee(zone, () => [])
		subjectArray.push(subject)
	}
}

