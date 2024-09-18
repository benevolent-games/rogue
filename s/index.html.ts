
import "@benev/slate/x/node.js"
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "Righteous Fury",
		head: html`
			<link rel="icon" href="/assets/graphics/favicon.png"/>
			<link rel="stylesheet" href="${path.version.root("index.css")}"/>
			<meta data-commit-hash="${await git_commit_hash()}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

			<link href="https://fonts.googleapis.com/css2?family=Handjet:wght@100..900&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Forum&family=Suez+One&family=Uncial+Antiqua&display=swap" rel="stylesheet">

			${startup_scripts_with_dev_mode({
				path,
				scripts: [{
					module: "index.bundle.js",
					bundle: "index.bundle.min.js",
					hash: false,
				}],
			})}
		`,
		body: html`
			<game-app></game-app>
		`,
	})
})

