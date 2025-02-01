
// import {Scene} from "@babylonjs/core/scene.js"
// import {mimicAnimGroup} from "./dummy-anim-group.js"
// import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
//
// export class AnimSynchronizer {
// 	mimic: AnimationGroup
// 	tick = 0
//
// 	constructor(public scene: Scene, public animationGroups: AnimationGroup[]) {
// 		const [boss] = animationGroups
// 		this.mimic = mimicAnimGroup(scene, boss)
// 		this.mimic.play(true)
// 		this.mimic.goToFrame(boss.from)
// 	}
//
// 	synchronize() {
// 		const frame = this.mimic.getCurrentFrame()
// 		for (const anim of this.animationGroups) {
// 			anim.goToFrame(frame)
// 		}
// 	}
//
// 	dispose() {
// 		this.mimic.dispose()
// 	}
// }

