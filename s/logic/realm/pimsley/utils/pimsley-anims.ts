
import {AmbleGroup} from "./amble-group.js"
import {ContainerInstance} from "../../../../tools/babylon/logistics/container-instance.js"

export class PimsleyAnims {
	amble: AmbleGroup

	constructor({animationGroups}: ContainerInstance) {
		console.log(animationGroups)
		this.amble = new AmbleGroup(
			animationGroups.require("idle-stand-animated"),
			animationGroups.require("run-forwards"),
			animationGroups.require("grab-backward"),
			animationGroups.require("strafe-left"),
			animationGroups.require("strafe-right"),
		)
	}
}

