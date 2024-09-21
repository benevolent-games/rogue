
import {Parcel} from "./types.js"

export class Inbox<T> {
	#biggestKnownId?: number
	#parcels: Parcel<T>[] = []

	/** insert a parcel into the inbox */
	insertParcel(parcel: Parcel<T>) {
		const [id] = parcel
		const biggest = this.#biggestKnownId
		const isObsolete = (biggest !== undefined) && (id <= biggest)

		if (isObsolete)
			return undefined

		this.#biggestKnownId = id
		this.#parcels.push(parcel)
	}

	/** extract all unread messages, and delete them so we don't get them again */
	takeMessages() {
		const messages = this.#parcels.map(([,message]) => message)
		this.#parcels = []
		return messages
	}
}

