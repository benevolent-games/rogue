
import {css} from "@benev/slate"
export default css`

:host { display: contents; }

[x-card] {
	width: 100%;
	display: flex;
	gap: 1em;

	xxx-background: #4448;
	xxx-border-radius: 0.5em;

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
		}

		[x-thumbprint] {
			opacity: 0.7;
			font-size: 0.7em;
			font-family: monospace;
		}

		[x-tags] {
			list-style: none;
			display: flex;
			flex-wrap: wrap;
			gap: 0.5em;
			font-size: 0.8em;

			> li {
				border: 2px solid #fff4;
				border-radius: 1em;
				padding: 0.1em 0.3em;
			}
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

