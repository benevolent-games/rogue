
import {opSignal} from "@benev/slate"
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
	sessionOp = opSignal<Session | null>()

	accountingPubkey = this.accounting.pubkey()

	constructor() {
		this.auth.onChange(login => {
			if (!login) {
				this.sessionOp.load(async() => null)
				return undefined
			}

			this.sessionOp.load(async() => {
				const pubkey = await Pubkey.fromData(await this.accountingPubkey)
				const proofToken = login.proof.token
				const preferences: AccountPreferences = {
					name: login.name,
					avatarId: Avatar.default.id,
				}
				const {accountToken, accountRecord} = await this
					.accounting.authed.query(proofToken, preferences)
				const account = (await pubkey.verify<{data: Account}>(accountToken)).data
				console.log("account loaded!", account)
				return {login, account, accountToken, accountRecord}
			})
		})
	}
}

export const context = new Context()

