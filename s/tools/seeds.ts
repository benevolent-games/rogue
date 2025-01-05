
export const Seeds = {
	daily() {
		const now = new Date()
		const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		return Math.floor(utcMidnight / (1000 * 60 * 60 * 24))
	},
}

