
import {Coordinates} from "../../../realm/utils/coordinates.js"

/** something the bot can see, hear, or remembers */
export class Percept {
	coordinates = new Coordinates(0, 0)
}

/** bot's own understanding of itself */
export class SelfAwareness {
	coordinates = new Coordinates(0, 0)
}

/** access to everything the bot is aware of */
export class Perception {
	self = new SelfAwareness()
	percepts = new Set<Percept>()
}

