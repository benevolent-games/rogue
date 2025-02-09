
import {register_to_dom} from "@benev/slate"
import {GameDev} from "../app/elements/dev/element.js"
import {components as authlocalComponents} from "@authlocal/authlocal"

register_to_dom({GameDev, ...authlocalComponents})

