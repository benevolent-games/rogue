
import {Randy} from "@benev/toolbox"
import {Auth, Login, Pubkey} from "@authduo/authduo"
import {computed, Hex, opSignal, signal} from "@benev/slate"

import {JsonStorage} from "../tools/json-storage.js"
import {Avatar} from "../features/accounts/avatars.js"
import {Identity, RandoIdentity} from "../archimedes/net/multiplayer/types.js"
import {Account, Accountant, accountingApi, AccountPreferences, AccountRecord} from "../features/accounts/sketch.js"

export type Session = {
	login: Login
	account: Account
	accountToken: string
	accountRecord: AccountRecord
}

const randoIdentityStore = new JsonStorage<RandoIdentity>("rogue_rando")

export class AccountRecollection {
	map = new Map<string, AccountPreferences>()
	store = new JsonStorage<[string, AccountPreferences][]>("rogue_account_recollection")

	preferences: AccountPreferences | null = null

	constructor() {
		this.load()
	}

	updateLogin(login: Login | null) {
		if (!login) {
			this.preferences = null
			return
		}

		this.preferences = this.guarantee(login.thumbprint, () => ({
			name: login.name,
			avatarId: Avatar.default.id,
		}))

		if (this.preferences.name !== login.name) {
			this.preferences.name = login.name
			this.save()
		}

		return this.preferences
	}

	load() {
		this.map.clear()
		const data = this.store.get() ?? []
		for (const [k, v] of data)
			this.map.set(k, v)
	}

	save() {
		this.store.set([...this.map.entries()])
	}

	get(thumbprint: string) {
		return this.map.get(thumbprint)
	}

	guarantee(thumbprint: string, make: () => AccountPreferences) {
		let prefs = this.get(thumbprint)
		if (!prefs) {
			prefs = make()
			this.map.set(thumbprint, prefs)
			this.save()
		}
		return prefs
	}
}

export class Context {
	randy = Randy.seed(Math.random())
	
	auth = Auth.get()
	accounting = accountingApi(new Accountant()).v1
	accountingPubkey = this.accounting.pubkey()
		.then(pubkey => Pubkey.fromData(pubkey))

	randoIdentity = randoIdentityStore.guarantee(() => ({
		kind: "rando",
		id: Hex.random(32),
		avatarId: this.randy.choose(Avatar.selectKind("rando")).id,
	}))

	session = signal<Session | null>(null)
	sessionOp = opSignal<Session | null>()

	multiplayerIdentity = computed((): Identity => {
		const session = this.session.value
		const rando = this.randoIdentity
		return session
			? {kind: "account", accountToken: session.accountToken}
			: {kind: "rando", id: rando.id, avatarId: rando.avatarId}
	})

	accountRecollection = new AccountRecollection()
	get isSessionLoading() { return !this.sessionOp.isReady() }

	constructor() {

		this.accountRecollection.store.onChangeFromOutside(() => {
			this.accountRecollection.load()
			this.refreshSession()
		})

		// refresh session whenever the user logs in or out
		this.auth.onChange(login => {
			this.accountRecollection.updateLogin(login)
			this.refreshSession()
		})
	}

	async changeAvatar(avatarId: string) {
		const {preferences} = this.accountRecollection
		if (!preferences)
			throw new Error("cannot save avatar to accountRecollection, no available preferences")
		preferences.avatarId = avatarId
		this.accountRecollection.save()
		this.refreshSession()
	}

	async refreshSession() {
		const {login} = this.auth
		const {preferences} = this.accountRecollection

		if (!login || !preferences) {
			this.sessionOp.load(async() => {
				this.session.value = null
				return null
			})
			return
		}

		this.sessionOp.load(async() => {
			const pubkey = await this.accountingPubkey
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
console.log(context)

