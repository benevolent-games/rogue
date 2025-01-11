
import {css} from "@benev/slate"
import {constants} from "../../../constants.js"
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

	font-family: Spectral, serif;
	text-align: center;

	color: #fff8;
	background: #101417;
}

.plate {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: max-content;

	transform: scale(0.5);
	transition: transform ${constants.ui.animTime}ms ease;

	&[data-show] {
		transform: scale(1);
	}

	> .benev {
		display: block;
		width: 24em;
		max-width: 100%;
		max-height: 50vh;
	}

	> h2 {
		font-size: 2em;
		font-style: italic;
	}

	> div {
		margin-top: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2em;

		> * {
			flex: 0 1 auto;
		}

		> .spin {
			width: 1em;
			height: 1em;
			> svg {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
}

`

