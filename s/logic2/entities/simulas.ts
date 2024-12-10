
import {RogueEntities} from "./entities.js"
import {Simulas} from "../../archimedes/exports.js"

import {Station} from "../station/station.js"
import {dungeonSimula} from "./dungeon/simula.js"
import {crusaderSimula} from "./crusader/simula.js"

export const simulas: Simulas<RogueEntities, Station> = {
	crusader: crusaderSimula,
	dungeon: dungeonSimula,
}

