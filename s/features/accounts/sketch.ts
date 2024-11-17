
import {secure} from "renraku"
import {Map2} from "@benev/slate"
import {Future, Keypair, Proof, Token} from "@authduo/authduo/x/server.js"

import {Avatar} from "./avatars.js"

export type AccountTag = "admin" | "premium"

export type Account = {
	thumbprint: string
	name: string
	avatarId: string
	tags: AccountTag[]
}

export type AccountPreferences = {
	name: string
	avatarId: string
}

export type AccountRecord = {
	tags: AccountTag[]
	avatars: string[]
}

const tempKeypair = await Keypair.fromData({
	"thumbprint":"6bfcb698c942bac241d97cc3304881a0f0ccf6b125e0752855b71f346a882aca","publicKey":"3059301306072a8648ce3d020106082a8648ce3d03010703420004486014addea51508a7b8eaeca8a3c86a730153c2d3e2e267f8ca69797c52df754ec8346e13cd8ba689e3165348ddf1f94fbf1d431d7a3233940f1b1d85eb6774","privateKey":"308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104202787d63ce575b542dfe691ed2161bf2c40c89a316864d8270776241a462db3c0a14403420004486014addea51508a7b8eaeca8a3c86a730153c2d3e2e267f8ca69797c52df754ec8346e13cd8ba689e3165348ddf1f94fbf1d431d7a3233940f1b1d85eb6774"
})

const tempPubkeyJson = await tempKeypair.toPubkey().toData()

export function isAvatarAllowed(avatar: Avatar, accountRecord: AccountRecord) {
	if (avatar.kind === "free")
		return true

	const hasAdmin = accountRecord.tags.includes("admin")
	const hasPremium = accountRecord.tags.includes("premium")

	if (avatar.kind === "premium") {
		if (hasAdmin || hasPremium)
			return true
	}

	if (avatar.kind === "rare") {
		if (hasAdmin)
			return true
	}

	return accountRecord.avatars.includes(avatar.id)
}

export class AccountantDatabase {
	#records = new Map2<string, AccountRecord>([

		// chase
		["670da5deea9ca8b5d472c6a1744c44b7238650103aeb2fbb8c99ed0605211753", {
			tags: ["admin"],
			avatars: [],
		}],

		// lonnie
		["43c25328c76e94c563ef5143122c7df89f7702485bf569e9051d52f79e56ab3e", {
			tags: ["admin"],
			avatars: [],
		}],

		["47713bfb62e73de626f8071243601d775bda48d1a67d352d59265403538f8e29", {
			tags: ["premium"],
			avatars: [],
		}],

		["99ce9dc3c26f57ad01be6b6305f84be7607947d73274e80d42f6378298ccf659", {
			tags: [],
			avatars: ["JFQMRRrsA9x"],
		}],
	])

	async getRecord(thumbprint: string) {
		return this.#records.get(thumbprint) ?? {tags: [], avatars: []}
	}
}

export class Accountant {
	#keypair = tempKeypair
	pubkeyJson = tempPubkeyJson
	database = new AccountantDatabase()

	async signAccountToken(account: Account) {
		return this.#keypair.sign({
			...Token.params({expiresAt: Future.hours(24)}),
			data: account,
		})
	}
}

export const accountingApi = (accountant: Accountant) => ({
	v1: {
		async pubkey() {
			return accountant.pubkeyJson
		},

		authed: secure(async(proofToken: string) => {
			const {thumbprint} = await Proof.verify(proofToken, {allowedAudiences: [window.origin]})
			return {

				async query(preferences: AccountPreferences) {
					const accountRecord = await accountant.database.getRecord(thumbprint)
					const avatarRequested = Avatar.library.get(preferences.avatarId) ?? Avatar.default
					const avatarActual = isAvatarAllowed(avatarRequested, accountRecord)
						? avatarRequested
						: Avatar.default
					const account: Account = {
						tags: accountRecord.tags,
						avatarId: avatarActual.id,
						thumbprint,
						name: preferences.name,
					}
					const accountToken = await accountant.signAccountToken(account)
					return {accountToken, accountRecord}
				},
			}
		})
	},
})

