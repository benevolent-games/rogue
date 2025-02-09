
import {css} from "@benev/slate"
export default css`

:host {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	user-select: none;

	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;

	color: #fff8;
	background: #101417;
}

[x-plate] {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: max-content;
	gap: 1em;
}

h1 {
	color: #f00;
	user-select: auto;
}

button {
	margin-top: 2em;
	font-size: 1.5em;
	padding: 0.5em;
}

`

