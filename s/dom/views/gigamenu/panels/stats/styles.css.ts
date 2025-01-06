
import {css} from "@benev/slate"
export default css`

section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 8em;
}

ul {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;

	> li {
		display: flex;
		gap: 0.33em;

		> * {
			display: block;
		}

		> span {
			font-family: monospace;
			width: 6em;
		}
	}
}

`

