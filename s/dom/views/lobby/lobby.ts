
import Sparrow from "sparrow-rtc"
import {Bytename, Hex, html, shadowView, Signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../theme.css.js"
import {Lobby} from "../../../logic/lobby/lobby.js"
import {LobbyDisplay} from "../../../logic/lobby/types.js"

export const LobbyView = shadowView(use => (options: {
		lobby: Lobby | null
		lobbyDisplay: Signal<LobbyDisplay>
	}) => {

	use.styles(themeCss, stylesCss)

	const lobby = options.lobby
	const lobbyDisplay = options.lobbyDisplay.value

	const inviteUrl = lobbyDisplay.invite && Sparrow.invites.url(lobbyDisplay.invite)

	function lobbyistName(lobbyist: {id: string, reputation: string}) {
		const idBytes = Hex.bytes(lobbyist.id)
		const reputationBytes = Hex.bytes(lobbyist.reputation)
		const firstName = Bytename.string(idBytes.slice(0, 2), "Xxxxxx ")
		const lastName = Bytename.string(reputationBytes.slice(0, 3), "Xxxxxxxxx ")
		return `${firstName} ${lastName}`
	}

	return html`
		${lobbyDisplay.invite && html`
			<div>
				<strong>invite:</strong> <a href="${inviteUrl}" target="_blank">${inviteUrl}</a>
			</div>
		`}
		<ol>
			${lobbyDisplay.lobbyists.map(lobbyist => html`
				<li>
					<span x-name>${lobbyistName(lobbyist)}</span>
					<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
					${lobby && (() => {
						const realLobbyist = lobby.lobbyists.value.get(lobbyist.id)
						if (!realLobbyist) return null
						if (realLobbyist.kind !== "client") return null
						if (!realLobbyist.connection) return null
						const {connection} = realLobbyist
						return html`
							<button @click="${() => connection.disconnect()}">kick</button>
						`
					})()}
				</li>
			`)}
		</ol>
	`
})

