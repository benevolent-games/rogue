
import {opSignal} from "@benev/slate"
import {auth, Pubkey, Token} from "@authduo/authduo"

import {Avatar} from "../features/accounts/avatars.js"
import {Account, Accountant, accountingApi, AccountPreferences, AccountRecord} from "../features/accounts/sketch.js"

export type Session = {
	account: Account
	accountToken: string
	accountRecord: AccountRecord
}

export class Context {
	accounting = accountingApi(new Accountant()).v1
	sessionOp = opSignal<Session | null>()

	accountingPubkey = this.accounting.pubkey()

	constructor() {
		console.log("context started!", auth.login)
		auth.onChange(login => {
			console.log("AUTH ONCHANGE", login)

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
				const account = await Token.verify<Account>(pubkey, accountToken)
				console.log("account loaded!", account)
				return {account, accountToken, accountRecord}
			})
		})
	}
}

export const context = new Context()

