
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
			background: #8888;
		}

		> svg {
			width: 3em;
			height: 3em;
		}
	}
}

section {
	position: absolute;
	top: 95%;
	right: 0;

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 24em;
	max-width: 100%;
	padding: 1em;
	padding-top: 2em;

	color: white;
	background: #1118;
	backdrop-filter: blur(1rem);
	border-radius: 0.5em;
	border: 1px solid #fff8;
	box-shadow: .1em .2em .5em #000;

	> header {
		position: absolute;
		width: max-content;
		top: 0.5em;
		left: 0.5em;

		display: flex;
		justify-content: start;

		> button {
			opacity: 0.8;
			padding: 0;
			border: none;
			background: transparent;
			cursor: pointer;

			&:hover { opacity: 1; }

			> svg {
				width: 1.5em;
				height: 1.5em;
			}
		}

	}

	> auth-login {
		--card-bg: transparent;
		--card-font-size: 1.5em;
	}
}

`

