
import {authorize} from "renraku"
import {Auth} from "@authlocal/authlocal"
import {signal, Signal} from "@benev/slate"

import {AccountKind} from "../types.js"
import {Commons} from "../../../types.js"
import {Identity, Session} from "./types.js"
import {loadSession} from "./utils/load-session.js"
import {assembleAccount} from "../utils/assemble-account.js"

export class AccountManager {
	static async make(commons: Commons) {
		const auth = Auth.get()
		const session = await loadSession(commons, auth.login)
		return new this(commons, auth, session)
	}

	session: Signal<Session>
	isSessionLoading = signal(false)

	constructor(public commons: Commons, public auth: Auth, session: Session) {
		this.session = signal(session)
		this.auth.onChange(async login => {
			await this.#loadSession(async() => {
				this.session.value = await loadSession(commons, login)
			})
		})
	}

	get #api() {
		return authorize(this.commons.api.v1.accountant, async() => ({
			kind: "authlocal" as AccountKind,
			proofToken: this.session.value.login.proof.token,
		}))
	}

	get identity(): Identity {
		return {accountDecree: this.session.value.accountDecree}
	}

	#loadSession<T>(fn: () => Promise<T>) {
		try {
			this.isSessionLoading.value = true
			return fn()
		}
		finally {
			this.isSessionLoading.value = false
		}
	}

	async savePreferences(avatarId: string) {
		return this.#loadSession(async() => {
			const {login} = this.session.value
			const {accountRecord, accountDecree} = await this.#api.saveAccount({
				avatarId,
				name: login.name,
			})
			this.session.value = {
				login,
				accountRecord,
				accountDecree,
				account: assembleAccount(accountRecord.thumbprint, accountRecord),
			}
		})
	}
}

