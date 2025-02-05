
import {Scene} from "@babylonjs/core/scene.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

const upperBones = new Set<string>([
	"weapon.l",
	"neck.x",
	"head.x",
	"shoulder.r",
	"arm_stretch.r",
	"arm_twist.r",
	"forearm_stretch.r",
	"forearm_twist.r",
	"hand.r",
	"thumb1.r",
	"thumb2.r",
	"thumb3.r",
	"middle1_base.r",
	"middle1.r",
	"middle2.r",
	"middle3.r",
	"weapon.r",
	"shoulder.l",
	"arm_stretch.l",
	"arm_twist.l",
	"forearm_stretch.l",
	"forearm_twist.l",
	"hand.l",
	"thumb1.l",
	"thumb2.l",
	"thumb3.l",
	"middle1_base.l",
	"middle1.l",
	"middle2.l",
	"middle3.l",
	"spine_00.x",
	"spine_01.x",
	"spine_02.x",
])

const lowerBones = new Set<string>([
	"c_traj",
	"root.x",
	"root",
	"thigh_stretch.l",
	"thigh_twist.l",
	"leg_stretch.l",
	"foot.l",
	"toes_01.l",
	"leg_twist.l",
	"thigh_stretch.r",
	"thigh_twist.r",
	"leg_stretch.r",
	"foot.r",
	"toes_01.r",
	"leg_twist.r",
])

export function splitBodyAnimations(scene: Scene, animationGroup: AnimationGroup) {
	const upper = new AnimationGroup("upper", scene)
	const lower = new AnimationGroup("lower", scene)

	for (const {animation, target} of animationGroup.targetedAnimations) {
		if (upperBones.has(target.name))
			upper.addTargetedAnimation(animation, target)
		if (lowerBones.has(target.name))
			lower.addTargetedAnimation(animation, target)

		if (!upperBones.has(target.name) && !lowerBones.has(target.name)) {
			console.error(`bone not accounted for! "${target.name}"`)
		}
	}

	animationGroup.normalize()
	return {upper, lower}
}

// export function splitBodyAnimations(_scene: Scene, animationGroup: AnimationGroup) {
// 	const upper = animationGroup.clone("upper")
// 	const lower = animationGroup.clone("lower")
//
// 	for (const {animation, target} of upper.targetedAnimations) {
// 		if (!upperBones.has(target.name))
// 			upper.removeTargetedAnimation(animation)
// 	}
//
// 	for (const {animation, target} of lower.targetedAnimations) {
// 		if (!lowerBones.has(target.name))
// 			lower.removeTargetedAnimation(animation)
// 	}
//
// 	return {upper, lower}
// }

