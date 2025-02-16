
import "@benev/slate/x/node.js"

import {Suite} from "cynic"
import kv from "./packs/kv/kv.test.js"
import buckets from "./tools/buckets/buckets.test.js"
import archimedes from "./packs/archimedes/test.test.js"
import inboxOutbox from "./packs/archimedes/net/relay/inbox-outbox.test.js"

export default <Suite>{
	kv,
	buckets,
	archimedes,
	inboxOutbox,
}

