
import {Circular, Quat} from "@benev/toolbox"
import {Trashbin} from "@benev/slate"

import {BipedState} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {DebugCapsule} from "../../realm/utils/debug-capsules.js"
import {Pimsley, PimsleyCharacteristics} from "../../realm/pimsley/pimsley.js"

export class BipedRep {
	pimsley: Pimsley
	capsule: DebugCapsule | null
	characteristics: PimsleyCharacteristics
	trash = new Trashbin()

	constructor(
			public realm: Realm,
			public state: BipedState,
			public options: {
				debug: boolean
				height: number
				radius: number
			},
		) {

		this.characteristics = {
			block: state.block,
			attack: !!state.attack,
			rotation: new Circular(state.rotation),
			coordinates: Coordinates.from(state.coordinates),
		}

		this.pimsley = realm.pimsleyPool.acquireCleanly(this.trash)
		this.pimsley.init(this.characteristics)

		this.capsule = options.debug
			? this.trash.disposable(
				realm.debugCapsules.get(options.height, options.radius)
			)
			: null
	}

	replicate(tick: number) {
		this.pimsley.update({
			tick,
			seconds: this.realm.seconds,
			...this.characteristics,
		})

		if (this.capsule)
			this.capsule
				.setPosition(this.characteristics.coordinates.position())
				.setRotation(Quat.rotate_(0, this.pimsley.displayRotation.x, 0))
	}

	dispose() {
		this.trash.dispose()
	}
}

