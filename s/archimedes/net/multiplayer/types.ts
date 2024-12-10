
// TODO probably archimedes shouldn't have these identity/account specific types...

export type RandoIdentity = {kind: "rando", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountToken: string}
export type Identity = RandoIdentity | AccountIdentity

