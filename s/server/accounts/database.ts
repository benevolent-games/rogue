
import {Kv} from "../../tools/kv/kv.js"
import {AccountRecord} from "./types.js"
import {idkey} from "../../tools/kv/utils/idkey.js"

export class AccountantDatabase {
	constructor(public kv: Kv) {}

	async setRecord(id: string, record: AccountRecord) {
		const key = idkey("accounts.records.", id)
		await this.kv.json.put(key, record)
	}

	async getRecord(id: string) {
		const key = idkey("accounts.records.", id)
		return this.kv.json.get<AccountRecord>(key)
	}
}

// const badge = (badge: string) => Badge.parse(badge).hex
// export class AccountantDatabase {
//
// 	async getRecord(thumbprint: string) {
// 		return this.#records.get(thumbprint) ?? {tags: [], avatars: []}
// 	}
//
// 	#records = new Map2<string, AccountRecord>([
//
// 		// chase
// 		[badge("magser_pinryl.3QxV42sns2JaGJZA14ChR3jZknLcokwjK3Y2Ycr"), {
// 			tags: ["founder"],
// 			avatars: [],
// 		}],
//
// 		// lonnie
// 		["43c25328c76e94c563ef5143122c7df89f7702485bf569e9051d52f79e56ab3e", {
// 			tags: ["founder"],
// 			avatars: [],
// 		}],
//
// 		// loshunter
// 		["f42af8f96865f5b830c8cb2017e8ffb0ac3fbc90c87aeda5cd356bf8d70e9219", {
// 			tags: ["blessed"],
// 			avatars: [],
// 		}],
//
// 		// geoff
// 		["a4572e10881834aa55d72a5cce832d6a570498058d3e1592361e7ee80b5ce5eb", {
// 			tags: ["blessed"],
// 			avatars: [],
// 		}],
//
// 		// duck
// 		["464bb19697e966987182a040c7127bd87239ea625a1f953cbe3f4ebb1397db41", {
// 			tags: ["blessed"],
// 			avatars: [],
// 		}],
//
// 		// thrills
// 		["25429b3b6f4685ac5bf5e752684479e9fe79eb3688433bc8d3398012d8d33568", {
// 			tags: ["blessed"],
// 			avatars: [],
// 		}],
//
// 		// revolux
// 		["94636022cac00d5b6f3c505b9cee21edca6bd7bc2061b124c3ac6c9a9cb0464a", {
// 			tags: ["knighted"],
// 			avatars: [],
// 		}],
//
// 		// rafuu
// 		["51c7692d7af585b01a3dcec2f5a6705b49936c3a00a12f3886ade7dbc2b4a62d", {
// 			tags: ["knighted"],
// 			avatars: [],
// 		}],
//
// 		// fernando
// 		["08ffa63511559e7b3c4722d03c03fa50924fb7e5b35396bb039fba7f0a419556", {
// 			tags: ["knighted"],
// 			avatars: [],
// 		}],
//
// 		// mope
// 		["47713bfb62e73de626f8071243601d775bda48d1a67d352d59265403538f8e29", {
// 			tags: ["blessed"],
// 			avatars: [],
// 		}],
//
// 		// tegis asvuso
// 		["99ce9dc3c26f57ad01be6b6305f84be7607947d73274e80d42f6378298ccf659", {
// 			tags: ["knighted"],
// 			avatars: ["JFQMRRrsA9x"],
// 		}],
// 	])
// }

