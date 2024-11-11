
import Sparrow from "sparrow-rtc"
import {Bytename, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {MultiplayerHost} from "../../../../../logic/multiplayer/multiplayer-host.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerHost | MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer instanceof MultiplayerHost
		? multiplayer.lobby
		: null

	const lobbyDisplay = multiplayer.lobbyDisplay.value

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

