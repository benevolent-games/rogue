
import {ev, signal} from "@benev/slate"

export class HashRouter {
	static get hash() {
		return window.location.hash.replace(/^#/, "")
	}

	path = signal<string>(HashRouter.hash)

	dispose = ev(window, {
		hashchange: () => {
			this.path.value = HashRouter.hash
		},
	})

	goto(path: string) {
		window.location.hash = path
	}
}

