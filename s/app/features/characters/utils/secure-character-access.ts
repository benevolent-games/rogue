
import {secure, Service} from "renraku"
import {DecreeSigner} from "../../security/decree/signer.js"
import {Character, CharacterAccess, CharacterScope} from "../types.js"

export const secureCharacterAccess = <S extends Service>(
		signer: DecreeSigner,
		scope: CharacterScope,
		fn: (character: Character) => S,
	) => secure(async(token: string) => {

	const access = await signer.verify<CharacterAccess>(token)

	if (access.scope !== scope)
		throw new Error(`character access scope "${scope}" required (got "${access.scope}")`)

	return fn(access.character)
})

