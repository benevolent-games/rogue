
import {Kv} from "../../../packs/kv/kv.js"

const latestVersion = 2

export async function migrateLocalStorage(kv: Kv) {
	await kv.versionMigration("version", latestVersion, async version => {

		if (version < 2) {
			await kv.clear()
			console.log(`cleared localStorage for migration, v${version} to v${latestVersion}`)
		}
	})
}

