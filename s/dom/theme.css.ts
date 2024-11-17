
import {css} from "@benev/slate"
export default css`@layer theme, component; @layer theme {

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;

	scrollbar-width: thin;
	scrollbar-color: #333 transparent;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
::-webkit-scrollbar-thumb:hover { background: #444; }

a {
	color: var(--link);
	text-decoration: none;

	&:visited {
		color: color-mix(in srgb, purple, var(--link) 70%);
	}

	&:hover {
		color: color-mix(in srgb, white, var(--link) 90%);
		text-decoration: underline;
	}

	&:active {
		color: color-mix(in srgb, white, var(--link) 50%);
	}
}

button:not(.std, .naked) {
	cursor: pointer;

	border: none;
	border-radius: .3em;
	box-shadow: .1em .2em .3em #0005;

	background: #8888;
	color: #fff;
	text-shadow: .08em .12em .10em #0005;

	font: inherit;
	font-weight: bold;

	display: block;
	max-width: 100%;
	padding: .5em;

	&:not([disabled]) {
		&:hover { filter: brightness(120%); }
		&:active { filter: brightness(80%); }
	}

	&.play {
		background: linear-gradient(to bottom, #44ff44, #008800);
	}

	&.angry {
		background: #e00;
	}

	&.authduo {
		background: #7c42ac;
	}
}

button.naked {
	color: inherit;
	background: none;
	border: none;
	outline: 0;
	font-family: inherit;
}

.spin {
	display: block;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

}`

