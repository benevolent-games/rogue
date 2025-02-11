
import "@benev/slate/x/node.js"
import {Hex} from "@benev/slate"
import {Suite, expect} from "cynic"
import {byteify, Kv} from "./index.js"
import { collect } from "./utils/collect.js"

export default <Suite>{
	async "access string"() {
		const kv = new Kv()
		await kv.put("hello", "world")
		expect(await kv.get("hello")).equals("world")
	},

	async "access number"() {
		const kv = new Kv()
		await kv.put("hello", 123)
		expect(await kv.get("hello")).equals(123)
	},

	async "key iteration"() {
		const kv = new Kv()
		await kv.puts(
			["record:1", true],
			["record:2", true],
			["record:3", true],
			["record:4", true],
		)
		const keys = await collect(kv.keys())
		expect(keys.length).equals(4)
	},

	async "namespace"() {
		const kv = new Kv()
		const sub = kv.namespace("a.b")
		await sub.put("hello", 123)
		expect(await sub.get("hello")).equals(123)
		expect(await kv.get("a.b:hello")).equals(123)
	},

	async "sub namespace"() {
		const kv = new Kv()
		const subsub = kv.namespace("a.b").namespace("c")
		await subsub.put("hello", 123)
		expect(await subsub.get("hello")).equals(123)
		expect(await kv.get("a.b.c:hello")).equals(123)
	},

	async "hex store"() {
		const kv = new Kv()
		const sub = kv.hexspace("a.b")
		await sub.put("deadbeef", 123)
		expect(await sub.get("deadbeef")).equals(123)
		expect(await kv.get(byteify("a.b:", Hex.bytes("deadbeef")))).equals(123)
	},

	async "write transaction"() {
		const kv = new Kv()
		await kv.put("hello", "world")
		await kv.transaction(tn => [
			tn.put("alpha", "bravo"),
			tn.del("hello"),
		])
		expect(await kv.get("hello")).equals(undefined)
		expect(await kv.get("alpha")).equals("bravo")
	},

	async "multi-tier transaction"() {
		const kv = new Kv()
		const subsub = kv.namespace("a.b").namespace("c")
		await kv.transaction(tn => [
			tn.put("alpha", "bravo"),
			subsub.write.put("charlie", "delta"),
		])
		expect(await kv.get("alpha")).equals("bravo")
		expect(await subsub.get("charlie")).equals("delta")
		expect(await kv.get("a.b.c:charlie")).equals("delta")
	},
}

