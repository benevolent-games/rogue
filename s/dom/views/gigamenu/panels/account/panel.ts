
import {AccountView} from "./view.js"
import {context} from "../../../../context.js"
import {gigapanel} from "../../utils/gigapanel.js"
import userCheckSvg from "../../../../icons/tabler/user-check.svg.js"
import userQuestionSvg from "../../../../icons/tabler/user-question.svg.js"

export const AccountPanel = gigapanel(() => ({
	label: "Account",
	button: () => context.auth.login
		? userCheckSvg
		: userQuestionSvg,
	content: () => AccountView([]),
}))

