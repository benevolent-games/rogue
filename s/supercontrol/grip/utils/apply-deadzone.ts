
import {Scalar} from "@benev/toolbox"

export function applyDeadzone(value: number, deadzone: number) {
	if (value < deadzone)
		return 0

	if (value > 1)
		return value

	return Scalar.remap(
		value,
		deadzone, 1,
		0, 1,
	)
}

