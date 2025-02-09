
import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, read_file} from "@benev/turtle"

const favicon = "/assets/graphics/favicon-ivLoKJGtTXd.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)

	return easypage({
		path,
		dark: true,
		title: "Rogue Crusade Dev Test",
		head: html`
			<!-- © 2025 Chase Moskal. All rights reserved. -->

			<link rel="icon" href="${favicon}"/>
			<link rel="stylesheet" href="${path.version.local("index.css")}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Metamorphous&display=swap" rel="stylesheet">

			${headScripts({
				devModulePath: await path.version.local("index.js"),
				prodModulePath: await path.version.local("index.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<game-dev>
				<h1>
					<strong>Rogue Crusade</strong>
					<em>Development Testing Page</em>
				</h1>
				<p>This is a top-secret development testing page, for user-interface experiments.</p>
				<p>Go back to playing the game 👉 <a href="/">rogue.benevolent.games</a> 👈</p>
			</game-dev>
		`,
	})
})

