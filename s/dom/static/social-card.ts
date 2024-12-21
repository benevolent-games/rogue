
import {html} from "@benev/turtle"

export type SocialCard = {
	themeColor: string

	siteName: string
	title: string
	description: string
	image: string
	url: string
	type: string
}

export function asSocialCard(card: SocialCard) {
	return card
}

export function renderSocialCard(card: SocialCard) {
	return html`
		<meta name="theme-color" content="${card.themeColor}">

		<meta property="og:site_name" content="${card.siteName}">
		<meta property="og:title" content="${card.title}">
		<meta property="og:description" content="${card.description}">
		<meta property="og:image" content="${card.image}">
		<meta property="og:url" content="${card.url}">
		<meta property="og:type" content="${card.type}">
	`
}

