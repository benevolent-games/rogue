
import {css} from "@benev/slate"
export default css`

:host {
	pointer-events: all;
	position: relative;
	display: flex;
	flex-direction: column;
	container: my-layout / size;
}

* {
	user-drag: none;
	user-select: none;
}

button, [view="nub-stick"] {
	pointer-events: all;
}

button {
	font-size: 0.5em;
	color: #fff;
	text-shadow: .1em .2em .1em #000;
	text-transform: uppercase;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	background: #888;
	box-shadow: .2em .4em .1em #000;

	-webkit-tap-highlight-color: transparent;
	&:is(:focus, :hover) {
		outline: none;
		background: #888;
		filter: none;
	}
}

.upper {
	flex: 1 1 auto;
	display: flex;
	justify-content: center;
	align-items: start;
	gap: 0.5em;
}

.lower {
	display: flex;
	justify-content: space-between;
}

.side {
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.pad {
	display: flex;
	gap: 0.5em;

	> div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5em;
	}
}

.shoulder {
	display: flex;
	gap: 0.5em;
}

.right {
	align-items: end;
}

.right .shoulder {
	flex-direction: row-reverse;
}

[x-code^="g.trigger"] {
	width: 6em;
}

[x-code^="g.bumper"] {
	width: 4em;
}

.stick {
	width: 4em;
}

@container (min-width: 0px) {
	.upper, .lower {
		padding: 2cqh 2cqw;
	}

	button {
		font-size: min(3cqh, 3cqw);
		width: 7cqw;
		height: 6cqh;
	}

	.upper button {
		width: unset;
		height: unset;
	}

	.shoulder button {
		height: 9cqh;
	}

	.stick {
		width: max(15cqw, 15cqh);
	}

	[x-code^="g.trigger"] {
		width: 9cqw;
	}

	[x-code^="g.bumper"] {
		width: 7cqw;
	}
}

`
