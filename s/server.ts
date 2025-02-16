
import "@benev/slate/x/node.js"
import {endpoint} from "renraku"
import {HttpServer} from "renraku/x/server.js"
import {Kv} from "./packs/kv/kv.js"
import {makeApi} from "./app/api.js"
import {LevelCore} from "./packs/kv/cores/level.js"

const kv = new Kv(new LevelCore("database"))
const api = await makeApi(kv)
new HttpServer(() => endpoint(api)).listen(8000)

