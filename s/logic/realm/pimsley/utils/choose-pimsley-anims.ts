
import {PimsleyAnim} from "./pimsley-anim.js"
import {AdditiveAnim} from "./additive-anim.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims(pallet: Pallet) {
	const anim = (s: string) => new PimsleyAnim(
		pallet.container.scene,
		pallet.animationGroups.require(s),
	)

	const additive = (s: string, referenceFraction: number) => {
		const animationGroup = pallet.animationGroups.require(s)
		return new AdditiveAnim(animationGroup, referenceFraction)
	}

	return {
		idle: anim("idle-standmovement"),

		forward: anim("run-forwards"),
		backward: anim("run-backwards"),
		leftward: anim("strafe-left"),
		rightward: anim("strafe-right"),

		turnLeft: anim("turn-left"),
		turnRight: anim("turn-right"),

		attack: anim("swing"),
		block: anim("shield-block"),
		headSwivel: additive("head-swivel", 50 / 100),
	}
}

