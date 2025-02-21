
import {Kv} from "../../../packs/kv/kv.js"

const latestVersion = 1

export async function migrateDatabase(kv: Kv) {
	await kv.versionMigration("version", latestVersion, async version => {

		if (version < 1) {
		}
	})
}

