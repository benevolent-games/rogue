
import {label} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Animation} from "@babylonjs/core/Animations/animation.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export function dummyAnimGroup({scene, frames, framerate}: {
		scene: Scene
		frames: number
		framerate: number
	}) {

	const mesh = new Mesh(label("dummyAnimMesh"), scene)
	mesh.isVisible = false

	const group = new AnimationGroup(label("dummyAnimGroup"), scene, 1.0, 0)

	const anim = new Animation(
		label("dummyAnim"),
		"position.x",
		framerate,
		Animation.ANIMATIONTYPE_FLOAT,
		Animation.ANIMATIONLOOPMODE_CYCLE,
	)

	anim.setKeys([
		{frame: 0, value: 0},
		{frame: frames, value: 0},
	])

	mesh.animations.push(anim)
	group.addTargetedAnimation(anim, mesh)

	return group
}

export function mimicAnimGroup(scene: Scene, original: AnimationGroup) {
	const mesh = new Mesh(label("dummyAnimMesh"), scene)
	mesh.isVisible = false

	const group = new AnimationGroup(label("dummyAnimGroup"), scene, 1.0, 0)
	const framerate = original.targetedAnimations[0]!.animation.framePerSecond

	const anim = new Animation(
		label("dummyAnim"),
		"position.x",
		framerate,
		Animation.ANIMATIONTYPE_FLOAT,
		Animation.ANIMATIONLOOPMODE_CYCLE,
	)

	anim.setKeys([
		{frame: original.from, value: 0},
		{frame: original.to, value: 0},
	])

	mesh.animations.push(anim)
	group.addTargetedAnimation(anim, mesh)

	return group
}

