
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
	max-width: 48em;
	border-radius: 0.5em;
	overflow: hidden;

	background: #000a;
	backdrop-filter: blur(0.5em);
	box-shadow: .2em .3em .8em #0004;

	nav {
		display: flex;

		> button {
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;

			color: #aaa;
			min-width: 6em;
			gap: 0.1em;
			padding: 0.5em;
			border-top: 2px solid transparent;

			&[x-active] {
				background: #3336;
				border-top: 2px solid orange;
			}

			> svg {
				width: 3em;
				height: 3em;
			}

			> [view="avatar"] {
				--size: 3em;
			}

			> span {
				opacity: 0.25;
				font-size: 0.8em;
				text-transform: uppercase;
			}

			&:is(:hover, [x-active]) {
				color: #fff;
				[view="avatar"]::part(img) {
					filter: brightness(130%);
				}
			}
		}
	}

	section {
		padding: 2em;
		background: #3336;
		max-height: 32em;
		max-height: calc(80vh - 4em);
		overflow: auto;
	}

	/* DYNAMICS */

	transition: 150ms linear all;
	section { opacity: 1; transition: 150ms linear opacity; }
	nav > [x-tab] { opacity: 1; transition: 150ms linear opacity; }

	nav > [x-menu-button] {
		pointer-events: all;
	}

	&[x-menu-open] {
		pointer-events: all;
	}

	&:not([x-menu-open]) {
		background: transparent;
		box-shadow: none;
		backdrop-filter: none;

		nav > [x-tab] { opacity: 0; }
		section { opacity: 0;  }
}

`

