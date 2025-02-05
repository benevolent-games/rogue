
import {debounce, Hex, html, shadowView, Urname} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"

const time = 2000

export const IdView = shadowView(use => (hex: string) => {
	use.styles(themeCss, stylesCss)

	const urname = Urname.string(Hex.bytes(hex).slice(0, 4))

	const copyStatus = use.signal<"good" | "bad" | undefined>(undefined)

	const clearStatus = use.once(() => debounce(time, () => {
		copyStatus.value = undefined
	}))

	function copy() {
		navigator.clipboard.writeText(hex)
			.then(() => { copyStatus.value = "good" })
			.catch(() => { copyStatus.value = "bad" })
			.finally(() => clearStatus())
	}

	return html`
		<span x-copy="${copyStatus}" title='copy "${hex.slice(0, 16)}.."'>
			<span x-text @click="${copy}">${urname}</span>
			<span x-notify=good>Copied</span>
			<span x-notify=bad>Copy Failed</span>
		</span>
	`
})

