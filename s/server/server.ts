
import {Keychain} from "./utils/keychain.js"
import {Accountant} from "./accounts/accountant.js"
import {Characters} from "./characters/characters.js"

export class Server {
	constructor(
		public keychain: Keychain,
		public accountant: Accountant,
		public characters: Characters,
	) {}

	static async make() {
		const keychain = await Keychain.temp()
		const accountant = new Accountant(keychain)
		const characters = new Characters(keychain)
		return new this(keychain, accountant, characters)
	}

	makeApi = () => ({v1: {
		pubkey: async() => this.keychain.pubkeyJson,
		accounting: this.accountant.api(),
		characters: this.characters.api(),
	}})
}

