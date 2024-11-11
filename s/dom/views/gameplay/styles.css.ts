
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
	width: 100%;
	height: 100%;
}

canvas {
	display: block;
	width: 100%;
	height: 100%;
}

.overlay {
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

`

