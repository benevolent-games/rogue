
import {BipedAnim} from "./biped-anim.js"
import {AdditiveAnim} from "./additive-anim.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims(pallet: Pallet) {
	const bipedAnim = (s: string) => new BipedAnim(
		pallet.container.scene,
		pallet.animationGroups.require(s),
	)

	const additiveAnim = (s: string, referenceFraction: number) => {
		const animationGroup = pallet.animationGroups.require(s)
		return new AdditiveAnim(animationGroup, referenceFraction)
	}

	return {
		blended: {
			attack: bipedAnim("attack-swing"),
			block: bipedAnim("block-shield"),
			forward: bipedAnim("run-forwards"),
			backward: bipedAnim("run-backwards"),
			leftward: bipedAnim("strafe-left"),
			rightward: bipedAnim("strafe-right"),
			turnLeft: bipedAnim("turn-left"),
			turnRight: bipedAnim("turn-right"),
			idle: bipedAnim("idle-standmovement"),
		},
		additive: {
			headSwivel: additiveAnim("head-swivel", 50 / 100),
		},
	}
}

