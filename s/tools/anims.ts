
import {Scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class Weightable {
	weight = 0
}

export class Anim extends Weightable {
	constructor(public animationGroup: AnimationGroup) {
		super()
	}

	update(result = 1) {
		this.animationGroup.weight = Scalar.clamp(Math.max(result, Number.EPSILON))
	}
}

export type AnimNode = Anim | AnimMixer | AnimStack

export class AnimContainer extends Weightable {
	constructor(public nodes: AnimNode[]) {
		super()
	}
}

export class AnimMixer extends AnimContainer {
	update(result = 1) {
		const sum = this.nodes.reduce((x, node) => node.weight + x, 0)
		for (const node of this.nodes)
			node.update(result * (sum === 0 ? 1 : node.weight / sum))
	}
}

export class AnimStack extends AnimContainer {
	update(result = 1) {
		let budget = 1
		for (const node of this.nodes) {
			const allocation = budget >= node.weight
				? node.weight
				: budget
			budget = Scalar.clamp(budget - node.weight)
			node.update(result * allocation)
		}
	}
}

