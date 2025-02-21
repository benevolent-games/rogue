
import {authorize} from "renraku"
import {Auth} from "@authlocal/authlocal"
import {computed, opSignal, Signal} from "@benev/slate"

import {AccountKind} from "../types.js"
import {Commons} from "../../../types.js"
import {Identity, Session} from "./types.js"
import {assembleAccount} from "../utils/assemble-account.js"
import {makeSessionLoader, SessionLoader} from "./utils/session-loader.js"

export class AccountManager {
	static async make(commons: Commons) {
		const auth = Auth.get()
		const sessionLoader = await makeSessionLoader(commons, auth)
		return new this(auth, commons, sessionLoader)
	}

	session: Signal<Session>
	loadingOp = opSignal<void>()
	identity: Signal<Identity>

	constructor(
			public auth: Auth,
			private commons: Commons,
			private sessionLoader: SessionLoader,
		) {

		this.session = sessionLoader.session
		this.loadingOp.setReady(undefined)
		this.auth.onChange(() => void this.reload())
		this.identity = computed(() => ({accountDecree: this.session.value.accountDecree}))
	}

	async obtain() {
		return this.sessionLoader.obtain()
	}

	async reload() {
		return this.sessionLoader.reload()
	}

	get #api() {
		return authorize(this.commons.api.v1.accountant, async() => ({
			kind: "authlocal" as AccountKind,
			proofToken: (await this.obtain()).login.proof.token,
		}))
	}

	async savePreferences(avatarId: string) {
		return this.loadingOp.load(async() => {
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

