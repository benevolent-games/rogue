
import {html, shadowView} from "@benev/slate"

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
	const isSessionLoading = accountManager.loadingOp.isLoading()
	const isRando = session.account.tags.includes("rando")

	const login = () => { accountManager.auth.popup() }
	const logout = () => { accountManager.auth.login = null }

	function renderRealAccount() {
		return html`
			${AvatarSelectorView([{
				account: session.account,
				accountRecord: session.accountRecord,
			}])}

			<button @click="${logout}">
				Logout
			</button>
		`
	}

	function renderRando() {
		return html`
			<p>You're currently logged out</p>

			<button class=authlocal @click="${login}">
				Login
			</button>
		`
	}

	return html`
		<section>
			${AccountCardView([
				accountManager.identity.value,
				isSessionLoading,
			])}

			${isRando
				? renderRando()
				: renderRealAccount()}
		</section>
	`
})

