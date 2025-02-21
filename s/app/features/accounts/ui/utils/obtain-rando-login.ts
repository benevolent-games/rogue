
import {Future, Login, Passport, PassportData} from "@authlocal/authlocal"
import {Store} from "../../../../../packs/kv/parts/store.js"

export async function obtainRandoLogin(store: Store<PassportData>) {
	const generatedPassportData = (await Passport.generate()).toData()
	const passportData = await store.guarantee(() => generatedPassportData)
	const passport = Passport.fromData(passportData)
	const {origin} = window.location
	const loginTokens = await passport.signLoginTokens({
		issuer: origin,
		audience: origin,
		expiresAt: Future.days(7),
	})
	return Login.verify(loginTokens, {allowedAudiences: [origin]})
}

