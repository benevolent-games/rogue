
import {Grip} from "../../../supercontrol/grip/grip.js"
import {apd, dps, mps} from "./utils/sensitivity-units.js"

export type GameBindings = ReturnType<typeof gameBindings>

const sens = {
	camera: {
		key: dps(180),
		stick: dps(180),
		pointer: apd(720),
	},
	zoom: {
		key: mps(10),
		stick: mps(10),
		pointer: mps(0.1),
	},
}

export const gameBindings = () => Grip.bindings({
	normal: {
		sprint: [["ShiftLeft"], ["g.stick.left.click"], ["g.trigger.left"]],

		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
		moveDown: [["KeyS"], ["Down"], ["g.stick.left.down"]],
		moveLeft: [["KeyA"], ["Left"], ["g.stick.left.left"]],
		moveRight: [["KeyD"], ["Right"], ["g.stick.left.right"]],

		lookUp: [["KeyI"], ["g.stick.right.up"]],
		lookDown: [["KeyK"], ["g.stick.right.down"]],
		lookLeft: [["KeyJ"], ["g.stick.right.left"]],
		lookRight: [["KeyL"], ["g.stick.right.right"]],

		cameraReset: [["BracketRight"], ["g.beta"], ["g.stick.right.click", {style: "tap"}]],

		cameraSwivelLeft: [
			["KeyU", {sensitivity: sens.camera.key}],
			["g.stick.right.left", {
				with: ["g.bumper.left"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraSwivelRight: [
			["KeyO", {sensitivity: sens.camera.key}],
			["g.stick.right.right", {
				with: ["g.bumper.left"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraTiltUp: [
			["KeyP", {sensitivity: sens.camera.key}],
			["g.stick.right.up", {
				with: ["g.bumper.left"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraTiltDown: [
			["BracketLeft", {sensitivity: sens.camera.key}],
			["g.stick.right.down", {
				with: ["g.bumper.left"],
				sensitivity: sens.camera.stick,
			}]
		],

		cameraZoomIn: [
			["Equal", {sensitivity: sens.zoom.key}],
			["g.up", {
				with: ["g.bumper.left"],
				sensitivity: sens.zoom.stick,
			}]
		],

		cameraZoomOut: [
			["Minus", {sensitivity: sens.zoom.key}],
			["g.down", {
				with: ["g.bumper.left"],
				sensitivity: sens.zoom.stick,
			}]
		],
	},
})

// export const gameBindings = () => Grip.bindings({
// 	normal: {
// 		sprint: [["ShiftLeft"], ["g.stick.left.click"], ["g.trigger.left"]],
//
// 		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
// 		moveDown: [["KeyS"], ["Down"], ["g.stick.left.down"]],
// 		moveLeft: [["KeyA"], ["Left"], ["g.stick.left.left"]],
// 		moveRight: [["KeyD"], ["Right"], ["g.stick.left.right"]],
//
// 		lookUp: [["KeyI"], ["g.stick.right.up"]],
// 		lookDown: [["KeyK"], ["g.stick.right.down"]],
// 		lookLeft: [["KeyJ"], ["g.stick.right.left"]],
// 		lookRight: [["KeyL"], ["g.stick.right.right"]],
//
// 		cameraReset: [["BracketRight"], ["g.y", {with: ["g.bumper.left"]}], ["g.beta"]],
//
// 		cameraSwivelLeft: [
// 			["KeyU", {sensitivity: sens.camera.key}],
// 			["g.stick.right.left", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.camera.stick,
// 			}],
// 		],
//
// 		cameraSwivelRight: [
// 			["KeyO", {sensitivity: sens.camera.key}],
// 			["g.stick.right.right", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.camera.stick,
// 			}],
// 		],
//
// 		cameraTiltUp: [
// 			["KeyP", {sensitivity: sens.camera.key}],
// 			["g.stick.right.up", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.camera.stick,
// 			}],
// 		],
//
// 		cameraTiltDown: [
// 			["BracketLeft", {sensitivity: sens.camera.key}],
// 			["g.stick.right.down", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.camera.stick,
// 			}]
// 		],
//
// 		cameraZoomIn: [
// 			["Equal", {sensitivity: sens.zoom.key}],
// 			["g.up", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.zoom.stick,
// 			}]
// 		],
//
// 		cameraZoomOut: [
// 			["Minus", {sensitivity: sens.zoom.key}],
// 			["g.down", {
// 				with: ["g.bumper.left"],
// 				sensitivity: sens.zoom.stick,
// 			}]
// 		],
// 	},
// })

