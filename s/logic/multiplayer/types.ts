
export type AnonIdentity = {kind: "anon", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountToken: string}
export type Identity = AnonIdentity | AccountIdentity

