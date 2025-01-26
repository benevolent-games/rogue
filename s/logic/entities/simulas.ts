
import {RogueEntities} from "./entities.js"
import {Simulas} from "../../archimedes/exports.js"

import {botSimula} from "./bot/simula.js"
import {Station} from "../station/station.js"
import {blockSimula} from "./block/simula.js"
import {dungeonSimula} from "./dungeon/simula.js"
import {crusaderSimula} from "./crusader/simula.js"

export const simulas: Simulas<RogueEntities, Station> = {
	bot: botSimula,
	block: blockSimula,
	dungeon: dungeonSimula,
	crusader: crusaderSimula,
}

