
import {Auth} from "@authduo/authduo"
import {html, RenderResult} from "@benev/slate"
import userOffSvg from "../../icons/tabler/user-off.svg.js"
import userCheckSvg from "../../icons/tabler/user-check.svg.js"

export type Panel = {
	button: RenderResult
	content: () => RenderResult
}

export type PanelName = keyof ReturnType<typeof renderPanels>

export const renderPanels = (auth: Auth) => ({

	login: {
		button: auth.login ? userCheckSvg : userOffSvg,
		content: () => html`
			<auth-login></auth-login>
		`,
	},

} satisfies Record<string, Panel>)

