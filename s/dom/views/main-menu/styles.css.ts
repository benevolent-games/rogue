
import {css} from "@benev/slate"
export default css`

:host {
	position: absolute;
	inset: 0;

	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
}

.plate {
	display: flex;
	flex-direction: column;

	width: 42em;
	max-width: 100%;
	margin-top: 10vh;

	aspect-ratio: 1 / 1;
	background-size: cover;
	background-position: center center;

	box-shadow: .2em .3em 1em #0008;
	border-radius: 0.6em;

	> h1 {
		height: 25%;
		outline: 2px solid cyan;
		visibility: hidden;
	}

	> nav {
		flex: 0 0 auto;
		display: flex;
		justify-content: center;
		align-items: stretch;
		gap: 1em;
		padding: 1em;

		background: #0008;
		backdrop-filter: blur(1rem);

		> :is(button, a) {
			font-size: 2em;
			cursor: pointer;
			text-decoration: none;

			font-weight: bold;
			font-family: "Uncial Antiqua", serif;
			text-shadow: 0.03em 0.06em 0.08em #0006;
			font-variant: small-caps;

			padding: 0.1em 0.5em;
			border-radius: 0.4em;

			background: linear-gradient(
				to bottom,
				#44ff44,
				#008800
			);
		}
	}
}

`

