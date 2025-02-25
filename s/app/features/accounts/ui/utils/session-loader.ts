
import {authorize} from "renraku"
import {Randy} from "@benev/toolbox"
import {Hex, Op, opSignal, signal} from "@benev/slate"
import {Auth, Future, Login, Passport} from "@authlocal/authlocal"

import {Session} from "../types.js"
import {Commons} from "../../../../types.js"
import {Avatar} from "../../avatars/avatar.js"
import {Names} from "../../../../../tools/names.js"
import {LocalSchema} from "../../../schema/local.js"
import {OpWaiter} from "../../../../../tools/op-waiter.js"
import {AccountDecrees} from "../../utils/account-decrees.js"
import {AccountKind, AccountPreferences} from "../../types.js"
import {bytesToInteger} from "../../../../../tools/temp/bytes-to-integer.js"

export type SessionLoader = Awaited<ReturnType<typeof makeSessionLoader>>

export async function makeSessionLoader(commons: Commons, auth: Auth) {
	const sessionOp = opSignal<Session>()
	const waiter = new OpWaiter(sessionOp)

	async function reload() {
		return await sessionOp.load(async() => await loadSession(commons, auth.login))
	}

	async function obtain() {
		let session = await waiter.wait
		try { await AccountDecrees.verify(commons.verifier, session.accountDecree) }
		catch (_) { session = await reload() }
		return session
	}

	const session = await reload()
	const sessionSignal = signal<Session>(session)

	sessionOp.setReady(session)

	sessionOp.on(op => {
		const session = Op.payload(op)
		if (session)
			sessionSignal.value = session
	})

	return {
		session: sessionSignal,
		sessionOp,
		reload,
		obtain,
	}
}

///////////////////////////////////////////
///////////////////////////////////////////

async function loadSession(commons: Commons, login: Login | null): Promise<Session> {
	if (!login)
		return obtainRandoSession(commons)

	const accounting = authorize(commons.api.v1.accounting, async() => ({
		kind: "authlocal" as AccountKind,
		proofToken: login.proof.token,
	}))

	let report = await accounting.loadAccount()

	if (report.accountRecord.preferences.name !== login.name)
		report = await accounting.saveAccount({...report.accountRecord.preferences, name: login.name})

	const {accountDecree, accountRecord} = report
	const account = await AccountDecrees.verify(commons.verifier, accountDecree)

	return {
		login,
		account,
		accountRecord,
		accountDecree,
	}
}

async function obtainRandoSession(commons: Commons): Promise<Session> {
	const login = await obtainLogin(commons.schema)
	const preferences = generatePreferences(login)

	const accounting = authorize(commons.api.v1.accounting, async() => ({
		kind: "rando" as AccountKind,
		proofToken: login.proof.token,
	}))

	const {accountRecord, accountDecree} = await accounting.saveAccount(preferences)
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

