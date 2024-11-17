
import {html, loading, shadowView} from "@benev/slate"

import stylesCss from "./styles.css.js"
import themeCss from "../../../../theme.css.js"
import {context} from "../../../../context.js"
import {AccountCardView} from "../../../../../features/accounts/views/account-card/view.js"
import { AvatarSelectorView } from "../../../../../features/accounts/views/avatar-selector/view.js"

export const AccountView = shadowView(use => () => {
	use.styles(themeCss, stylesCss)

	return html`
		<section>
			${loading.binary(context.sessionOp, session => session && html`
				${AccountCardView([session.account], {attrs: {class: "account-card"}})}
				${AvatarSelectorView([{
					account: session.account,
					accountRecord: session.accountRecord,
				}])}
			`)}
			<auth-login></auth-login>
		</section>
	`
})

