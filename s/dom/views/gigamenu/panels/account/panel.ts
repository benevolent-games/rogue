
import {AccountView} from "./view.js"
import {context} from "../../../../context.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {Avatar} from "../../../../../features/accounts/avatars.js"
import userCheckSvg from "../../../../icons/tabler/user-check.svg.js"
import userQuestionSvg from "../../../../icons/tabler/user-question.svg.js"
import {AvatarView} from "../../../../../features/accounts/views/avatar/view.js"

export const AccountPanel = gigapanel(() => ({
	label: "Account",
	// button: () => context.auth.login
	// 	? userCheckSvg
	// 	: userQuestionSvg,

	button: () => {
		const session = context.sessionOp.payload

		if (session) {
			const avatar = Avatar.library.get(session.account.avatarId)
			if (avatar) {
				return AvatarView([avatar])
			}
		}

		return context.auth.login
			? userCheckSvg
			: userQuestionSvg
	},

	content: () => AccountView([]),
}))

