
import {Kv} from "../../../packs/kv/kv.js"
import {LoginTokens, PassportData} from "@authlocal/authlocal"

export type LocalSchema = ReturnType<typeof makeLocalSchema>

export function makeLocalSchema(root: Kv) {
	return {
		root,
		version: root.store<number>("version"),
		accounts: {
			rando: {
				passport: root.store<PassportData>("accounts.rando.passport"),
				login: root.store<LoginTokens>("accounts.rando.login"),
			},
		},
		characters: {
			custody: root.store<string[]>("characters.custody"),
		},
	}
}

