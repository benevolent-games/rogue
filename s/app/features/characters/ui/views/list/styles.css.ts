
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
}

.plate {
	display: flex;
	flex-direction: column;
	gap: 0.5em;

	> section {
		text-align: center;

		> header {
			padding: 0.2em;
			color: #fff4;

			> h2 {
				font-size: 1.5em;
				font-weight: normal;
				font-style: italic;
			}
		}

		> div {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.5em 1em;
			padding: 1em;

			> * {
				flex: 0 0 auto;
			}
		}
	}
}

`

