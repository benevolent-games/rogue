
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
	background: #3c596c;
	border-radius: 0.5em;
	box-shadow: 0.3em .5em .2em #0002;
	padding: 1em;
	gap: 0.5em;

	> * {
		background: #0002;
		padding: 0.5em;
		border-radius: 0.5em;
	}

	> nav {
		display: flex;
		flex-direction: column;
		gap: 0.5em;

		> button {
			background: linear-gradient(to bottom, #44b7ff, #005888);
			&[x-current] {
				background: linear-gradient(to bottom, #44ff44, #008800);
			}
		}
	}

	> .deck {
		flex: 1 1 auto;
	}
}

`

