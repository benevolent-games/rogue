
export function readGitRef() {
	return document.head
		.querySelector("[data-git-ref]")!
		.getAttribute("data-git-ref")!
		.trim()
}

