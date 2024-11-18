
import {Randy} from "@benev/toolbox"
import {computed, Hex, nap, opSignal, signal} from "@benev/slate"
import {Auth, Login, Pubkey} from "@authduo/authduo"

import {Avatar} from "../features/accounts/avatars.js"
import {Account, Accountant, accountingApi, AccountPreferences, AccountRecord} from "../features/accounts/sketch.js"
import { Identity } from "../logic/multiplayer/types.js"

export type Session = {
	login: Login
	account: Account
	accountToken: string
	accountRecord: AccountRecord
}

export type Guest = {
	id: string
	avatar: Avatar
}

export class Context {
	randy = Randy.seed(Math.random())
	
	auth = Auth.get()
	accounting = accountingApi(new Accountant()).v1
	accountingPubkey = this.accounting.pubkey()

	guest: Guest = {
		id: Hex.random(32),
		avatar: this.randy.choose(
			[...Avatar.library.values()]
				.filter(avatar => avatar.kind === "free")
		)
	}

	session = signal<Session | null>(null)
	sessionOp = opSignal<Session | null>()

	multiplayerIdentity = computed((): Identity => {
		const session = this.session.value
		const guest = this.guest
		return session
			? {kind: "account", accountToken: session.accountToken}
			: {kind: "anon", id: guest.id, avatarId: guest.avatar.id}
	})

	get isSessionLoading() { return !this.sessionOp.isReady() }

	constructor() {

		// refresh session whenever the user logs in or out
		this.auth.onChange(login => this.refreshSession({
			name: login?.name ?? "unknown",
			avatarId: Avatar.default.id,
		}))
	}

	async refreshSession(preferences: AccountPreferences) {
		const {login} = this.auth

		if (!login) {
			this.sessionOp.load(async() => {
				this.session.value = null
				return null
			})
			return undefined
		}

		this.sessionOp.load(async() => {

			// TODO remove fake lag
			await nap(200)

			const pubkey = await Pubkey.fromData(await this.accountingPubkey)
			const proofToken = login.proof.token
			const {accountToken, accountRecord} = await this
				.accounting.authed.query(proofToken, preferences)
			const account = (await pubkey.verify<{data: Account}>(accountToken)).data
			const session: Session = {login, account, accountToken, accountRecord}
			this.session.value = session
			return session
		})
	}
}

export const context = new Context()

