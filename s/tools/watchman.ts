
export class Watchman {
	constructor(public hz: number) {}

	perSecond(n: number) {
		return n / this.hz
	}
}

