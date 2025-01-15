
import {Grip} from "../../../supercontrol/grip/grip.js"

export type GameBindings = ReturnType<typeof gameBindings>

export const gameBindings = () => Grip.bindings({
	normal: {
		sprint: [["ShiftLeft"], ["g.stick.left.click"], ["g.bumper.left"], ["g.trigger.left"]],

		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
		moveDown: [["KeyS"], ["Down"], ["g.stick.left.down"]],
		moveLeft: [["KeyA"], ["Left"], ["g.stick.left.left"]],
		moveRight: [["KeyD"], ["Right"], ["g.stick.left.right"]],

		lookUp: [["KeyI"], ["g.stick.right.up"]],
		lookDown: [["KeyK"], ["g.stick.right.down"]],
		lookLeft: [["KeyJ"], ["g.stick.right.left"]],
		lookRight: [["KeyL"], ["g.stick.right.right"]],

		cameraTiltUp: [["KeyP"], ["g.stick.right.up", "g.stick.right.click"]],
		cameraTiltDown: [["Semicolon"], ["g.stick.right.down", "g.stick.right.click"]],

		// cameraTiltUp: [["KeyP"], ["g.stick.right.up", {with: ["g.bumper.left"]}]],
		// cameraTiltDown: [["Semicolon"], ["g.stick.right.down", "g.stick.right.click"]],
	},
})

