
import {Vec2} from "@benev/toolbox"

/** the output of the bot's decisions, describes actions to be taken in the world */
export class Agency {

	/** where the bot should aim towards */
	lookingAt: Vec2 | null = null

	/** where the bot should walk towards */
	ambulationGoal: Vec2 | null = null

	/** speed of walking around, from 0-1 */
	pace = 0

	/** whether or not to sprint (overrides pace) */
	sprint = false

	/** triggers the bot to swing its sword */
	attack = false

	/** triggers the bot to block with shield */
	block = false
}

