
export class DebugTrigger {
	activated = false

	constructor() {
		window.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.code === "Space") {
				this.activated = true
				console.log("ACTIVATED!!")
			}
		})
	}
}

