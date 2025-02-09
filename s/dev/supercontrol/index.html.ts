
import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, renderSocialCard} from "@benev/turtle"

const domain = "rogue.benevolent.games"
const favicon = "/assets/graphics/favicon-ivLoKJGtTXd.png"
const socialImage = "/assets/images/items/ivLoKJGtTXd.webp"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "Supercontrol",
		head: html`
			<!-- © 2025 Chase Moskal. All rights reserved. -->

			<link rel="icon" href="${favicon}"/>
			<link rel="stylesheet" href="${path.version.local("index.css")}"/>
			<meta data-commit-hash="${hash}"/>

			${renderSocialCard({
				themeColor: "#ff2200",
				siteName: domain,
				title: "🎮 Supercontrol",
				description: "Testing grounds for controller inputs",
				image: `https://${domain}${socialImage}`,
				url: `https://${domain}/supercontrol/`,
			})}

			${headScripts({
				devModulePath: await path.version.local("index.js"),
				prodModulePath: await path.version.local("index.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<h1>Supercontrol Testing Grounds</h1>
			<super-control></super-control>
		`,
	})
})

