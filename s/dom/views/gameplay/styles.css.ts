
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

	.topbar {
		> button {
			pointer-events: all;
		}
	}
}

`

