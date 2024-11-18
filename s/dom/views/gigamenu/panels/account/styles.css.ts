
import {css} from "@benev/slate"
export default css`

section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 8em;

	gap: 1em;
}

auth-login {
	font-size: 1.5em;
}

[view="account-card"] {
	font-size: 1em;
	--avatar-size: 8em;
}

[view="avatar-selector"] {
	font-size: 0.7em;
}

button {
	font-size: 1.5em;
}

`

