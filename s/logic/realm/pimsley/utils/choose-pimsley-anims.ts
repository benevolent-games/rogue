
import {Anim} from "../../../../tools/anims.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims({animationGroups}: Pallet) {
	const anim = (s: string) => new Anim(animationGroups.require(s))
	return {
		attack: anim("swing"),
		idle: anim("idle-standmovement"),
		forward: anim("run-forwards"),
		backward: anim("run-backwards"),
		leftward: anim("strafe-left"),
		rightward: anim("strafe-right"),
	}
}

