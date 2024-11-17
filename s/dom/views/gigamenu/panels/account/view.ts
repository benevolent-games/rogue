
import {html, loading, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import {context} from "../../../../context.js"
import themeCss from "../../../../theme.css.js"
import {AccountCardView} from "../../../account-card/view.js"
import {AvatarSelectorView} from "../../../avatar-selector/view.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	const session = context.session.value
	const login = () => { context.auth.popup() }
	const logout = () => { context.auth.login = null }

	return html`
		<section>
			${session ? html`
				${AccountCardView(
					[session.account, context.isSessionLoading],
					{attrs: {class: "account-card"}},
				)}
				${AvatarSelectorView([{
					account: session.account,
					accountRecord: session.accountRecord,
				}])}
				<button @click="${logout}">
					Logout
				</button>
			` : loading.binary(context.sessionOp, () => html`
				<button class=authduo @click="${login}">
					Login
				</button>
			`)}
			${context.sessionOp.isError() ? html`
				<button @click="${logout}">
					Logout
				</button>
			` : null}
		</section>
	`
})

