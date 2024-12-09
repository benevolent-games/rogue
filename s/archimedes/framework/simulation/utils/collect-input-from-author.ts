
import {Entity, InputShell} from "../../parts/types.js"

export function collectInputFromAuthor<xEntity extends Entity>(author: number | null, inputs: InputShell<any>[]) {
	let data: xEntity["input"]["data"] | undefined = undefined
	const messages: xEntity["input"]["message"][] = []

	for (const input of inputs) {
		if (input.author !== author)
			continue

		if (input.data !== undefined)
			data = input.data
		if (input.messages.length > 0)
			messages.push(...input.messages)
	}

	return {data, messages}
}

