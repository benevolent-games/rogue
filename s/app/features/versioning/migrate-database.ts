
import {Kv} from "../../../packs/kv/kv.js"

const latestVersion = 1

export async function migrateDatabase(kv: Kv) {
	const characters = kv.namespace("characters")
	await kv.versionMigration("version", latestVersion, async version => {

		// upgrade from 0 to 1, by clearing characters (due to schema change)
		if (version < 1) {
			await characters.clear()
			console.log("cleared characters for database migration")
		}
	})
}

