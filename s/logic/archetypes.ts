
import {asArchetype} from "./types.js"
import {playerSimula} from "./archetypes/player/simula.js"
import {playerReplica} from "./archetypes/player/replica.js"

export const archetypes = {
	player: asArchetype({
		simula: playerSimula,
		replica: playerReplica,
	}),
}

