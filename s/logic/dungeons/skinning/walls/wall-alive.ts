
import {Prop} from "@benev/toolbox"
import {WallSpec} from "./wall-spec.js"

export class WallAlive {
	constructor(
		public spec: WallSpec,
		public prop: Prop,
		public release: () => void,
	) {}
}

