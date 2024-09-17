
export async function loadImage(src: string, alt = "") {
	return await new Promise<HTMLImageElement>((resolve, reject) => {
		const img = document.createElement("img")
		img.src = src
		img.alt = alt
		img.loading = "eager"
		img.onload = () => resolve(img)
		img.onerror = reject
	})
}

