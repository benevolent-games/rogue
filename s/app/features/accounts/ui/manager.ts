
import {Login} from "@authlocal/authlocal"
import {RandoIdentity} from "./types.js"
import {JsonStore} from "../../../../tools/store.js"

export class AccountManager {
	#randoStore = new JsonStore<RandoIdentity>("rogue_rando")
	constructor() {}

	setLogin(login: Login | null) {}
}

