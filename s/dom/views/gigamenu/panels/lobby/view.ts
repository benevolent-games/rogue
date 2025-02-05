
import {html, nap, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {IdView} from "../../../id/view.js"
import themeCss from "../../../../theme.css.js"
import {Invites} from "../../../../utils/invites.js"
import {AccountCardView} from "../../../account-card/view.js"
import {LobbySeat} from "../../../../../archimedes/net/relay/cathedral.js"
import {MultiplayerClient} from "../../../../../archimedes/net/multiplayer/multiplayer-client.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer.lobby.value
	const inviteUrl = lobby.invite && Invites.url(lobby.invite)

	const renderLobbySeat = (seat: LobbySeat) => html`
		<li data-id="${seat.author}">
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
						${IdView([seat.agent.reputation])}
					</span>
				`}
			</div>
		</li>
	`

	const copyStatus = use.signal<boolean | null>(null)

	const clickToCopy = async() => {
		if (inviteUrl) {
			const url = new URL(window.location.href)
			url.hash = inviteUrl
			copyStatus.value = await navigator.clipboard.writeText(url.toString())
				.then(() => true)
				.catch(() => false)
			await nap(1100)
			copyStatus.value = null
		}
	}

	return html`
		<section>
			<header>
				<div>
					${lobby.online ? "🟢 online" : "❌ offline"}
				</div>
				${inviteUrl && html`
					<button @click="${clickToCopy}" ?disabled="${copyStatus.value !== null}">
						${(() => {switch (copyStatus.value) {
							case null: return "🔗 Copy Invite Link"
							case true: return "✅ Copied"
							case false: return "❌ Failed"
						}})()}
					</button>
				`}
			</header>

			<ol>
				${lobby.seats.map(renderLobbySeat)}
			</ol>
		</section>
	`
})

