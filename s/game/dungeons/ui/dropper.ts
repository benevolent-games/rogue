
import {drag_has_files, dropped_files, ShockDrop} from "@benev/slate"

export function dungeonDropper(dropped: (files: File[]) => void) {
	return new ShockDrop({
		predicate: event => drag_has_files(event),
		handle_drop: event => {
			dropped(dropped_files(event))
		},
	})
}

