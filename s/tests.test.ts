
import "@benev/slate/x/node.js"

import {Suite} from "cynic"
import archimedes from "./packs/archimedes/test.test.js"
import buckets from "./tools/buckets/buckets.test.js"
import inboxOutbox from "./packs/archimedes/net/relay/inbox-outbox.test.js"

export default <Suite>{
	buckets,
	archimedes,
	inboxOutbox,
}

