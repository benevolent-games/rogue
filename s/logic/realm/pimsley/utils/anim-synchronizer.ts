
import {Scene} from "@babylonjs/core/scene.js"
import {mimicAnimGroup} from "./dummy-anim-group.js"
import {Chronometer} from "../../../../tools/chronometer.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class AnimSynchronizer {
	framerate = 60
	chronometer = new Chronometer().start()
	durationSeconds: number

	mimic: AnimationGroup

	constructor(public scene: Scene, public animationGroups: AnimationGroup[]) {
		const [boss] = animationGroups
		const {to, from} = boss
		this.durationSeconds = (to - from) / this.framerate
		this.mimic = mimicAnimGroup(scene, boss)
		this.mimic.play(true)
		// for (const anim of animationGroups)
		// 	anim.pause()
	}

	get frame() {
		const [boss] = this.animationGroups
		const {to, from} = boss
		const durationSeconds = (to - from + 1) / this.framerate
		const playheadSeconds = this.chronometer.seconds % durationSeconds
		return from + (this.framerate * playheadSeconds)
	}

	synchronize() {
		// const frame = this.frame

		const frame = this.mimic.getCurrentFrame()

		for (const anim of this.animationGroups) {
			if (anim.isPlaying) {
				if (anim.weight <= 0) {
					anim.goToFrame(frame)
					anim.pause()
				}
			}
			else {
				if (anim.weight > 0) {
					anim.play(true)
					anim.goToFrame(frame)
				}
			}
		}
	}
}

