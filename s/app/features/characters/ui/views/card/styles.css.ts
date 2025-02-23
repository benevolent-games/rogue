
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
}

.card {
	display: flex;
	flex-direction: column;
	cursor: default;

	.saucer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 0.5em;
		gap: 0.67em;

		color: #fff8;
		text-shadow: .1em .1em 0 #0004;
		background: #444;
		border-radius: 0.5em;
		box-shadow: .1em .2em .3em #0006;

		> * {
			flex: 0 1 auto;
		}

		.details {
			display: flex;
			flex-direction: column;
			padding: 0.5em;
			gap: 0.5em;

			h3 {
				font-size: 1.1em;
				color: white;
			}

			.infos {
				font-size: 0.8em;
				display: flex;
				padding: 0 1em;
				gap: 1em;
				flex-wrap: wrap;
			}
		}
	}

	.controlbar {
		display: flex;
		flex-wrap: wrap;
		justify-content: end;
		padding: 0 5%;
		gap: 1em;

		button {
			font-size: 0.8em;
			font-style: italic;
			background: transparent;
			box-shadow: none;
			color: #aaa6;
			cursor: pointer;
			text-transform: lowercase;

			&.xxx-happy {
				background: green;
				color: white;
				border-radius: 0.4em;
				box-shadow: .1em .2em .3em #0006;
			}

			&:hover {
				filter: brightness(120%);
				&.angry { color: red; }
			}
		}
	}
}

.card {
	user-select: none;
}

.saucer[data-clickable] {
	cursor: pointer;
	&:hover { filter: brightness(120%); }
	&:active { filter: brightness(80%); }
}

.card[data-situation="creatable"] .saucer {
	background: #007a00;
	background: linear-gradient(rgb(36, 199, 36), rgb(0, 117, 0));
}

.card[data-situation="foreign"] .saucer {
	background: #4b1818;
}

`

