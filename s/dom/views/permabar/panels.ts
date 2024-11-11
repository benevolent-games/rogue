
import {auth} from "@authduo/authduo"
import {html, RenderResult, Signal} from "@benev/slate"

import {LobbyView} from "../lobby/lobby.js"
import menuSvg from "../../icons/tabler/menu.svg.js"
import userSvg from "../../icons/tabler/user.svg.js"
import {Lobby} from "../../../logic/lobby/lobby.js"
import {LobbyDisplay} from "../../../logic/lobby/types.js"
import userFilledSvg from "../../icons/tabler/user-filled.svg.js"
import usersGroupSvg from "../../icons/tabler/users-group.svg.js"

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

export class LobbyPanel {
	constructor(public options: {lobbyDisplay: Signal<LobbyDisplay>, lobby: Lobby | null}) {}
	button = () => usersGroupSvg
	content = () => LobbyView([this.options])
}

