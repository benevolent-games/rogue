
import {git_latest_tag} from "@benev/turtle"

export async function get_ref_name() {
	return process.env["GITHUB_REF_NAME"] || await git_latest_tag()
}

