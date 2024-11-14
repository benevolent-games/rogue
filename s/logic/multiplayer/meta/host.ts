
export type MetaHost = ReturnType<typeof metaHostApi>

export function metaHostApi({replicatorId}: {replicatorId: number}) {
	return {
		async hello({identity}: {identity: string}) {
			console.log("HELLO!!!!!!!!!", replicatorId)
			return {replicatorId, identity}
		},
	}
}

