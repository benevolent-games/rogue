
import {css} from "@benev/slate"
export default css`

:host {
	display: contents;
	--size: 5em;
	--radius: .1em;
}

div {
	font-size: var(--size);

	position: relative;
	overflow: hidden;
	box-shadow: .1em .2em .3em #0008;
	border: .03em solid #888;
	border-radius: var(--radius);

	> img {
		display: block;
		width: 1em;
	}

	&[x-kind="premium"] {
		border-color: #ffcb00;
	}

	&[x-kind="rare"] {
		border-color: #5000ff;
	}

	&[x-selected] {
		border-color: lime;
		&::after {
			position: absolute;
			display: block;
			content: "";
			inset: 0;
			background: #0804;
		}
	}

	&[x-locked] {
		&::after {
			position: absolute;
			display: block;
			content: "";
			inset: 0;
			background: #8888;
			backdrop-filter: blur(0.3em);
		}
	}

	&[x-clickable]:not([x-locked]):not([x-selected]) {
		cursor: pointer;
		&:hover {
			filter: brightness(130%);
			transform: scale(105%);
		}
	}

	&[x-clickable]:not([x-locked]):not([x-selected]):hover {
		filter: brightness(150%);
		transform: scale(105%);
	}
}

`

