
import {DatabaseSchema} from "./database.js"

const latestVersion = 3

export async function migrateDatabase(schema: DatabaseSchema) {
	await schema.root.versionMigration(schema.version.key, latestVersion, async version => {

		if (version < 3) {
			await schema.characters.root.clear()
			console.log("cleared characters for database migration")
		}
	})
}

