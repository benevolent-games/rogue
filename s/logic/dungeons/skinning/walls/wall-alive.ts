
import {Meshoid, Prop} from "@benev/toolbox"

import {WallSpec} from "./wall-spec.js"
import {getTopMeshes} from "../../../../tools/babylon/babylon-helpers.js"

export class WallAlive {
	meshes: Meshoid[]

	constructor(
			public spec: WallSpec,
			public prop: Prop,
			public release: () => void,
		) {
		this.meshes = getTopMeshes(prop)
	}
}

