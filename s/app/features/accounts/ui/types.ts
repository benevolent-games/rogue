
import {Login} from "@authlocal/authlocal"
import {Account, AccountRecord} from "../types.js"

export type RandoIdentity = {kind: "rando", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountDecree: string}
export type Identity = RandoIdentity | AccountIdentity

export type Session = {
	login: Login
	account: Account
	accountDecree: string
	accountRecord: AccountRecord
}

