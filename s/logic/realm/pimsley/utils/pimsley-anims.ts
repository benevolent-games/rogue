
import {AmbleGroup} from "./amble-group.js"
import {ContainerInstance} from "../../../../tools/babylon/logistics/container-instance.js"

export class PimsleyAnims {
	amble: AmbleGroup

	constructor({animationGroups}: ContainerInstance) {
		console.log("pimsley animations", animationGroups)
		this.amble = new AmbleGroup(
			animationGroups.require("idle-standmovement"),
			animationGroups.require("run-forwards"),
			animationGroups.require("run-backwards"),
			animationGroups.require("strafe-left"),
			animationGroups.require("strafe-right"),
		)
	}
}

