
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Exhibit, Orchestrator} from "@benev/toolbox"

export async function handleExhibitErrors(back: () => void, fn: () => Promise<Exhibit>) {
	try {
		return await fn()
	}
	catch (error) {
		return Orchestrator.makeExhibit({
			dispose: () => {},
			template: () => ErrorScreen([error, back]),
		})
	}
}

export const ErrorScreen = shadowView(use => (error: any, back: () => void) => {
	use.styles(themeCss, stylesCss)

	const reason = error instanceof Error
		? `${error.name}: ${error.message}`
		: "An error happened."

	return html`
		<div x-plate>
			<h1>🔥 ${reason}</h1>
			<button @click="${back}">Back to main menu</button>
		</div>
	`
})

