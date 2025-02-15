
import {html, loading, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../context.js"
import themeCss from "../../../../theme.css.js"
import {AccountCardView} from "../../../account-card/view.js"
import {AvatarSelectorView} from "../../../avatar-selector/view.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	const {context} = Context
	const {accountManager} = context

	const session = accountManager.session.value
	const isSessionLoading = accountManager.isSessionLoading.value

	const login = () => { accountManager.auth.popup() }
	const logout = () => { accountManager.auth.login = null }

	return html`
		<section>
			${AccountCardView([
				accountManager.multiplayerIdentity.value,
				isSessionLoading,
			])}

			${session ? html`
				${AvatarSelectorView([{
					account: session.account,
					accountRecord: session.accountRecord,
				}])}

				<button @click="${logout}">
					Logout
				</button>

			` : loading.binary(accountManager.sessionOp, () => html`
				<p>You're currently logged out</p>

				<button class=authlocal @click="${login}">
					Login
				</button>
			`)}

			${accountManager.sessionOp.isError() ? html`
				<button @click="${logout}">
					Logout
				</button>
			` : null}
		</section>
	`
})

