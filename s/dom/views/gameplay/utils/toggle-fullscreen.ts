
export function toggleFullscreen(element: HTMLElement) {
	if (!document.fullscreenElement) {
		element.requestFullscreen()
			.catch(err => console.error(`fullscreen failed: ${err.message}`));
	}
	else {
		document.exitFullscreen()
			.catch(err => console.error(`exit fullscreen failed: ${err.message}`));
	}
}

