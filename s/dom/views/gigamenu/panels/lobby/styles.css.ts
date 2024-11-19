
import {css} from "@benev/slate"
export default css`

* {xxx-outline: 1px solid #f004;}

section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	gap: 1em;
	width: 100%;
	min-height: 8em;
}

header {
	display: flex;
	width: 100%;
	padding: 0 1em;

	> * { flex: 1 1 auto; }
	> *:first-child { text-align: left; }
	> *:last-child { text-align: right; }
}

ol {
	list-style: none;

	display: flex;
	flex-direction: column;
	gap: 0.5em;
	width: 100%;

	li {
		display: flex;
		flex-direction: column;

		background: #8882;
		padding: 0.5em;
		border-radius: 0.5em;

		> [x-card] { flex: 1 1 auto; }
		> [x-net] { flex: 0 0 auto; }
	}
}

[x-net] {
	display: flex;
	align-items: center;
	padding: 0 1em;
	justify-content: end;
	color: #8888;
	gap: 2em;
}

`

