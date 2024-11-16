
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
			border: 4px solid #fff8;
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
				border: 1px solid #fff4;
				border-radius: 1em;
				padding: 0.1em 0.3em;
			}
		}
	}
}

[x-status="premium"] {
	[x-avatar] > img { border-color: yellow; }
}

[x-status="admin"] {
	[x-avatar] > img { border-color: rebeccapurple; }
}

`

