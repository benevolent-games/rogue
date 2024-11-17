
import {css} from "@benev/slate"
export default css`

:host {
	display: contents;
	--size: 5em;
	--radius: .1em;
}

div[part="box"] {
	font-size: var(--size);

	z-index: 0;
	position: relative;
	overflow: hidden;
	box-shadow: .1em .2em .3em #0008;
	border: .03em solid #888;
	border-radius: var(--radius);

	> img {
		display: block;
		width: 1em;
	}

	> [x-lock-icon] {
		z-index: 1;
		position: absolute;
		inset: 0;
		margin: auto;
		width: max-content;
		height: max-content;
		color: white;
		opacity: 0.5;
		> svg {
			display: block;
			width: 0.5em;
			height: 0.5em;
		}
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
			background: #8884;
			backdrop-filter: blur(0.1em);
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

