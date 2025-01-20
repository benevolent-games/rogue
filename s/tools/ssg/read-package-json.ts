
import {read_file} from "@benev/turtle"

export async function readPackageJson() {
	return JSON.parse(
		await read_file("package.json")
	)
}

