
import {simulas} from "./archetypes/simulas.js"
import {replicas} from "./archetypes/replicas.js"
import {Simulator} from "./framework/simulation/simulator.js"
import {Replicator} from "./framework/replication/replicator.js"

const simulator = new Simulator(simulas)
const replicator = new Replicator(replicas)

const player = simulator.create("player", [1, 2])

