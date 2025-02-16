
import {Kv} from "../../../packs/kv/kv.js"

export async function localStorageVersionMigration(kv: Kv) {
	const latestVersion = 1
	let currentVersion = (await kv.get("version")) ?? 0
	if (typeof currentVersion !== "number")
		currentVersion = 0

	if (currentVersion === latestVersion)
		return

	console.log(`migrating localStorage version from v${currentVersion} to v${latestVersion}`)

	// perform migration logic
	if (currentVersion < latestVersion) {
		localStorage.clear()
		console.log("cleared localStorage")
	}

	// update version
	await kv.put("version", latestVersion)
}

