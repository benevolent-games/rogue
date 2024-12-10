
import {Entity, InputShell} from "../../parts/types.js"

export function inputsFromAuthor<xEntity extends Entity>(author: number | null, inputs: InputShell<any>[]) {
	const messages: xEntity["input"][] = []

	for (const shell of inputs) {
		if (shell.author !== author)
			continue

		if (shell.messages.length > 0)
			messages.push(...shell.messages)
	}

	return messages
}

