
import {Future, Keypair, Pubkey, PubkeyData, Token, TokenPayload} from "@authlocal/authlocal"

export class Keychain {
	constructor(
		public keypair: Keypair,
		public pubkey: Pubkey,
		public pubkeyJson: PubkeyData,
	) {}

	async sign<D>(data: D) {
		return this.keypair.sign<{data: D} & TokenPayload>({
			...Token.params({expiresAt: Future.hours(24)}),
			data,
		})
	}

	static async temp() {
		const keypair = await Keypair.fromData({
			"thumbprint":"6bfcb698c942bac241d97cc3304881a0f0ccf6b125e0752855b71f346a882aca","publicKey":"3059301306072a8648ce3d020106082a8648ce3d03010703420004486014addea51508a7b8eaeca8a3c86a730153c2d3e2e267f8ca69797c52df754ec8346e13cd8ba689e3165348ddf1f94fbf1d431d7a3233940f1b1d85eb6774","privateKey":"308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104202787d63ce575b542dfe691ed2161bf2c40c89a316864d8270776241a462db3c0a14403420004486014addea51508a7b8eaeca8a3c86a730153c2d3e2e267f8ca69797c52df754ec8346e13cd8ba689e3165348ddf1f94fbf1d431d7a3233940f1b1d85eb6774"
		})
		const pubkey = keypair.toPubkey()
		const pubkeyJson = await keypair.toPubkey().toData()
		return new this(keypair, pubkey, pubkeyJson)
	}
}

