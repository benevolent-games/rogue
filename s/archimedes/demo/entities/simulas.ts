
import {Station} from "../station.js"
import {GameEntities} from "./entities.js"
import {bootstrapSimula} from "./bootstrap/simula.js"
import {Simulas} from "../../framework/simulation/types.js"

export const simulas: Simulas<GameEntities, Station> = {
	bootstrap: bootstrapSimula,
}

