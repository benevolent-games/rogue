
import {Hex} from "@benev/slate"
import {authorize} from "renraku"
import {Randy} from "@benev/toolbox"
import {Future, Login, Passport} from "@authlocal/authlocal"

import {Session} from "../types.js"
import {Commons} from "../../../../types.js"
import {Avatar} from "../../avatars/avatar.js"
import {Names} from "../../../../../tools/names.js"
import {LocalSchema} from "../../../schema/local.js"
import {AccountDecrees} from "../../utils/account-decrees.js"
import {AccountKind, AccountPreferences} from "../../types.js"
import {bytesToInteger} from "../../../../../tools/temp/bytes-to-integer.js"

export async function loadSession(commons: Commons, login: Login | null): Promise<Session> {
	if (!login) return obtainRandoSession(commons)

	const accountant = authorize(commons.api.v1.accountant, async() => ({
		kind: "authlocal" as AccountKind,
		proofToken: login.proof.token,
	}))

	let report = await accountant.loadAccount()

	if (report.accountRecord.preferences.name !== login.name)
		report = await accountant.saveAccount({...report.accountRecord.preferences, name: login.name})

	const {accountDecree, accountRecord} = report
	const account = await AccountDecrees.verify(commons.verifier, accountDecree)

	return {
		login,
		account,
		accountRecord,
		accountDecree,
	}
}

///////////////////////////////////////////
///////////////////////////////////////////

async function obtainRandoSession(commons: Commons): Promise<Session> {
	const login = await obtainLogin(commons.schema)
	const preferences = generatePreferences(login)

	const accountant = authorize(commons.api.v1.accountant, async() => ({
		kind: "rando" as AccountKind,
		proofToken: login.proof.token,
	}))

	const {accountRecord, accountDecree} = await accountant.saveAccount(preferences)
	const account = await AccountDecrees.verify(commons.verifier, accountDecree)

	return {
		login,
		account,
		accountDecree,
		accountRecord,
	}
}

async function obtainPassport(schema: LocalSchema) {
	const passportData = await schema.accounts.rando.passport.guarantee(async() => {
		const passport = await Passport.generate()
		return passport.toData()
	})
	return Passport.fromData(passportData)
}

async function signFreshLoginTokens(passport: Passport, audience: string) {
	return passport.signLoginTokens({
		issuer: audience,
		audience: audience,
		expiresAt: Future.days(7),
	})
}

async function obtainLogin(schema: LocalSchema) {
	const audience = window.location.origin
	const passport = await obtainPassport(schema)

	const loginTokens = await schema.accounts.rando.login
		.guarantee(async() => signFreshLoginTokens(passport, audience))

	return Login.verify(loginTokens, {allowedAudiences: [audience]})
		.catch(async() => {
			const fresherTokens = await signFreshLoginTokens(passport, audience)
			return Login.verify(fresherTokens, {allowedAudiences: [audience]})
		})
}

function generatePreferences(login: Login): AccountPreferences {
	const bytes = Hex.bytes(login.thumbprint)
	const integer = bytesToInteger(bytes)
	const randy = new Randy(integer)
	return {
		name: Names.falrysk.generate(bytes),
		avatarId: randy.choose(Avatar.selectKind("rando")).id,
	}
}

