
import {Vec2} from "@benev/toolbox"
import {Dungeon} from "../dungeons/dungeon.js"
import {deferPromise, Map2} from "@benev/slate"
import {DungeonStore} from "../dungeons/store.js"
import {ZenGrid} from "../../tools/hash/zen-grid.js"
import {Coordinates} from "../realm/utils/coordinates.js"

export class Station {
	#dungeon: Dungeon | null = null
	#readyPromise = deferPromise<void>()
	#authorCoordinates = new Map2<number, Coordinates>()

	importantEntities = new Set<number>()
	entityHashgrid = new ZenGrid<number>(Vec2.all(16))

	constructor(public dungeonStore: DungeonStore) {}

	get ready() {
		return this.#readyPromise.promise
	}

	set dungeon(dungeon: Dungeon) {
		this.#dungeon = dungeon
		this.#readyPromise.resolve()
	}

	get dungeon() {
		if (!this.#dungeon)
			throw new Error("dungeon is not set")
		return this.#dungeon
	}

	get possibleDungeon() {
		return this.#dungeon
	}

	getAuthorCoordinates(author: number) {
		return this.#authorCoordinates.guarantee(author, () => Coordinates.zero())
	}

	updateAuthorCoordinates(author: number, coordinates: Coordinates) {
		this.getAuthorCoordinates(author).set(coordinates)
	}
}

