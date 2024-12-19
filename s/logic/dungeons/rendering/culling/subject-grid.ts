
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"
import {CullingSubject} from "./culling-subject.js"
import {Hypergrid, Hyperzone} from "../../../physics/facilities/hypergrid.js"

export class SubjectGrid<S extends CullingSubject = CullingSubject> {
	hypergrid = new Hypergrid(Vec2.new(16, 16))
	subjectsByZone = new Map2<Hyperzone, S[]>()

	add(subject: S) {
		const zone = this.hypergrid.add(subject.location)

		const zoneSubjects = this.subjectsByZone.guarantee(zone, () => [])
		zoneSubjects.push(subject)
	}

	dispose() {
		for (const subjects of this.subjectsByZone.values())
			for (const subject of subjects)
				subject.dispose()
	}
}

