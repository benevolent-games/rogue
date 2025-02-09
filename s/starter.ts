
import {loggers} from "renraku"
import {register_to_dom} from "@benev/slate"
import {components} from "@authlocal/authlocal"

import {context} from "./app/context.js"
import {GameApp} from "./app/elements/app/element.js"

void context

loggers.onCall = () => {}

register_to_dom({GameApp, ...components})

