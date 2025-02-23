
import {css} from "@benev/slate"
export default css`

:host {
	display: flex;
	flex-direction: column;
	gap: 2em;
}

slot {
	display: block;
	padding: 0 2em;
}

.battleship {
	display: flex;
	flex-direction: column;

	gap: 0.5em;

	> nav {
		display: flex;
		min-width: 12em;
		justify-content: center;
		gap: 0.5em;

		> button[x-current] {
			background: #aaa;
		}
	}

	> .deck {
		flex: 1 1 auto;
		padding: 1em;
		background: #111;
		box-shadow: 0.3em .5em .2em #0004;
		border-radius: 0.5em;
		border-top: 1px solid #fff2;
	}
}

`

