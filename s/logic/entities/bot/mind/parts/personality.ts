
import {Randy} from "@benev/toolbox"
import {geometric, inverse, weight} from "./psychtools.js"

export class Personality {
	static generate(randy: Randy) {
		const personality = new Personality()
		personality.openness = randy.random()
		personality.conscientiousness = randy.random()
		personality.extraversion = randy.random()
		personality.agreeability = randy.random()
		personality.neuroticism = randy.random()
		return personality
	}

	openness = 0.5
	conscientiousness = 0.5
	extraversion = 0.5
	agreeability = 0.5
	neuroticism = 0.5

	get braveness() {
		return geometric(
			weight(1, inverse(this.neuroticism)),
			weight(1, this.extraversion),
		)
	}

	get creativity() {
		return geometric(
			weight(2, this.openness),
			weight(2, inverse(this.agreeability)),
			weight(1, inverse(this.conscientiousness)),
		)
	}

	get curiosity() {
		return geometric(
			weight(2, this.openness),
			weight(0.8, inverse(this.neuroticism)),
			weight(0.5, inverse(this.agreeability)),
		)
	}

	get aggressiveness() {
		return geometric(
			weight(2.5, inverse(this.agreeability)),
			weight(1.5, this.extraversion),
		)
	}

	get stubbornness() {
		return geometric(
			weight(2, this.conscientiousness),
			weight(1.5, inverse(this.openness)),
		)
	}

	get leadership() {
		return geometric(
			weight(2, this.extraversion),
			weight(1.5, this.conscientiousness),
		)
	}

	get empathy() {
		return geometric(
			weight(2.5, this.agreeability),
			weight(1.5, this.openness),
			weight(1, this.extraversion),
		)
	}
}

