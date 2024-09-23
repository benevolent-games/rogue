
import "@benev/slate/x/node.js"

import {Suite, expect} from "cynic"
import inboxOutboxTest from "./logic/framework/relay/inbox-outbox.test.js"

export default <Suite>{
	inboxOutboxTest,
	test: async() => expect(true).ok(),
}

