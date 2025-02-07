
import {secure, Service} from "renraku"
import {Keychain} from "../../utils/keychain.js"
import {Character, CharacterAccess, CharacterScope} from "../types.js"

export const secureCharacterAccess = <S extends Service>(
		keychain: Keychain,
		scope: CharacterScope,
		fn: (character: Character) => S,
	) => secure(async(token: string) => {

	const access = await keychain.verify<CharacterAccess>(token)

	if (access.scope !== scope)
		throw new Error(`character access scope "${scope}" required (got "${access.scope}")`)

	return fn(access.character)
})

