
import {Archetype, ReplicatorId} from "../types.js"
import {ProvidedEntityFeedback} from "../simulation/types.js"

export function dataFromReplicator<A extends Archetype>(
		replicatorId: ReplicatorId,
		feedback: ProvidedEntityFeedback<A>,
	) {

	return feedback.datas
		.filter(([r]) => r === replicatorId)
		.map(([,data]) => data)
}

export function memosFromReplicator<A extends Archetype>(
		replicatorId: ReplicatorId,
		feedback: ProvidedEntityFeedback<A>,
	) {

	return feedback.memos
		.filter(([r]) => r === replicatorId)
		.map(([,memos]) => memos)
}

