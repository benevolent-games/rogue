
import {PhysBody} from "./body.js"
import {Box2} from "../shapes/box2.js"
import {Circle} from "../shapes/circle.js"

export type PhysShape = Box2 | Circle

export type PartOptions = {
	shape: PhysShape
	mass: number
}

export type BodyOptions = {
	parts: PartOptions[]
	updated: (body: PhysBody) => void
}

