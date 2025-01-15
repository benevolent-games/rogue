
export function modprefix(event: KeyboardEvent | PointerEvent) {
	const modifiers: string[] = []
	if (event.ctrlKey) modifiers.push("C")
	if (event.altKey) modifiers.push("A")
	if (event.shiftKey) modifiers.push("S")
	if (event.metaKey) modifiers.push("M")
	return modifiers.length > 0
		? [...modifiers].join("-")
		: "X"
}

