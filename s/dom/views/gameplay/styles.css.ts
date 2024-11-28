
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

	[view="gigamenu"] {
		padding-top: 0.5em;
		padding: 1em;
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

`

