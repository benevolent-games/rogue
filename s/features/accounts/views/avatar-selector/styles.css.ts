
import {css} from "@benev/slate"
export default css`

ol {
	list-style: none;
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	gap: 0.5em;

	> li {
		position: relative;
		border-radius: 0.5em;
		overflow: hidden;
		box-shadow: .1em .2em .3em #0008;

		border: 3px solid #888;

		> img {
			display: block;
			width: 5em;
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

		&:not([x-locked]):not([x-selected]) {
			cursor: pointer;
			&:hover {
				filter: brightness(130%);
				transform: scale(105%);
			}
		}

		&:not([x-locked]):not([x-selected]):hover {
			filter: brightness(150%);
			transform: scale(105%);
		}
	}
}

`

