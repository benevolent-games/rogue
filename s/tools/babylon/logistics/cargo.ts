
import {Prop} from "@benev/toolbox"
import {Crate} from "./crate.js"
import {Manifest} from "./manifest.js"

/** A manifest-bearing 3d prop that we can instance */
export class Cargo extends Crate {
	constructor(public manifest: Manifest, public prop: Prop) {
		super(prop)
	}
}

