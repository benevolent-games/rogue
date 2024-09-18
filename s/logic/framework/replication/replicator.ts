
import {Replicas, Replon} from "./types.js"

export class Replicator {
	replons = new Map<number, Replon<any>>

	constructor(public replicas: Replicas) {}
}

