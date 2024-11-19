
import Sparrow from "sparrow-rtc"
import {Bytename, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {IdView} from "../../../id/view.js"
import themeCss from "../../../../theme.css.js"
import {AccountCardView} from "../../../account-card/view.js"
import {LobbySeat} from "../../../../../logic/framework/relay/cathedral.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer.lobby.value
	const inviteUrl = lobby.invite && Sparrow.invites.url(lobby.invite)

	const fullName = (hex: string) => Bytename.string(
		Hex.bytes(hex).slice(0, 5),
		"Xxxxxx Xxxxxxxxx ",
	)

	const renderLobbySeat = (seat: LobbySeat) => html`
		<li data-id="${seat.replicatorId}">
			<div x-card>
				${seat.identity && AccountCardView([seat.identity, false])}
			</div>

			<div x-net>
				${seat.connectionStats && html`
					<span x-stats-ping>${seat.connectionStats.ping && seat.connectionStats.ping.toFixed(0)} ms</span>
					<span x-stats-kind>${seat.kind === "local" ? "host" : seat.connectionStats.kind}</span>
				`}
				${seat.agent && html`
					<span x-agent-name>
						${IdView([seat.agent.reputation, fullName(seat.agent.reputation)])}
					</span>
				`}
			</div>
		</li>
	`

	return html`
		<section>
			<header>
				<div>
					<span>${lobby.online ? "🟢 online" : "❌ offline"}</span>
				</div>
				${inviteUrl && html`
					<div>
						<a href="${inviteUrl}" target="_blank">${inviteUrl.slice(0, 14)}..</a>
					</div>
				`}
			</header>

			<ol>
				${lobby.seats.map(renderLobbySeat)}
			</ol>
		</section>
	`
})

