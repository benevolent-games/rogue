
import {Scalar} from "@benev/toolbox"

export class Health {
	value = 20

	hurt(damage: number) {
		this.value = Scalar.clamp(this.value - damage)
	}

	isDead() {
		return this.value <= 0
	}
}

