
import {css} from "@benev/slate"
export default css`

:host {
	--avatar-size: 5em;

	width: 100%;
	display: flex;
	gap: 1em;
}

[view="avatar"] {
	--size: var(--avatar-size);
}

[x-info] {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.1em;

	[x-name] {
		font-size: 1.5em;
		color: white;
		font-family: "Metamorphous", serif;
		font-weight: bold;
	}

	[x-features] {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		color: #8888;
		cursor: default;
	}
}

`

