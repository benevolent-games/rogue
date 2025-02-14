
import {Randy} from "@benev/toolbox"
import {Auth, Login} from "@authlocal/authlocal"
import {Hex, Op, opSignal, pubsub} from "@benev/slate"

import {Account} from "../types.js"
import {Commons} from "../../../types.js"
import {Avatar} from "../avatars/avatar.js"
import {RandoIdentity, Session} from "./types.js"

export class AccountManager {
	static async make(options: Commons) {
		const rando = await options.kv.guarantee("rogue.rando", () => ({
			kind: "rando",
			id: Hex.random(32),
			avatarId: new Randy().choose(Avatar.selectKind("rando")).id,
		}))
		return new this(options, rando)
	}

	auth = Auth.get()
	onSessionChange = pubsub<[Session | null]>()
	sessionOpSignal = opSignal<Session | null>(Op.loading())

	get session() {
		return Op.payload(this.sessionOpSignal.value) ?? null
	}

	constructor(public options: Commons, public rando: RandoIdentity) {
		this.load(this.auth.login)
		this.auth.onChange(login => void this.load(login))
	}

	async load(login: Login | null) {
		if (login === null) {
			this.sessionOpSignal.setReady(null)
			this.onSessionChange.publish(null)
			return null
		}
		return this.sessionOpSignal.load(async() => {
			const proofToken = login.proof.token
			const {decree, record} = await this.options
				.api.v1.accountant.loadAccount({proofToken})
			const account = await this.options.verifier.verify<Account>(decree)
			const session: Session = {login, account, accountRecord: record, accountDecree: decree}
			this.onSessionChange.publish(session)
			return session
		})
	}

	async savePreferences(avatarId: string) {
		if (this.session) {
			const {login} = this.session
			const proofToken = login.proof.token
			const {decree, record} = await this.options
				.api.v1.accountant.saveAccount({proofToken}, {
					avatarId,
					name: login.name,
				})
			const account = await this.#verifyAccountDecree(decree)
			const session: Session = {login, account, accountRecord: record, accountDecree: decree}
			this.sessionOpSignal.setReady(session)
			this.onSessionChange.publish(session)
		}
	}

	async #verifyAccountDecree(decree: string) {
		return this.options.verifier.verify<Account>(decree)
	}
}

