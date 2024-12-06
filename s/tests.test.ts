
import "@benev/slate/x/node.js"

import {Suite, expect} from "cynic"
import archimedes from "./archimedes/test.test.js"
import inboxOutboxTest from "./logic/framework/relay/inbox-outbox.test.js"

export default <Suite>{
	archimedes,
	inboxOutboxTest,
	test: async() => expect(true).ok(),
}

