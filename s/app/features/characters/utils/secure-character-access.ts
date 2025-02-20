
import {secure, Service} from "renraku"
import {DecreeSigner} from "../../security/decree/signer.js"
import {CharacterRecord, CharacterAccess, CharacterScope} from "../types.js"

export const secureCharacterAccess = <S extends Service>(
		signer: DecreeSigner,
		scope: CharacterScope,
		fn: (character: CharacterRecord) => S,
	) => secure(async(token: string) => {

	const access = await signer.verify<CharacterAccess>(token)

	if (access.scope !== scope)
		throw new Error(`character access scope "${scope}" required (got "${access.scope}")`)

	return fn(access.character)
})

