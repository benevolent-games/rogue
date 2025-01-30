
import {Randy} from "@benev/toolbox"

export class Psychology {
	openness = 0.5
	conscientiousness = 0.5
	extraversion = 0.5
	agreeableness = 0.5
	neuroticism = 0.5

	static generate(randy: Randy) {
		const psychology = new Psychology()
		psychology.openness = randy.random()
		psychology.conscientiousness = randy.random()
		psychology.extraversion = randy.random()
		psychology.agreeableness = randy.random()
		psychology.neuroticism = randy.random()
		return psychology
	}
}

