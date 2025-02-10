
> 🚨 ***not yet published*** -- this project has not yet been published as its own npm package, so this readme is a draft for when that happens

# 🪇 `@benev/kv` — Key-value database for typescript

We just wanted to interact with a damn simple database.
- minimal: it's just keys and values, bucko
- portable: what could be easier to port than keys and bloody values?
- testable: it defaults to running in-memory, for your tests and crap
- smart: yeah it's architected for fancy atomic transactions and all that
- convenient: it's got handy convenience methods like `.guarantee` and whatever

<br/>

## Install `@benev/kv`
- `npm install @benev/kv`
- include it into your project however you consume npm packages

<br/>

## Make a Kv instance
- a default kv instance operates in-memory by default
  ```ts
  import {Kv} from "@benev/kv"

  const kv = new Kv()
  ```
- or alternatively, pop in a `LevelCore` to use [leveldb](https://github.com/Level/level), a local on-disk database (kinda like sqlite)
  ```ts
  import {Kv} from "@benev/kv"
  import {LevelCore} from "@benev/kv/x/cores/level.js"

  const kv = new Kv(new LevelCore("path/to/database"))
  ```

<br/>

## Kv usage

### Basic functionality
- `put` to set something
  ```ts
  await kv.put("hello", "world")

  // values are in json by default
  await kv.put("hello", {data: "world", count: 123})
  ```
- `puts` to set many things
  ```ts
  await kv.puts(["101", "alpha"], ["102", "bravo"])
  ```
- `get` to read something
  ```ts
  const value = await kv.get("hello")
  ```
- `gets` to get many things
  ```ts
  const values = await kv.gets("101", "102")
  ```
- `del` to delete something
  ```ts
  await kv.del("hello")
  ```
- `del` can also delete many things
  ```ts
  await kv.del("101", "102")
  ```
- `has` to check if a key exists
  ```ts
  await kv.has("hello")
  ```
- `has` can also check many things
  ```ts
  await kv.has("101", "102")
  ```
- `require` gets a thing, and if the key is missing it throws an error
  ```ts
  const value = await kv.require("hello")
  ```
- `requires` gets many things, and if any key is missing it throws an error
  ```ts
  const values = await kv.require("101", "102")
  ```
- `guarantee` gets or creates a thing
  ```ts
  const value = await kv.guarantee("hello", () => "world")
  ```

### Values in json, strings, or bytes
- the normal kv methods read and write in `json` format
  ```ts
  // write json
  await kv.put("hello", {lol: 123})

  // read json
  const value = await kv.get("hello")

  value.lol // 123
  ```
- use `kv.string` to interact with strings instead of json
  ```ts
  await kv.string.put("hello", "world")
  ```
- use `kv.bytes` to interact with bytes instead of json
  ```ts
  await kv.bytes.put("hello", Uint8Array.from([0xde, 0xad, 0xbe, 0xef]))
  ```

### Keys can be strings or bytes
- you can use strings or bytes for keys, whether you're using `kv`, `kv.string`, or `kv.bytes`
- use strings for keys
  ```ts
  await kv.del("hello")
  ```
- use bytes for keys
  ```ts
  await kv.del(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]))
  ```
- convert/concatenate them together into byte form
  ```ts
  const key = Kv.byteify("hello:", Uint8Array.from([0xde, 0xad, 0xbe, 0xef]))
  await kv.del(key)
  ```

### Transactions make you cool and incredible
- make an atomic transaction, where the writes happen all-or-nothing to avoid corruption
  ```ts
  // all these succeed or fail together
  await kv.transaction(write => [
    write.del("obsolete:99"),
    write.put("owners:4", [101, 102]),
    write.puts(
      ["records:101", {msg: "lol", owner: 4}],
      ["records:102", {msg: "lel", owner: 4}],
    ),
  ])
  ```
  - you can use `write.put`, `write.puts`, and `write.del` to schedule write operations into the transaction
- you can borrow the `write` from the format adapters, like `kv.string.write` or `kv.bytes.write`, like this:
  ```ts
  await kv.transaction(() => [
    kv.string.write.put("alpha", "123"),
    kv.bytes.write.put("bravo", Uint8Array.from([0xde, 0xad])),
  ])
  ```

### Namespaces
- a namespace is just a Kv instance that has a key prefix assigned
  ```ts
  const records = kv.namespace("records")

  // writes to key "records:123"
  await records.put("123", "lol")
  ```
- a namespace can do everything a Kv can do, transactions, .bytes, whatever
  ```ts
  const records = kv.namespace("records")
  await records.bytes.put("124", Uint8Array.from([0xde, 0xad]))
  await records.transaction(write => [write.del("124")])
  ```
- yes, you can namespace a namespace -- it's turtles all the way down
  ```ts
  const records = kv.namespace("records")
  const owners = records.namespace("owners")
  const accounts = records.namespace("accounts")

  // writes to key "records.owners:5"
  await owners.put("5", "lol")

  // writes to key "records.accounts:123"
  await accounts.put("123", "rofl")
  ```
- you can pass in a type for the namespace
  ```ts
  type MyData = {count: number}

    //                    provide your type
    //                           👇
  const records = kv.namespace<MyData>("records")

  // now typescript knows `count` is a number
  const {count} = records.get("123")
  ```

### Transactional writes across multiple namespaces
- yep, i even thought of this
  ```ts
  const records = kv.namespace("records")
  const owners = records.namespace("owners")
  const accounts = records.namespace("accounts")

  await kv.transaction(() => [
    owners.write.put("5", {records: [101, 102]}),
    accounts.write.put("101", {data: "alpha", owner: 5}),
    accounts.write.put("102", {data: "bravo", owner: 5}),
  ])
  ```

### Hexspaces
- a hexspace is a special namespace that specifically accepts hex-encoded id strings as keys
  ```ts
  const users = kv.hexspace<UserData>("accounting.users")

  // this is a 64 character hex id string
  //  - as a string, this is 64 bytes
  //  - but as a Uint8Array buffer, it can be stored as 32 bytes
  const id = "51c32f433eb851523f61599d04c0781d287d12cff1e37e10a37df5a43ccc3204"
    // note, the hex ids do not need to be 64 characters long,
    // hexspace will accept any even number of characters here

  // writes to key "accounting.users:" plus 32 bytes
  await users.put(id, {userData: 123})
  ```
- i use hexspaces a lot because most of my records have hexadecimal identifiers

<br/>

## Cores
- if you want Kv to operate on a new database, it's very easy to write a new Core
  ```ts
  export abstract class Core {
    abstract gets(...keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
    abstract has(...keys: Uint8Array[]): Promise<boolean>
    abstract transaction(...writes: Write[]): Promise<void>
  }
  ```
  - all of the functionality of Kv is sugar around these three core methods
  - `transaction` only has to support two kinds of Write objects, `put` and `del`
- see [mem.ts](./cores/mem.ts), which implements the MemCore very tersely
- see [level.ts](./cores/level.ts) which implements the LevelCore very tersely
- you can do it!

<br/>

## That's all
- free and open source
- star this on github if you think it's cool

