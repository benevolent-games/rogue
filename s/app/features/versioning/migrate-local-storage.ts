
import {Kv} from "../../../packs/kv/kv.js"

const latestVersion = 1

export async function migrateLocalStorage(kv: Kv) {
	await kv.versionMigration("version", latestVersion, async version => {
		localStorage.clear()
		console.log(`cleared localStorage for migration, v${version} to v${latestVersion}`)
	})
}

