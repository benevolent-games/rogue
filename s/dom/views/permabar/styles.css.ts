
import {css} from "@benev/slate"
export default css`

:host {
	position: relative;
}

nav {
	display: flex;
	flex-wrap: wrap;
	justify-content: end;

	> button {
		cursor: pointer;
		flex: 0 0 auto;
		background: transparent;
		border: 0;
		border-radius: 0.5em;
		color: #ccc;

		&:hover {
			background: #5554;
			filter: brightness(150%);
		}

		&[data-active] {
			background: #111a;
		}

		> svg {
			width: 3em;
			height: 3em;
		}
	}
}

section {
	position: absolute;
	top: 100%;
	right: 0;
	width: 24em;
	max-width: 100%;
	padding: 1em;

	color: white;
	background: #111e;
	backdrop-filter: blur(1rem);
	border-radius: 0.5em;
	box-shadow: .1em .2em .5em #0008;
	border: 2px solid #5558;
}

`

