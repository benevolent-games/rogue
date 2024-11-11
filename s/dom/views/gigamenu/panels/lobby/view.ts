
import Sparrow from "sparrow-rtc"
import {Bytename, Hex, html, shadowView, Signal} from "@benev/slate"

import {Lobby} from "../../../../../logic/lobby/lobby.js"
import {LobbyDisplay} from "../../../../../logic/lobby/types.js"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"

export type LobbyViewOptions = {
	lobby: Lobby | null
	lobbyDisplay: Signal<LobbyDisplay>
}

export const LobbyView = shadowView(use => (options: LobbyViewOptions) => {
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
		<section>
			${lobbyDisplay.invite && html`
				<div>
					<strong>invite:</strong> <a href="${inviteUrl}" target="_blank">${inviteUrl}</a>
				</div>
			`}
			<ol>
				${lobbyDisplay.lobbyists.map(display => html`
					<li>
						<span x-name>${lobbyistName(display)}</span>
						<span x-connectivity>${display.connectionInfo?.kind ?? "??"}</span>
						${lobby && (() => {
							const real = lobby.lobbyists.value.get(display.id)
							if (!real) return null
							if (real.kind !== "client") return null
							if (!real.connection) return null
							const {connection} = real
							return html`
								<button @click="${() => connection.disconnect()}">kick</button>
							`
						})()}
					</li>
				`)}
			</ol>
		</section>
	`
})

