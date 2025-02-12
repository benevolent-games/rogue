
import {Login} from "@authlocal/authlocal"
import {Api} from "../../../api.js"
import {Kv} from "../../../../packs/kv/kv.js"
import {Account, AccountRecord} from "../types.js"
import {DecreeVerifier} from "../../security/decree/verifier.js"

export type AccountManagerOptions = {
	kv: Kv
	api: Api
	verifier: DecreeVerifier
}

export type RandoIdentity = {kind: "rando", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountToken: string}
export type Identity = RandoIdentity | AccountIdentity

export type Session = {
	login: Login
	account: Account
	accountDecree: string
	accountRecord: AccountRecord
}

