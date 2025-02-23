
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
}

.plate {
	display: flex;
	flex-direction: column;
	gap: 1em;

	> section {
		background: #1118;

		> h2 {
			padding: 0.5em;
			background: #1118;
		}

		> div {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.5em;
			padding: 1em;

			> * {
				flex: 0 0 auto;
			}
		}
	}
}

`

