
import "@benev/slate/x/node.js"
import {Hex} from "@benev/slate"
import {Suite, expect} from "cynic"
import {bytekey, Kv} from "./index.js"

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
		const sub = kv.hexStore("a.b")
		await sub.put("deadbeef", 123)
		expect(await sub.get("deadbeef")).equals(123)
		expect(await kv.get(bytekey("a.b:", Hex.bytes("deadbeef")))).equals(123)
	},

	async "write transaction"() {
		const kv = new Kv()
		await kv.put("hello", "world")
		await kv.write(tn => [
			tn.put("alpha", "bravo"),
			tn.del("hello"),
		])
		expect(await kv.get("hello")).equals(undefined)
		expect(await kv.get("alpha")).equals("bravo")
	},

	async "multi-tier transaction"() {
		const kv = new Kv()
		const subsub = kv.namespace("a.b").namespace("c")
		await kv.write(tn => [
			tn.put("alpha", "bravo"),
			subsub.tn.put("charlie", "delta"),
		])
		expect(await kv.get("alpha")).equals("bravo")
		expect(await subsub.get("charlie")).equals("delta")
		expect(await kv.get("a.b.c:charlie")).equals("delta")
	},
}

