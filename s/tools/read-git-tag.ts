
export function readGitTag() {
	return document.head
		.querySelector("[data-git-tag]")!
		.getAttribute("data-git-tag")!
		.trim()
}

