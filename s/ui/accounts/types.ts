
import {Login} from "@authlocal/authlocal"
import {Account, AccountRecord} from "../../server/accounts/types.js"

export type Session = {
	login: Login
	account: Account
	accountToken: string
	accountRecord: AccountRecord
}

