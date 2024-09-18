
import {Realm} from "./realm.js"
import {Station} from "./station.js"
import {simulas} from "./archetypes/simulas.js"
import {replicas} from "./archetypes/replicas.js"
import {Simulator} from "./framework/simulation/simulator.js"
import {Replicator} from "./framework/replication/replicator.js"

const station = new Station()
const realm = new Realm()

const simulator = new Simulator(station, simulas)
const replicator = new Replicator(realm, replicas, 0)

const player = simulator.create("player", {owner: 0, position: [0, 0]})
const feed = simulator.simulate([])
const feedback = replicator.replicate(feed)
const feed2 = simulator.simulate([[0, feedback]])

