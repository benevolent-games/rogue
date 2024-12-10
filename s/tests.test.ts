
import "@benev/slate/x/node.js"

import {Suite, expect} from "cynic"
import archimedes from "./archimedes/test.test.js"
import inboxOutbox from "./archimedes/net/relay/inbox-outbox.test.js"

export default <Suite>{
	archimedes,
	inboxOutbox,
	test: async() => expect(true).ok(),
}

