
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
}

.card {
	display: flex;
	flex-direction: column;
	gap: 0.3em;

	.saucer {
		display: flex;
		flex-wrap: wrap;
		color: #aaa;
		background: #6668;
		border-radius: 0.5em;
		box-shadow: .1em .2em .3em #0006;
		padding: 0.5em;
		gap: 0.67em;

		> * {
			flex: 0 1 auto;
		}

		.details {
			display: flex;
			flex-direction: column;
			padding: 0.5em;
			gap: 0.5em;

			h3 {
				font-size: 1em;
				color: white;
				text-shadow: .1em .1em .1em #0008;
			}

			.infos {
				display: flex;
				gap: 1em;
				flex-wrap: wrap;
			}
		}
	}

	.controlbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1em;

		button {
			font-size: 0.8em;
			font-style: italic;
			padding: .2em;
			background: transparent;
			box-shadow: none;
			color: #888;
			cursor: pointer;

			&.happy {
				background: green;
				color: white;
				border-radius: 0.4em;
				box-shadow: .1em .2em .3em #0006;
			}

			&:is(:focus, :hover) {
				filter: brightness(120%);
				&.angry { color: red; }
			}
		}
	}
}

`

