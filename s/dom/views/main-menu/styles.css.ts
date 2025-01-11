
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

	width: 100%;
	height: 100%;
	overflow-y: auto;
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
		--button-size: 2em;
	}
}

.plate {
	position: relative;
	display: block;
	width: 100%;
	max-width: 60em;
	background: #222;
	box-shadow: 0.5em 0.5em 1em #0008;
	border-radius: 0 0 1em 1em;
	margin-bottom: 8em;

	> figure {
		width: 100%;

		> img {
			display: block;
			width: 100%;
			user-select: none;
		}
	}

	> nav {
		display: flex;
		flex-wrap: wrap;
		padding: 1em 3em;

		border-top: 0.2em solid #111;
		border-bottom: 0.2em solid #333;
		background: #181818;
		box-shadow: inset 0.2em 0.2em 3em #0008;

		> button {
			font-size: 1.8em;
			padding: 0.5em 2em;
			cursor: pointer;
			border-radius: 0.4em;
			font-family: "Metamorphous", serif;
			background: linear-gradient(to bottom, #44ff44, #008800);
		}

		> a {
			img { width: 2em; }
		}
	}

	> slot {
		display: block;
		width: 100%;
		padding: 2em;
		user-select: text;
	}
}

`

