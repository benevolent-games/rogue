
import Sparrow from "sparrow-rtc"
import {html, shadowView, signal} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"
import { AccountCardView } from "../../../account-card/view.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer.lobby.value
	const inviteUrl = lobby.invite && Sparrow.invites.url(lobby.invite)

	return html`
		<section>
			${inviteUrl && html`
				<div>
					<strong>invite:</strong>
					<a href="${inviteUrl}" target="_blank">${inviteUrl.slice(0, 14)}..</a>
				</div>
			`}
			<div>
				<strong>online:</strong>
				<span>${lobby.online ? "✅" : "❌"}</span>
			</div>
			<ol>
				${lobby.seats.map(seat => html`
					<li>
						${seat.agent && html`
							<span x-agent-id>${seat.agent.id.slice(0, 8)}</span>
							<span x-agent-reputation>${seat.agent.reputation.slice(0, 8)}</span>
						`}
						<span x-replicator-id>${seat.replicatorId}</span>
						${seat.identity && html`
							<span x-identity-kind>${seat.identity.kind}</span>
							${AccountCardView([seat.identity, false])}
							${seat.identity.kind === "account" ? html`
								<span x-identity-account-token>${seat.identity.accountToken.slice(0, 8)}</span>
							` : html`
								<span x-identity-id>${seat.identity.id.slice(0, 8)}</span>
								<span x-identity-avatar-id>${seat.identity.avatarId}</span>
							`}
						`}
						${seat.connectionStats && html`
							<span x-stats-kind>${seat.kind === "local" ? "host" : seat.connectionStats.kind}</span>
							<span x-stats-ping>${seat.connectionStats.ping && seat.connectionStats.ping.toFixed(0)} ms</span>
						`}
					</li>
				`)}
			</ol>
		</section>
	`
})

