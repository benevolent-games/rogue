
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
	height: 3em;
	position: relative;
}

.plate {
	position: absolute;
	width: 100%;
	max-width: 32em;
	border-radius: 0.5em;
	overflow: hidden;

	&[x-menu-open] {
		background: #000a;
		backdrop-filter: blur(0.5em);
		box-shadow: .2em .3em .8em #0004;
	}

	nav, section {
		pointer-events: all;
	}

	nav {
		display: flex;

		> button {
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;

			color: #aaa;
			min-width: 6em;
			gap: 0.2em;
			padding: 1em;
			padding-bottom: 0.4em;
			border-top: 2px solid transparent;

			&[x-active] {
				color: #fff;
				background: #3336;
				border-top: 2px solid orange;
			}

			&:hover {
				color: #fff;
			}

			> svg {
				width: 2em;
				height: 2em;
			}

			> span {
				opacity: 0.5;
				font-size: 0.8em;
			}
		}
	}

	section {
		padding: 1em;
		background: #3336;
		max-height: 32em;
		overflow: auto;
	}
}

`

