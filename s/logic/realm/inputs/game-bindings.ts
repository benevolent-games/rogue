
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
		menu: [["KeyB"], ["g.alpha"], ["g.gamma"]],

		attack: [["LMB"], ["g.trigger.right"]],
		block: [["RMB"], ["g.trigger.left"]],

		sprint: [["ShiftLeft"], ["g.stick.left.click"]],

		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
		moveDown: [["KeyS"], ["Down"], ["g.stick.left.down"]],
		moveLeft: [["KeyA"], ["Left"], ["g.stick.left.left"]],
		moveRight: [["KeyD"], ["Right"], ["g.stick.left.right"]],

		lookUp: [["KeyI"], ["g.stick.right.up", {without: ["g.stick.right.click"]}]],
		lookDown: [["KeyK"], ["g.stick.right.down", {without: ["g.stick.right.click"]}]],
		lookLeft: [["KeyJ"], ["g.stick.right.left", {without: ["g.stick.right.click"]}]],
		lookRight: [["KeyL"], ["g.stick.right.right", {without: ["g.stick.right.click"]}]],

		cameraReset: [
			["BracketRight"],
			["g.beta"],
			["g.stick.right.click", {style: "tap"}],
			["MMB", {style: "tap"}],
		],

		cameraSwivelRight: [
			["KeyU", {sensitivity: sens.camera.key}],
			["g.stick.right.left", {
				with: ["g.stick.right.click"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraSwivelLeft: [
			["KeyO", {sensitivity: sens.camera.key}],
			["g.stick.right.right", {
				with: ["g.stick.right.click"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraTiltDown: [
			["KeyP", {sensitivity: sens.camera.key}],
			["g.stick.right.up", {
				with: ["g.stick.right.click"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraTiltUp: [
			["BracketLeft", {sensitivity: sens.camera.key}],
			["g.stick.right.down", {
				with: ["g.stick.right.click"],
				sensitivity: sens.camera.stick,
			}],
		],

		cameraZoomIn: [
			["Equal", {sensitivity: sens.zoom.key}],
			["g.up", {
				with: ["g.stick.right.click"],
				sensitivity: sens.zoom.stick,
			}],
		],

		cameraZoomOut: [
			["Minus", {sensitivity: sens.zoom.key}],
			["g.down", {
				with: ["g.stick.right.click"],
				sensitivity: sens.zoom.stick,
			}],
		],
	},
})

