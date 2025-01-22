
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {BabylonAnimBucket} from "../../../../tools/buckets/babylon-anim.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims({animationGroups}: Pallet) {
	const anim = (s: string) => new BabylonAnimBucket(animationGroups.require(s))
	return {
		attack: anim("swing"),
		idle: anim("idle-standmovement"),
		forward: anim("run-forwards"),
		backward: anim("run-backwards"),
		leftward: anim("strafe-left"),
		rightward: anim("strafe-right"),
	}
}

