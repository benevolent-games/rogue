
import {dropped_files, ShockDrop} from "@benev/slate"

export function dungeonDropper(dropped: (files: File[]) => void) {
	return new ShockDrop({
		predicate: () => true,
		handle_drop: event => {
			dropped(dropped_files(event))
		},
	})
}

