
import {Parcel} from "./types.js"
import {IdCounter} from "../../../tools/id-counter.js"

export class Outbox<T> {
	#id = new IdCounter()
	#parcels: Parcel<T>[] = []

	insertMessage(message: T) {
		const id = this.#id.next()
		this.#parcels.push([id, message])
	}

	takeParcels() {
		const parcels = this.#parcels
		this.#parcels = []
		return parcels
	}
}

