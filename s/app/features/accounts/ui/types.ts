
import {Login} from "@authlocal/authlocal"
import {Account, AccountPreferences, AccountRecord} from "../types.js"

export type Session = {
	login: Login
	account: Account
	accountDecree: string
	accountRecord: AccountRecord
}

export type RandoDetails = {
	login: Login
	preferences: AccountPreferences
}

/** identity is transmitted in a multiplayer context, for lobby display */
export type Identity = {accountDecree: string}

