
import Sparrow, { AgentInfo } from "sparrow-rtc"
import {Bytename, Hex, html, Op, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {MultiplayerHost} from "../../../../../logic/multiplayer/multiplayer-host.js"
import {MultiplayerClient} from "../../../../../logic/multiplayer/multiplayer-client.js"
import {Lobbyist, LocalLobbyist, RemoteLobbyist} from "../../../../../logic/multiplayer/lobby/manager.js"

export const LobbyView = shadowView(use => (multiplayer: MultiplayerHost | MultiplayerClient) => {
	use.styles(themeCss, stylesCss)

	const lobby = multiplayer instanceof MultiplayerHost
		? multiplayer.lobby.value
		: null

	if (!lobby)
		return null

	const inviteUrl = lobby.online?.invite
		&& Sparrow.invites.url(lobby.online.invite)

	const getAgent = (lobbyist: Lobbyist) => {
		return (lobbyist.kind === "local")
			? lobby.online?.agent
			: lobbyist.agent
	}

	const lobbyistName = (agent: AgentInfo) => {
		const idBytes = Hex.bytes(agent.id)
		const reputationBytes = Hex.bytes(agent.reputation)
		const firstName = Bytename.string(idBytes.slice(0, 2), "Xxxxxx ")
		const lastName = Bytename.string(reputationBytes.slice(0, 3), "Xxxxxxxxx ")
		return `${firstName} ${lastName}`
	}

	const renderLocalLobbyist = (lobbyist: LocalLobbyist) => {
		const agent = getAgent(lobbyist)
		return agent ? html`
			<li>
				<span x-name>${lobbyistName(agent)}</span>
				<span x-identity>${lobbyist.registration.identity.kind}</span>
			</li>
		` : html`
			<li>
				<span x-identity>${lobbyist.registration.identity.kind}</span>
			</li>
		`
	}

	const renderRemoteLobbyist = (lobbyist: RemoteLobbyist) => {
		const agent = getAgent(lobbyist)
		return agent ? html`
			<li>
				<span x-name>${lobbyistName(agent)}</span>
				<span x-identity>${lobbyist.registration?.identity?.kind}</span>
				<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
			</li>
		` : html`
			<li>
				<span x-identity>${lobbyist.registration?.identity?.kind}</span>
				<span x-connectivity>${lobbyist.connectionInfo?.kind ?? "??"}</span>
			</li>
		`
	}

	const renderLobbyist = (lobbyist: Lobbyist) => {
		switch (lobbyist.kind) {
			case "local": return renderLocalLobbyist(lobbyist)
			case "remote": return renderRemoteLobbyist(lobbyist)
		}
	}

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

	return html`
		<section>
			${inviteUrl && html`
				<div>
					<strong>invite:</strong>
					<a href="${inviteUrl}" target="_blank">${inviteUrl.slice(0, 14)}</a>
				</div>
			`}
			<ol>
				${lobby.lobbyists.map(renderLobbyist)}
			</ol>
		</section>
	`
})

