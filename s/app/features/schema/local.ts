
import {Kv} from "../../../packs/kv/kv.js"
import {RandoIdentity} from "../accounts/ui/types.js"

export type LocalSchema = ReturnType<typeof makeLocalSchema>

export function makeLocalSchema(root: Kv) {
	const accountsRoot = root.namespace("accounts")
	const charactersRoot = root.namespace("characters")

	return {
		root,
		version: root.store<number>("version"),
		accounts: {
			root: accountsRoot,
			rando: accountsRoot.store<RandoIdentity>("rando"),
		},
		characters: {
			root: charactersRoot,
			custody: charactersRoot.store<string[]>("custody"),
		},
	}
}

