
import {Options, Scan} from "./types.js"

export class Prefixer {
	#prefix: string | undefined

	constructor(options: Options) {
		const {prefix, divisor, delimiter} = options
		this.#prefix = prefix.length > 0
			? prefix.join(divisor) + delimiter
			: undefined
	}

	prefix = (key: string) => {
		return this.#prefix
			? this.#prefix + key
			: key
	}

	unprefix = (fullkey: string) => {
		const start = this.#prefix ? this.#prefix.length : 0
		return fullkey.slice(start)
	}

	scan = ({start, end, limit}: Scan) => {
		return {
			limit,
			end: end && this.prefix(end),
			start: start && this.prefix(start),
		}
	}
}

