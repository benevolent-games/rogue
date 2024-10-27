
import {auth} from "@authduo/authduo"
import {html, RenderResult} from "@benev/slate"
import menuSvg from "../../icons/tabler/menu.svg.js"
import userSvg from "../../icons/tabler/user.svg.js"
import userFilledSvg from "../../icons/tabler/user-filled.svg.js"

export abstract class Panel {
	abstract button: () => RenderResult
	abstract content: () => RenderResult
}

export class LoginPanel {
	button = () => auth.login ? userFilledSvg : userSvg
	content = () => html`
		<auth-login></auth-login>
	`
}

export class MenuPanel {
	constructor(public exitToMainMenu: () => void) {}
	button = () => menuSvg
	content = () => html`
		<button class=angry @click="${this.exitToMainMenu}">exit</button>
	`
}

