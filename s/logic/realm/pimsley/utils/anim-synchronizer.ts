
import {Scene} from "@babylonjs/core/scene.js"
import {mimicAnimGroup} from "./dummy-anim-group.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class AnimSynchronizer {
	mimic: AnimationGroup

	constructor(public scene: Scene, public animationGroups: AnimationGroup[]) {
		const [boss] = animationGroups
		this.mimic = mimicAnimGroup(scene, boss)
		this.mimic.play(true)
	}

	synchronize() {
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

