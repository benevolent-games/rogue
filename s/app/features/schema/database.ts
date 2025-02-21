
import {Kv} from "../../../packs/kv/kv.js"
import {AccountRecord} from "../accounts/types.js"
import {CharacterRecord, CharacterOwner} from "../characters/types.js"

export type DatabaseSchema = ReturnType<typeof makeDatabaseSchema>

export function makeDatabaseSchema(root: Kv) {
	const accountsRoot = root.namespace("accounts")
	const charactersRoot = root.namespace("characters")

	return {
		root,
		version: root.store<number>("version"),
		accounts: {
			root: accountsRoot,
			records: accountsRoot.namespace<AccountRecord>("records"),
		},
		characters: {
			root: charactersRoot,
			records: charactersRoot.namespace<CharacterRecord>("records"),
			owners: charactersRoot.namespace<CharacterOwner>("owners"),
		},
	}
}

