
import {loggers} from "renraku"
import {register_to_dom} from "@benev/slate"
import {components} from "@authlocal/authlocal"

import {Context} from "./app/context.js"
import {GameApp} from "./app/elements/app/element.js"

await Context.make()

loggers.onCall = () => {}

register_to_dom({GameApp, ...components})

