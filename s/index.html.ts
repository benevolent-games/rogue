
import "@benev/slate/x/node.js"
import {constants} from "./constants.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, renderSocialCard} from "@benev/turtle"
import { readPackageJson } from "./tools/ssg/read-package-json.js"

const domain = "rogue.benevolent.games"
const favicon = "/assets/graphics/favicon-ivLoKJGtTXd.png"
const socialImage = "/assets/images/items/ivLoKJGtTXd.webp"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()
	const version = (await readPackageJson()).version

	return easypage({
		path,
		dark: true,
		title: "Rogue Crusade",
		head: html`
			<!-- © 2025 Chase Moskal. All rights reserved. -->

			<link rel="icon" href="${favicon}"/>
			<link rel="stylesheet" href="${path.version.root("index.css")}"/>
			<meta data-commit-hash="${hash}"/>
			<meta data-version="${version}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Metamorphous&display=swap" rel="stylesheet">

			${renderSocialCard({
				themeColor: "#ff2200",
				siteName: domain,
				title: "⚔️ Rogue Crusade",
				description: "The Ultimate Roguelike",
				image: `https://${domain}${socialImage}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				devModulePath: await path.version.root("index.bundle.js"),
				prodModulePath: await path.version.root("index.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<game-app>
				<h1><em>Rogue Crusade</em> will be the ultimate roguelike.</h1>
				<p>3d. Permadeath. Solo and co-op. Procgen dungeons. Monsters, loot, potions.</p>
				<p>We built a time machine, opened a portal to an alternate 1999, stole the best roguelike in the multiverse, and now we’re busy porting it to the modern web.</p>
				<p>Join our <a href="https://discord.gg/BnZx2utdev">Discord</a> to chat with us and follow the development, now's the best time to influence the game design with your terrible ideas. Also, see the project on <a href="https://github.com/benevolent-games/rogue-crusade">GitHub.</a></p>
				<p>Let us know if you have any better ideas for how to use the time machine.</p>
				<footer>
					<a class=benev href="https://benevolent.games/">
						<img src="${constants.urls.benevLogo}" alt="" draggable="false"/>
						<span>Benevolent Games</span>
					</a>
				</footer>
			</game-app>
		`,
	})
})

