
import {AmbleGroup} from "./amble-group.js"
import {Anim, AnimMixer, AnimStack} from "../../../../tools/anims.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export class PimsleyAnims {
	amble: AmbleGroup

	constructor({animationGroups}: Pallet) {
		console.log("anims", [...animationGroups.keys()])

		const attack = new Anim(animationGroups.require("swing"))
		const idle = new Anim(animationGroups.require("idle-standmovement"))
		const forward = new Anim(animationGroups.require("run-forwards"))
		const backward = new Anim(animationGroups.require("run-backwards"))
		const leftward = new Anim(animationGroups.require("strafe-left"))
		const rightward = new Anim(animationGroups.require("strafe-right"))

		const graph = new AnimStack([
			attack,
			new AnimMixer([
				forward,
				backward,
				leftward,
				rightward,
			]),
			idle,
		])

		this.amble = new AmbleGroup(
			animationGroups.require("idle-standmovement"),
			animationGroups.require("run-forwards"),
			animationGroups.require("run-backwards"),
			animationGroups.require("strafe-left"),
			animationGroups.require("strafe-right"),
		)
	}
}

