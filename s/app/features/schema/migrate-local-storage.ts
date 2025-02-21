
import {LocalSchema} from "./local.js"

const latestVersion = 3

export async function migrateLocalStorage(schema: LocalSchema) {
	await schema.root.versionMigration(schema.version.key, latestVersion, async version => {

		if (version < 3) {
			await schema.root.clear()
			console.log(`cleared localStorage for migration, v${version} to v${latestVersion}`)
		}
	})
}

