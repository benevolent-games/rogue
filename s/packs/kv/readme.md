
> 🚨 ***not yet published*** -- this project has not yet been published as its own npm package, so this readme is a draft for when that happens

# 🪇 `@benev/kv` — Key-value Json Database for TypeScript

I just wanted a damn simple database.

With Kv, the keys are strings, and the values are automatically serialized as json.

Kv is an abstract database interface, where you jam in different "cores", like the `MemCore` for temporarily in-memory storage, or the [leveldb](https://github.com/Level/level) `LevelCore` for writing to disk on a server.

Kv can do smart stuff, like namespacing, batch operations, and atomic write transactions.

<br/>

## Install `@benev/kv`
- `npm install @benev/kv`
- include it into your project however you consume npm packages

<br/>

## Get started

### Make your Kv instance
- Kv uses the in-memory `MemCore` by default
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
- or alternatively, pop in a `StorageCore` to use browser localStorage
  ```ts
  import {Kv, Storage} from "@benev/kv"

  const kv = new Kv(new StorageCore())
  ```

### Put/get some key-value pairs
- The most basic thing you can do with Kv, is write and read values using string keys.
  ```ts
  await kv.put("101", "hello")
  await kv.put("102", 123.456)

  console.log(await kv.get("101")) // "hello"
  console.log(await kv.get("102")) // 123.456
  ```

<br/>

## Kv usage

### Example usage pattern
- so, for my use case, i'm doing stuff like saving user accounts, it might give you an idea of how Kv is meant to be used
  ```ts
  // create a kv instance
  const kv = new Kv()

  // creating some typed namespaces for which i'll insert records
  const accounts = kv.namespace<Account>("accounts")
  const characters = kv.namespace<Character>("characters")

  // my app's function for adding a character to an account
  async function addCharacter(accountId: string, character: Character) {

    // obtain the account
    const account = await accounts.require(accountId)
      // actually uses key `accounts:${accountId}` because of the namespace prefix

    // modifying the data
    character.ownerId = account.id
    account.characterIds.push(character.id)

    // create an atomic write transaction to save the data
    await kv.transaction(() => [
      accounts.write.put(account.id, account),
      characters.write.put(character.id, character),
    ])
  }

  // my app's function for listing all characters
  async function listCharacters(accountId: string) {
    const account = await accounts.require(accountId)
    return characters.requires(...account.characterIds)
  }
  ```

### Functionality reference
- `put` saves key-value pairs
  ```ts
  await kv.put("hello", "world")
  ```
- `put` can save any serializable json-friendly javascript crap
  ```ts
  await kv.put("hello", {data: ["world"], count: 123.456})
  ```
- `puts` saves many pairs, as an atomic batch
  ```ts
  await kv.puts(["101", "alpha"], ["102", "bravo"])
  ```
- `get` loads a value (or undefined if the key's not found)
  ```ts
  const value = await kv.get("hello")
  ```
- `gets` loads many values at once
  ```ts
  const values = await kv.gets("101", "102", "103")
  ```
- `del` deletes things
  ```ts
  await kv.del("hello")
  ```
- `del` can also delete many things
  ```ts
  await kv.del("101", "102", "103")
  ```
- `has` checks if a key exists
  ```ts
  await kv.has("hello")
  ```
- `hasKeys` checks many keys
  ```ts
  await kv.hasKeys("101", "102", "103")
  ```
- `require` gets a value, but throws an error if the key is missing
  ```ts
  const value = await kv.require("hello")
  ```
- `requires` gets many things, throws an error if any keys are missing
  ```ts
  const values = await kv.require("101", "102")
  ```
- `guarantee` gets or creates a thing
  ```ts
  const value = await kv.guarantee("hello", () => "world")
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

### Namespaces keep things tidy
- a namespace is just a Kv instance that has a key prefix assigned
  ```ts
  const records = kv.namespace("records")

  // writes to key "records:123"
  await records.put("123", "lol")
  ```
- a namespace can do everything a Kv can do
  ```ts
  const records = kv.namespace("records")
  await records.put("124", {data: "bingus"})
  await records.transaction(write => [write.del("124")])
  ```
- yes, you can namespace a namespace — *it's turtles all the way down*
  ```ts
  const records = kv.namespace("records")
  const owners = records.namespace("owners")
  const accounts = records.namespace("accounts")

  // writes to key "records.owners:5"
  await owners.put("5", "lol")

  // writes to key "records.accounts:123"
  await accounts.put("123", "rofl")
  ```
- you can constrain a namespace with a typescript type
  ```ts
  type MyData = {count: number}

    //                  provide your type
    //                           👇
  const records = kv.namespace<MyData>("records")

  // now typescript knows `count` is a number
  const {count} = records.get("123")
  ```
- you can in fact do transactional writes across multiple namespaces
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

### Stores keep you focused
- a store is an object that focuses on reading/writing the value of a single key
  ```ts
  const login = kv.store<Login>("login")

  await login.put({token: "lol"})

  const {token} = await login.get()
  ```

<br/>

## Cores
- if you want Kv to operate on a new database, it's pretty easy to write a new Core
  ```ts
  export abstract class Core {
    abstract gets(...keys: string[]): Promise<(string | undefined)[]>
    abstract hasKeys(...keys: string[]): Promise<boolean[]>
    abstract keys(scan?: Scan): AsyncGenerator<string>
    abstract entries(scan?: Scan): AsyncGenerator<[string, string]>
    abstract transaction(...writes: Write[]): Promise<void>
  }
  ```
  - `transaction` only has to support two kinds of Write objects, `put` and `del`
- then you can just provide your new core to the Kv constructor, eg
  ```ts
  // make your own core
  const core = new MyCore()

  // provide it to Kv and there you go
  const kv = new Kv(core)
  ```
- see [mem.ts](./cores/mem.ts), which implements the MemCore
- see [level.ts](./cores/level.ts) which implements the LevelCore
- you can do it!

<br/>

## That's all
- free and open source
- star this on github if you think it's cool

