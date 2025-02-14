
import {AccountView} from "./view.js"
import {context} from "../../../../context.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {AvatarView} from "../../../avatar/view.js"
import {Avatar} from "../../../../features/accounts/avatars/avatar.js"
import userCheckSvg from "../../../../icons/tabler/user-check.svg.js"
import userQuestionSvg from "../../../../icons/tabler/user-question.svg.js"

export const AccountPanel = gigapanel(() => ({
	label: "Account",

	button: () => {
		const {accountManager} = context
		const {session} = context.accountManager

		if (session) {
			const avatar = Avatar.get(session.account.avatarId)
			if (avatar)
				return AvatarView([avatar, {loading: accountManager.isSessionLoading}])
		}

		return accountManager.auth.login
			? userCheckSvg
			: userQuestionSvg
	},

	content: () => AccountView([]),
}))

