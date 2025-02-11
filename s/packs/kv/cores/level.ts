
import {Level} from "level"
import {byteify} from "../parts/keys.js"
import {Core, Scan, Write} from "../parts/core.js"

export class LevelCore extends Core {
	#db: Level<Uint8Array, Uint8Array>

	constructor(path: string) {
		super()
		this.#db = new Level(path, {keyEncoding: "view", valueEncoding: "view"})
	}

	async gets(...keys: Uint8Array[]) {
		return this.#db.getMany(keys.map(key => byteify(key)))
	}

	async has(...keys: Uint8Array[]) {
		// TODO when it's released, use level's upcoming .has and .hasMany
		//  - currently we're using a hack, using .get
		//  - see https://github.com/Level/community/issues/142

		if (keys.length === 0)
			return true

		return (keys.length === 1)
			? (await this.gets(...keys))[0] !== undefined
			: (await this.gets(...keys)).every(value => value !== undefined)
	}

	async *keys(scan: Scan = {}) {
		const results = this.#db.keys({
			gte: scan.start,
			lte: scan.end,
			limit: scan.limit,
		})
		for await (const key of results)
			yield key
	}

	async *entries(scan: Scan = {}) {
		const results = this.#db.iterator({
			gte: scan.start,
			lte: scan.end,
			limit: scan.limit,
		})
		for await (const entry of results)
			yield entry
	}

	async transaction(...writes: Write[]) {
		return this.#db.batch(
			writes.map(write => (write.kind === "put"
				? {type: "put", key: byteify(write.key), value: write.value}
				: {type: "del", key: byteify(write.key)}
			))
		)
	}
}

