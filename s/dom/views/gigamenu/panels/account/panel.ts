
import {auth} from "@authduo/authduo"

import {AccountView} from "./view.js"
import {gigapanel} from "../../utils/gigapanel.js"
import userCheckSvg from "../../../../icons/tabler/user-check.svg.js"
import userQuestionSvg from "../../../../icons/tabler/user-question.svg.js"

export const AccountPanel = gigapanel(() => ({
	label: "Account",
	button: () => auth.login
		? userCheckSvg
		: userQuestionSvg,
	content: () => AccountView([]),
}))

