
import {nap, Op, opSignal, signal} from "@benev/slate"
import {Auth, Login, Pubkey} from "@authduo/authduo"

import {Avatar} from "../features/accounts/avatars.js"
import {Account, Accountant, accountingApi, AccountPreferences, AccountRecord} from "../features/accounts/sketch.js"

export type Session = {
	login: Login
	account: Account
	accountToken: string
	accountRecord: AccountRecord
}

export class Context {
	auth = Auth.get()
	accounting = accountingApi(new Accountant()).v1
	accountingPubkey = this.accounting.pubkey()

	session = signal<Session | null>(null)
	sessionOp = opSignal<Session | null>()

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

