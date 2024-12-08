
export type RandoIdentity = {kind: "rando", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountToken: string}
export type Identity = RandoIdentity | AccountIdentity

