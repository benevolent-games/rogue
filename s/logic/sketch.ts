
import {simulas} from "./archetypes/simulas.js"
import {replicas} from "./archetypes/replicas.js"
import {Simulator} from "./framework/simulation/simulator.js"
import {Replicator} from "./framework/replication/replicator.js"

const simulator = new Simulator(simulas)

const replicator = new Replicator(0, replicas)

const player = simulator.create("player", [1, 2])

const feed = simulator.simulate([])

const feedback = replicator.replicate(feed)

const feed2 = simulator.simulate([[0, feedback]])


