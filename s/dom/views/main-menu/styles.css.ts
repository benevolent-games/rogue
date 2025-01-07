
import {css} from "@benev/slate"
export default css`

:host {
	position: absolute;
	inset: 0;

	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;

	gap: 1em;
	padding: 1em;

	width: 100%;
	height: 100%;
	overflow-y: auto;
}

.overlay {
	z-index: 1;
	position: absolute;
	inset: 0;
	pointer-events: none;
	aspect-ratio: 16 / 9;
	max-width: 100%;
	height: 100%;
	margin: auto;

	[view="gigamenu"] {
		--button-size: 2em;
	}
}

.lead {
	margin-top: 3em;

	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.3em;

	& a {
		display: flex;
		align-items: center;
		gap: 0.1em;
		&:is(:hover, :focus) {
			filter: drop-shadow(0 0 0.5em #fff8);
		}
	}

	& img { width: 2em; }
	> span { opacity: 0.5; }
}

.plate {
	position: relative;
	display: flex;
	flex-direction: column;
	margin-top: 0.1em;

	box-shadow: .2em .3em 1em #0008;
	border-radius: 0.6em;

	transform: scale(90%);
	opacity: 0;
	transition: 3s ease all;
	&[x-ready] { opacity: 1; transform: scale(100%); }

	> img {
		display: block;
		max-height: calc(90vh - 4em);
		max-width: min(50em, 90vw);
	}

	> .content {
		position: absolute;
		inset: 0;

		> h1 {
			display: none;
		}

		> nav {
			position: absolute;
			bottom: 5%;
			left: 0;
			right: 0;

			flex: 0 0 auto;
			display: flex;
			justify-content: center;
			align-items: stretch;
			gap: 1em;
			padding: .5em;

			background: #0008;
			backdrop-filter: blur(0.3rem);

			> :is(button, a) {
				font-size: 1.8em;
				cursor: pointer;
				text-decoration: none;
				border-radius: 0.4em;

				xxx-font-family: "Jacquard 12", serif;
				xxx-font-family: "Jacquarda Bastarda", serif;
				font-family: "Metamorphous", serif;

				background: linear-gradient(to bottom, #44ff44, #008800);
			}
		}
	}
}

.info {
	max-width: 32em;
	margin-top: 2em;
	padding: 2em 0;
	padding-bottom: 4em;

	border-top: 1px solid #fff2;

	> * + * {
		margin-top: 1em;
	}
}

`

