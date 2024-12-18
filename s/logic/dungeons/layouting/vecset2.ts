
import {Vec2} from "@benev/toolbox"
import {HashSet} from "../../../tools/hash/set.js"

const hash = (vector: Vec2) => `${vector.x},${vector.y}`

export class Vecset2<Value extends Vec2 = Vec2> extends HashSet<Value> {
	constructor(values: Value[] = []) {
		super(hash, values)
	}

	static dedupe<Value extends Vec2 = Vec2>(values: Value[]) {
		return new this(values).array()
	}
}

