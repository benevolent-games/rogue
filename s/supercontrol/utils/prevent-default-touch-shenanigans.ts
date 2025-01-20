
import {ev} from "@benev/slate"

export function preventDefaultTouchShenanigans() {
	const preventer = (e: TouchEvent) => e.preventDefault()
	return ev(window, {
		// touchstart: preventer,
		touchmove: preventer,
		// touchcancel: preventer,
		// touchend: preventer,
	}, {passive: false})
}

