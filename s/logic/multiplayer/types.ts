
export type GuestIdentity = {kind: "guest", id: string, avatarId: string}
export type AccountIdentity = {kind: "account", accountToken: string}
export type Identity = GuestIdentity | AccountIdentity

