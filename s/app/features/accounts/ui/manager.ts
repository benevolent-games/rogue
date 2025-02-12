
import {Randy} from "@benev/toolbox"
import {Hex, signal} from "@benev/slate"
import {Auth, Login} from "@authlocal/authlocal"

import {Account} from "../types.js"
import {Avatar} from "../avatars/avatar.js"
import {AccountManagerOptions, RandoIdentity, Session} from "./types.js"

export class AccountManager {
	static async make(options: AccountManagerOptions) {
		const rando = await options.kv.guarantee("rogue.rando", () => ({
			kind: "rando",
			id: Hex.random(32),
			avatarId: new Randy().choose(Avatar.selectKind("rando")).id,
		}))
		return new this(options, rando)
	}

	auth = Auth.get()
	session = signal<Session | null>(null)

	constructor(public options: AccountManagerOptions, public rando: RandoIdentity) {
		this.loadAccount(this.auth.login)
		this.auth.onChange(login => void this.loadAccount(login))
	}

	async loadAccount(login: Login | null) {
		if (login === null) {
			this.session.value = null
			return
		}
		const proofToken = login.proof.token
		const {accountDecree, accountRecord} = await this.options.api.v1.accountant.loadAccount({proofToken})
		const account = await this.options.verifier.verify<Account>(accountDecree)
		const session: Session = {login, account, accountRecord, accountDecree}
		this.session.value = session
		return session
	}
}

