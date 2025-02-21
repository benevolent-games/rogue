
import {DatabaseSchema} from "./database.js"

const latestVersion = 4

export async function migrateDatabase(schema: DatabaseSchema) {
	await schema.root.versionMigration(schema.version.key, latestVersion, async version => {

		if (version < 4) {
			await schema.root.clear()
			console.log("cleared database for migration")
		}
	})
}

