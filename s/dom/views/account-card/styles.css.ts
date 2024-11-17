
import {css} from "@benev/slate"
export default css`

:host { display: contents; }

[x-card] {
	width: 100%;
	display: flex;
	gap: 1em;

	[x-avatar] {
		> img {
			display: block;
			width: 5em;
			border-radius: 0.5em;
			border: 3px solid #888;
		}
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
}

[x-status="premium"] {
	[x-avatar] > img { border-color: #ffcb00; }
}

[x-status="admin"] {
	[x-avatar] > img { border-color: #5000ff; }
}

`

