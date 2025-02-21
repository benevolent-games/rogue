
import {Kv} from "../../../packs/kv/kv.js"
import {AccountRecord} from "../accounts/types.js"
import {CharacterRecord, CharacterOwner} from "../characters/types.js"

export type DatabaseSchema = ReturnType<typeof makeDatabaseSchema>

export function makeDatabaseSchema(root: Kv) {
	return {
		root,
		version: root.store<number>("version"),
		accounts: {
			records: root.namespace<AccountRecord>("accounts.records"),
		},
		characters: {
			records: root.namespace<CharacterRecord>("characters.records"),
			owners: root.namespace<CharacterOwner>("characters.owners"),
		},
	}
}

