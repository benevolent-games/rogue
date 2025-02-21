
import {DatabaseSchema} from "./database.js"

const latestVersion = 5

export async function migrateDatabase(schema: DatabaseSchema) {
	await schema.root.versionMigration(schema.version.key, latestVersion, async version => {

		if (version < latestVersion) {
			await schema.root.clear()
			console.log(`cleared database for migration, v${version} to v${latestVersion}`)
		}
	})
}

