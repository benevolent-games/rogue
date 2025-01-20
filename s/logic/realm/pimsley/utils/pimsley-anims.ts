
import {AmbleGroup} from "./amble-group.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export class PimsleyAnims {
	amble: AmbleGroup

	constructor({animationGroups}: Pallet) {
		this.amble = new AmbleGroup(
			animationGroups.require("idle-standmovement"),
			animationGroups.require("run-forwards"),
			animationGroups.require("run-backwards"),
			animationGroups.require("strafe-left"),
			animationGroups.require("strafe-right"),
		)
	}
}

