
import "@benev/slate/x/node.js"
import {template, html, easypage, startup_scripts_with_dev_mode, git_commit_hash, read_file, unsanitized} from "@benev/turtle"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()
	const shorthash = hash.slice(0, 6)

	return easypage({
		path,
		dark: true,
		css: "index.css",
		title: "Righteous Fury",
		head: html`
			<link rel="icon" href="/assets/graphics/favicon.png"/>
			<link rel="stylesheet" href="${path.version.root("index.css")}"/>
			<meta data-commit-hash="${hash}"/>

			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

			<link href="https://fonts.googleapis.com/css2?family=Handjet:wght@100..900&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
			<link href="https://fonts.googleapis.com/css2?family=Forum&family=Suez+One&family=Uncial+Antiqua&display=swap" rel="stylesheet">

			<script type="importmap">
				${unsanitized(await read_file("x/importmap.json"))}
			</script>

			<script type="module" src="/index.bundle.js"></script>
		`,
		body: html`
			<game-app></game-app>
		`,
	})
})

			// ${startup_scripts_with_dev_mode({
			// 	path,
			// 	es_module_shims: null,
			// 	scripts: [{
			// 		module: "index.bundle.js",
			// 		bundle: "index.bundle.min.js",
			// 		hash: false,
			// 	}],
			// })}
