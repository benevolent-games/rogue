
import {Changer} from "./changer.js"
import {isPressed} from "../utils/is-pressed.js"

export class Cause {
	input = new Changer(0)
	pressed = new Changer(false)

	set(input: number, pressed?: boolean) {
		this.input.value = input
		this.pressed.value = pressed ?? isPressed(input)
	}
}

