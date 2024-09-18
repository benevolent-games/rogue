
import {Archetype, ReplicatorId} from "../types.js"
import {SpecificFeedback} from "../replication/types.js"

export function handleFeedbackFrom<Ar extends Archetype>(
		replicatorId: ReplicatorId,
		feedback: [ReplicatorId, SpecificFeedback<Ar>][],
		fn: (f: SpecificFeedback<Ar>) => void,
	) {

	const result = feedback.find(([id]) => id === replicatorId)

	if (result) {
		const [,f] = result
		return fn(f)
	}
}

