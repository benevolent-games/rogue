
import {Auth} from "@authduo/authduo"
import {html, RenderResult} from "@benev/slate"
import userSvg from "../../icons/tabler/user.svg.js"
import userFilledSvg from "../../icons/tabler/user-filled.svg.js"

export type Panel = {
	button: RenderResult
	content: () => RenderResult
}

export type PanelName = keyof ReturnType<typeof renderPanels>

export const renderPanels = (auth: Auth) => ({

	login: {
		button: auth.login ? userFilledSvg : userSvg,
		content: () => html`
			<auth-login></auth-login>
		`,
	},

} satisfies Record<string, Panel>)

