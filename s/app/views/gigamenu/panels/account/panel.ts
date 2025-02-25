
import {AccountView} from "./view.js"
import {Context} from "../../../../context.js"
import {gigapanel} from "../../utils/gigapanel.js"
import {AvatarView} from "../../../avatar/view.js"
import {Avatar} from "../../../../features/accounts/avatars/avatar.js"

export const AccountPanel = gigapanel(() => ({
	label: "Account",

	button: () => {
		const {context} = Context
		const session = context.accountManager.session.value
		const isSessionLoading = context.accountManager.loadingOp.isLoading()
		const avatar = Avatar.get(session.account.avatarId)
		return AvatarView([avatar, {loading: isSessionLoading}])
	},

	content: () => AccountView([]),
}))

