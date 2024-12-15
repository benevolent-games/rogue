import {Map2} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Cargo} from "./cargo.js"
import {Manifest} from "./manifest.js"
import {ManifestQuery} from "./types.js"

/** Collection of cargo (3d props) */
export class Warehouse extends Set<Cargo> {
	static from(container: AssetContainer) {
		return new this(
			[...container.meshes, ...container.transformNodes]
				.filter(prop => !prop.name.includes("_primitive"))
				.map(prop => {
					console.log(prop.name)
					debugger
					const manifest = Manifest.scan(prop)
					return new Cargo(manifest, prop)
				})
		)
	}

	list() {
		return [...this]
	}

	/** get all cargo that matches the manifest query */
	query(search: ManifestQuery, required: boolean = false) {
		const result = new Warehouse(
			[...this].filter(cargo =>
				Object.entries(search).every(([key, value]) => (
					(value === true && cargo.manifest.has(key)) ||
					(value === false && !cargo.manifest.has(key)) ||
					(cargo.manifest.get(key) === value)
				))
			)
		)
		if (required && result.size === 0)
			throw new Error(`search query failed ${JSON.stringify(search)}`)
		return result
	}

	/** organize objects by their value for the given manifest key */
	categorize(key: string) {
		const map = new Map2<string, Warehouse>()
		for (const cargo of this) {
			if (cargo.manifest.has(key)) {
				const value = cargo.manifest.get(key)!
				const warehouse = map.guarantee(value, () => new Warehouse())
				warehouse.add(cargo)
			}
		}
		return map
	}
}

