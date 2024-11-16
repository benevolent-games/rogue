
import {html, loading, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {context} from "../../../../context.js"
import {AccountCardView} from "../../../../../features/accounts/views/account-card/view.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	return html`
		<section>
			${loading.binary(context.sessionOp, session =>
				session && AccountCardView([session.account])
			)}
			<auth-login></auth-login>
		</section>
	`
})

