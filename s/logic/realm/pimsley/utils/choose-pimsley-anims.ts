
import {PimsleyAnim} from "./pimsley-anim.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims(pallet: Pallet) {
	const anim = (s: string) => new PimsleyAnim(
		pallet.container.scene,
		pallet.animationGroups.require(s),
	)

	return {
		attack: anim("swing"),
		idle: anim("idle-standmovement"),
		forward: anim("run-forwards"),
		backward: anim("run-backwards"),
		leftward: anim("strafe-left"),
		rightward: anim("strafe-right"),
	}
}

