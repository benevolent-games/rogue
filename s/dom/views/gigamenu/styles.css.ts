
import {css} from "@benev/slate"
export default css`

:host {
	display: block;
	height: 3em;
	position: relative;
	--button-size: 3em;
	--bgcolor1: #222a;
	--bgcolor2: #4442;
}

.plate {
	position: absolute;
	width: 100%;
	max-width: 48em;
	border-radius: 0 0 0.5em 0.5em;
	overflow: hidden;

	background: var(--bgcolor1);
	backdrop-filter: blur(0.5em);
	box-shadow: .2em .3em .8em #0004;

	nav {
		display: flex;

		> button {
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;

			min-width: calc(var(--button-size) * 2);
			padding: calc(var(--button-size) / 6);

			color: #aaa;
			gap: 0.1em;
			border-top: 2px solid transparent;

			&[x-active] {
				background: var(--bgcolor2);
				border-top: 2px solid orange;
			}

			> svg {
				display: block;
				width: var(--button-size);
				height: var(--button-size);
			}

			> [view="avatar"] {
				display: block;
				--size: var(--button-size);
			}

			> span {
				opacity: 0.25;
				font-size: calc(var(--button-size) / 4);
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
		background: var(--bgcolor2);
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

