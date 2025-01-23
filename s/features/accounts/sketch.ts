
import {secure} from "renraku"
import {Map2, nap} from "@benev/slate"
import {Future, Keypair, Proof, Token, TokenPayload} from "@authlocal/authlocal/x/server.js"

import {Avatar} from "./avatars.js"

export type AccountTag = "founder" | "blessed" | "knighted" | "premium"

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

export const AccountTiers = {
	isAdmin(tags: AccountTag[]) {
		return (
			tags.includes("founder") ||
			tags.includes("blessed")
		)
	},
	isPremium(tags: AccountTag[]) {
		return (
			tags.includes("founder") ||
			tags.includes("blessed") ||
			tags.includes("knighted") ||
			tags.includes("premium")
		)
	},
}

export function isAvatarAllowed(avatar: Avatar, accountRecord: AccountRecord | undefined) {
	if (!accountRecord)
		return (avatar.kind === "rando")

	if (avatar.kind === "rando" || avatar.kind === "free")
		return true

	if (avatar.kind === "premium") {
		if (AccountTiers.isPremium(accountRecord.tags))
			return true
	}

	if (avatar.kind === "rare") {
		if (AccountTiers.isAdmin(accountRecord.tags))
			return true
	}

	return accountRecord.avatars.includes(avatar.id)
}

export class AccountantDatabase {
	#records = new Map2<string, AccountRecord>([

		// chase
		["670da5deea9ca8b5d472c6a1744c44b7238650103aeb2fbb8c99ed0605211753", {
			tags: ["founder"],
			avatars: [],
		}],

		// lonnie
		["43c25328c76e94c563ef5143122c7df89f7702485bf569e9051d52f79e56ab3e", {
			tags: ["founder"],
			avatars: [],
		}],

		// loshunter
		["f42af8f96865f5b830c8cb2017e8ffb0ac3fbc90c87aeda5cd356bf8d70e9219", {
			tags: ["blessed"],
			avatars: [],
		}],

		// geoff
		["a4572e10881834aa55d72a5cce832d6a570498058d3e1592361e7ee80b5ce5eb", {
			tags: ["blessed"],
			avatars: [],
		}],

		// duck
		["464bb19697e966987182a040c7127bd87239ea625a1f953cbe3f4ebb1397db41", {
			tags: ["blessed"],
			avatars: [],
		}],

		// thrills
		["25429b3b6f4685ac5bf5e752684479e9fe79eb3688433bc8d3398012d8d33568", {
			tags: ["blessed"],
			avatars: [],
		}],

		// revolux
		["94636022cac00d5b6f3c505b9cee21edca6bd7bc2061b124c3ac6c9a9cb0464a", {
			tags: ["knighted"],
			avatars: [],
		}],

		// rafuu
		["51c7692d7af585b01a3dcec2f5a6705b49936c3a00a12f3886ade7dbc2b4a62d", {
			tags: ["knighted"],
			avatars: [],
		}],

		// mope
		["47713bfb62e73de626f8071243601d775bda48d1a67d352d59265403538f8e29", {
			tags: ["blessed"],
			avatars: [],
		}],

		// tegis asvuso
		["99ce9dc3c26f57ad01be6b6305f84be7607947d73274e80d42f6378298ccf659", {
			tags: ["knighted"],
			avatars: ["JFQMRRrsA9x"],
		}],
	])

	async getRecord(thumbprint: string) {
		return this.#records.get(thumbprint) ?? {tags: [], avatars: []}
	}
}

export type AccountPayload = {data: Account} & TokenPayload

export class Accountant {
	#keypair = tempKeypair
	pubkeyJson = tempPubkeyJson
	database = new AccountantDatabase()

	async signAccountToken(account: Account) {
		return this.#keypair.sign({
			...Token.params({expiresAt: Future.hours(24)}),
			data: account,
		} satisfies AccountPayload)
	}
}

export const accountingApi = (accountant: Accountant) => ({
	v1: {
		async pubkey() {

			// TODO remove fake lag
			await nap(200)

			return accountant.pubkeyJson
		},

		authed: secure(async(proofToken: string) => {
			const {thumbprint} = await Proof.verify(proofToken, {allowedAudiences: [window.origin]})
			return {

				async query(preferences: AccountPreferences) {

					// TODO remove fake lag
					await nap(200)

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

