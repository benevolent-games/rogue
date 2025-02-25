
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
	width: 100%;
	height: 100%;
}

.container {
	width: 100%;
	height: 100%;
	position: relative;
}

canvas {
	pointer-events: all;
	image-rendering: pixelated;

	display: block;
	width: 100%;
	height: 100%;
	outline: 0;
	&:focus { outline: 0; }
}

.overlay {
	position: absolute;
	inset: 0;
	pointer-events: none;
	aspect-ratio: 16 / 9;
	max-width: 100%;
	height: 100%;
	margin: auto;

	--btnsize: 2em;

	[view="gigamenu"] {
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		--button-size: var(--btnsize);
	}

	.buttonbar {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;

		display: flex;
		padding-left: 5em;
		justify-content: end;
		gap: 1em;

		> button {
			pointer-events: all;

			opacity: 0.2;
			cursor: pointer;
			padding: calc(var(--btnsize) / 6);
			border-top: 2px solid transparent;

			&:hover { opacity: 0.8; }
			&:active { opacity: 1; }

			> svg {
				display: block;
				width: var(--btnsize);
				height: var(--btnsize);
			}
		}
	}

	.toucharea {
		pointer-events: none;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.3;

		> [view="virtual-gamepad"] {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}
	}
}

.drop-indicator {
	pointer-events: none;
	position: absolute;
	inset: 0;

	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;

	font-size: 1.5em;
	color: white;
	font-weight: bold;
	font-style: italic;

	background: #0af4;
	border: 0.5em dashed;
}

.plate {
	pointer-events: all;
	position: absolute;
	inset: 10%;

	display: flex;
	align-items: center;
	justify-content: center;

	.saucer {
		width: max-content;
		padding: 1em;
		background: #111e;
		border-radius: 1em;
		max-height: 100%;
		overflow-y: auto;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1em;

		.info {
			display: flex;
			flex-direction: column;
			max-width: 20em;
			gap: 0.5em;
			text-align: center;
		}
	}
}

`

