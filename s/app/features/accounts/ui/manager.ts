
import {Randy} from "@benev/toolbox"
import {Auth, Login} from "@authlocal/authlocal"
import {computed, Hex, Op, opSignal, pubsub, Signal} from "@benev/slate"

import {Account} from "../types.js"
import {Commons} from "../../../types.js"
import {Avatar} from "../avatars/avatar.js"
import {Identity, RandoIdentity, Session} from "./types.js"

export class AccountManager {
	static async make(options: Commons) {
		const rando = await options.kv.guarantee<RandoIdentity>("rando", () => ({
			kind: "rando",
			id: Hex.random(32),
			avatarId: new Randy().choose(Avatar.selectKind("rando")).id,
		}))
		return new this(options, rando)
	}

	auth = Auth.get()
	onSessionChange = pubsub<[Session | null]>()
	sessionOp = opSignal<Session | null>(Op.loading())
	session = computed(() => Op.payload(this.sessionOp.value) ?? null)
	isSessionLoading = computed(() => Op.is.loading(this.sessionOp.value))

	multiplayerIdentity: Signal<Identity>

	constructor(public options: Commons, public randoIdentity: RandoIdentity) {
		this.multiplayerIdentity = computed((): Identity => {
			const {randoIdentity} = this
			const session = this.session.value
			return session
				? {kind: "account", accountDecree: session.accountDecree}
				: {kind: "rando", id: randoIdentity.id, avatarId: randoIdentity.avatarId}
		})
		this.load(this.auth.login)
		this.auth.onChange(login => void this.load(login))
	}

	async verifyAccountDecree(decree: string) {
		return this.options.verifier.verify<Account>(decree)
	}

	async #loadAccountAndMaybeSave(login: Login) {
		const proofToken = login.proof.token
		const accountReport = await this.options
			.api.v1.accountant.loadAccount({proofToken})

		// update name upon login
		if (accountReport.record.preferences.name !== login.name) {
			const savedReport = await this.options.api.v1.accountant.saveAccount(
				{proofToken},
				{...accountReport.record.preferences, name: login.name},
			)
			return savedReport
		}

		return accountReport
	}

	async load(login: Login | null) {
		if (login === null) {
			this.sessionOp.setReady(null)
			this.onSessionChange.publish(null)
			return null
		}
		return this.sessionOp.load(async() => {
			const {decree, record} = await this.#loadAccountAndMaybeSave(login)
			const account = await this.options.verifier.verify<Account>(decree)
			const session: Session = {login, account, accountRecord: record, accountDecree: decree}
			this.onSessionChange.publish(session)
			return session
		})
	}

	async savePreferences(avatarId: string) {
		const session = this.session.value
		if (session) {
			await this.sessionOp.load(async() => {
				const {login} = session
				const proofToken = login.proof.token
				const {decree, record} = await this.options
					.api.v1.accountant.saveAccount({proofToken}, {
						avatarId,
						name: login.name,
					})
				const account = await this.#verifyAccountDecree(decree)
				const newSession: Session = {login, account, accountRecord: record, accountDecree: decree}
				return newSession
			})
		}
		this.onSessionChange.publish(this.session.value!)
	}

	async #verifyAccountDecree(decree: string) {
		return this.options.verifier.verify<Account>(decree)
	}
}

