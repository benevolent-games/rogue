
import {loggers} from "renraku"
import {components} from "@authduo/authduo"
import {register_to_dom} from "@benev/slate"

import {context} from "./dom/context.js"
import {GameApp} from "./dom/elements/app/element.js"

void context

loggers.onCall = () => {}

register_to_dom({GameApp, ...components})

