
import {css} from "@benev/slate"
export default css`

:host {
	position: absolute;
	inset: 0;

	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;

	gap: 1em;
	padding: 1em;
}

.overlay {
	z-index: 1;
	position: absolute;
	inset: 0;
	pointer-events: none;
	aspect-ratio: 16 / 9;
	max-width: 100%;
	height: 100%;
	margin: auto;

	[view="gigamenu"] {
		padding-top: 0.5em;
		padding: 1em;
	}
}

.plate {
	position: relative;
	display: flex;
	flex-direction: column;
	margin-top: 4em;

	box-shadow: .2em .3em 1em #0008;
	border-radius: 0.6em;

	> img {
		display: block;
		max-height: calc(90vh - 4em);
		max-width: 50em;
	}

	> .content {
		position: absolute;
		inset: 0;

		> h1 {
			display: none;
		}

		> nav {
			position: absolute;
			bottom: 10%;
			left: 0;
			right: 0;

			flex: 0 0 auto;
			display: flex;
			justify-content: center;
			align-items: stretch;
			gap: 1em;
			padding: 1em;

			background: #0008;
			backdrop-filter: blur(0.3rem);

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
}

`

