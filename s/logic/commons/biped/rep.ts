
import {Trashbin} from "@benev/slate"
import {Circular, Degrees, Prop, Quat, Vec3} from "@benev/toolbox"

import {BipedState} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {DebugCapsule} from "../../realm/utils/debug-capsules.js"
import {applySpatial} from "../../../tools/babylon/logistics/apply-spatial.js"
import {Pimsley, PimsleyCharacteristics} from "../../realm/pimsley/pimsley.js"
import { AttackZoneRep } from "./utils/attack-zone-rep.js"

export class BipedRep {
	pimsley: Pimsley
	capsule: DebugCapsule | null
	characteristics: PimsleyCharacteristics
	attackZone: AttackZoneRep
	trash = new Trashbin()

	constructor(
			public realm: Realm,
			public getState: () => BipedState,
			public options: {
				debug: boolean
				height: number
				radius: number
			},
		) {

		const state = getState()
		const {trash} = this

		this.characteristics = {
			block: state.block,
			attack: !!state.attack,
			rotation: new Circular(state.rotation),
			coordinates: Coordinates.from(state.coordinates),
		}

		this.pimsley = realm.pimsleyPool.borrow(this.trash)
		this.pimsley.init(this.characteristics)

		this.capsule = options.debug
			? trash.disposable(
				realm.debugCapsules.get(options.height, options.radius)
			)
			: null

		this.attackZone = trash.disposable(
			new AttackZoneRep(realm.bipedIndicatorStore)
		)
	}

	replicate(tick: number) {
		const state = this.getState()
		this.characteristics.coordinates.set_(...state.coordinates)
		this.characteristics.rotation.set(state.rotation)
		this.characteristics.attack = !!state.attack
		this.characteristics.block = state.block

		this.pimsley.update({
			tick,
			seconds: this.realm.seconds,
			...this.characteristics,
		})

		if (this.capsule)
			this.capsule
				.setPosition(this.characteristics.coordinates.position())
				.setRotation(Quat.rotate_(0, this.pimsley.displayRotation.x, 0))

		this.attackZone.update(
			this.characteristics.coordinates,
			this.pimsley.displayRotation,
		)
	}

	dispose() {
		this.trash.dispose()
	}
}

