
import {Trashbin} from "@benev/slate"
import {Circular, Degrees, Quat} from "@benev/toolbox"

import {BipedState} from "./types.js"
import {Realm} from "../../realm/realm.js"
import {AttackZoneRep} from "./utils/attack-zone/rep.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {DebugCapsule} from "../../realm/utils/debug-capsules.js"
import {Pimsley, PimsleyCharacteristics} from "../../realm/pimsley/pimsley.js"

export class BipedRep {
	trash = new Trashbin()
	pimsley: Pimsley
	capsule: DebugCapsule | null
	attackZone: AttackZoneRep | null
	characteristics: PimsleyCharacteristics

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

		this.attackZone = options.debug
			? trash.disposable(
				new AttackZoneRep(realm.bipedIndicatorStore)
			)
			: null
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

		if (this.attackZone)
			this.attackZone.update(
				Coordinates.from(state.coordinates),
				new Circular(state.rotation + Degrees.toRadians(180)),
			)
	}

	dispose() {
		this.trash.dispose()
	}
}

