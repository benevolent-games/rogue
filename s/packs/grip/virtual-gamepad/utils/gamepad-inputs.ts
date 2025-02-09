
export type GamepadInputs = ReturnType<typeof gamepadInputs>

export function gamepadInputs() {
	return {
		"g.stick.left.up": 0,
		"g.stick.left.down": 0,
		"g.stick.left.left": 0,
		"g.stick.left.right": 0,

		"g.stick.right.up": 0,
		"g.stick.right.down": 0,
		"g.stick.right.left": 0,
		"g.stick.right.right": 0,

		"g.stick.left.click": 0,
		"g.stick.right.click": 0,

		"g.a": 0,
		"g.b": 0,
		"g.x": 0,
		"g.y": 0,

		"g.up": 0,
		"g.down": 0,
		"g.left": 0,
		"g.right": 0,

		"g.trigger.left": 0,
		"g.trigger.right": 0,

		"g.bumper.left": 0,
		"g.bumper.right": 0,

		"g.alpha": 0,
		"g.beta": 0,
		"g.gamma": 0,
	}
}

