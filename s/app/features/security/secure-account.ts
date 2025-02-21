
import {secure, Service} from "renraku"
import {Account} from "../accounts/types.js"
import {DecreeSigner} from "./decree/signer.js"
import {AccountDecrees} from "../accounts/utils/account-decrees.js"

/** secure a group of api functions, verifying the user has been authenticated with our app */
export function secureAccount<S extends Service>(signer: DecreeSigner, fn: (account: Account) => S) {
	return secure(async({accountDecree}: {accountDecree: string}) => {
		const account = await AccountDecrees.verify(signer, accountDecree)
		return fn(account)
	})
}

