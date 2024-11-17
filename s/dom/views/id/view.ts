
import {Base58, debounce, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Idtext} from "../../../tools/idtext.js"

const time = 2000

export const IdView = shadowView(use => (hex: string) => {
	use.styles(themeCss, stylesCss)
	const text = Idtext.from(hex)

	const copyStatus = use.signal<"good" | "bad" | undefined>(undefined)

	const clearStatus = use.once(() => debounce(time, () => {
		copyStatus.value = undefined
	}))

	function copy() {
		navigator.clipboard.writeText(text)
			.then(() => { copyStatus.value = "good" })
			.catch(() => { copyStatus.value = "bad" })
			.finally(() => clearStatus())
	}

	return html`
		<span x-copy="${copyStatus}">
			<span x-text @click="${copy}">${text.slice(0, 8)}</span>
			<span x-notify=good>Copied</span>
			<span x-notify=bad>Copy Failed</span>
		</span>
	`
})

