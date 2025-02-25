
import {html, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {Context} from "../../../../context.js"
import themeCss from "../../../../theme.css.js"
import {AccountCardView} from "../../../account-card/view.js"
import {AvatarSelectorView} from "../../../avatar-selector/view.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	const {accountant} = Context.context
	const session = accountant.session.value
	const isSessionLoading = accountant.loadingOp.isLoading()
	const isRando = session.account.tags.includes("rando")

	const login = () => { accountant.auth.popup() }
	const logout = () => { accountant.auth.login = null }

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
				accountant.identity.value,
				isSessionLoading,
			])}

			${isRando
				? renderRando()
				: renderRealAccount()}
		</section>
	`
})

