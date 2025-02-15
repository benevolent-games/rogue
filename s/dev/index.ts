
import {register_to_dom} from "@benev/slate"

import {Context} from "../app/context.js"
import {GameDev} from "../app/elements/dev/element.js"
import {components as authlocalComponents} from "@authlocal/authlocal"

await Context.mock()

register_to_dom({GameDev, ...authlocalComponents})

