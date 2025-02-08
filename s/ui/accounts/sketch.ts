
import {Login} from "@authlocal/authlocal"
import {JsonStore} from "../../tools/store.js"
import {RandoIdentity} from "../../archimedes/net/multiplayer/types.js"

export class AccountManager {

	#randoStore = new JsonStore<RandoIdentity>("rogue_rando")
	constructor() {}

	setLogin(login: Login | null) {}
}

