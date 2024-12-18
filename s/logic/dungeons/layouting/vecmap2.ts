
import {Vec2} from "@benev/toolbox"
import {HashMap} from "../../../tools/hash/map.js"

const hash = (vector: Vec2) => `${vector.x},${vector.y}`

export class Vecmap2<Value, Key extends Vec2 = Vec2> extends HashMap<Key, Value> {
	constructor(entries: [Key, Value][] = []) {
		super(hash, entries)
	}
}

