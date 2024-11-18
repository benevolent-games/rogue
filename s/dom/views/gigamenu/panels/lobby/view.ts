
import Sparrow, {AgentInfo} from "sparrow-rtc"
import {Bytename, Hex, html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer.lobby.value
	const inviteUrl = lobby.invite && Sparrow.invites.url(lobby.invite)

	// const lobbyistName = (agent: AgentInfo) => {
	// 	const idBytes = Hex.bytes(agent.id)
	// 	const reputationBytes = Hex.bytes(agent.reputation)
	// 	const firstName = Bytename.string(idBytes.slice(0, 2), "Xxxxxx ")
	// 	const lastName = Bytename.string(reputationBytes.slice(0, 3), "Xxxxxxxxx ")
	// 	return `${firstName} ${lastName}`
	// }

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
						${seat.agent ? html`
							<span x-agent-id>${seat.agent.id.slice(0, 8)}</span>
							<span x-agent-reputation>${seat.agent.reputation.slice(0, 8)}</span>
						` : null}
						<span x-replicator-id>${seat.replicatorId}</span>
						${seat.identity ? html`
							<span x-identity-kind>${seat.identity.kind}</span>
							${seat.identity.kind === "account" ? html`
								<span x-identity-account-token>${seat.identity.accountToken.slice(0, 8)}</span>
							` : html`
								<span x-identity-id>${seat.identity.id.slice(0, 8)}</span>
								<span x-identity-avatar-id>${seat.identity.avatarId}</span>
							`}
						` : null}
					</li>
				`)}
			</ol>
		</section>
	`

	// const renderLocalLobbyist = (lobbyist: LocalLobbyist) => {
	// 	const agent = getAgent(lobbyist)
	// 	return agent ? html`
	// 		<li>
	// 			<span x-name>${lobbyistName(agent)}</span>
	// 			<span x-identity>${lobbyist.registration.identity.kind}</span>
	// 		</li>
	// 	` : html`
	// 		<li>
	// 			<span x-identity>${lobbyist.registration.identity.kind}</span>
	// 		</li>
	// 	`
	// }
	//
	// const renderRemoteLobbyist = (lobbyist: RemoteLobbyist) => {
	// 	const agent = getAgent(lobbyist)
	// 	return agent ? html`
	// 		<li>
	// 			<span x-name>${lobbyistName(agent)}</span>
	// 			<span x-identity>${lobbyist.registration?.identity?.kind}</span>
	// 			<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
	// 		</li>
	// 	` : html`
	// 		<li>
	// 			<span x-identity>${lobbyist.registration?.identity?.kind}</span>
	// 			<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
	// 		</li>
	// 	`
	// }
	//
	// const renderLobbyist = (lobbyist: Lobbyist) => {
	// 	switch (lobbyist.kind) {
	// 		case "local": return renderLocalLobbyist(lobbyist)
	// 		case "remote": return renderRemoteLobbyist(lobbyist)
	// 	}
	// }

	// const renderLobbyist = (lobbyist: Lobbyist) => {
	// 	const agent = getAgent(lobbyist)
	// 	return agent ? html`
	// 	` : html`
	// 		<li>
	// 			<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
	// 			${lobby && (() => {
	// 				const real = lobby.lobbyists.value.get(display.id)
	// 				if (!real) return null
	// 				if (real.kind !== "client") return null
	// 				if (!real.connection) return null
	// 				const {connection} = real
	// 				return html`
	// 					<button @click="${() => connection.disconnect()}">kick</button>
	// 				`
	// 			})()}
	// 		</li>
	// 	`
	// }

})

