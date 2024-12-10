
import {LagProfile} from "./fake-lag.js"

export const lagProfiles = {
	none: null,

	nice: {
		ping: 20,
		jitter: 5,
		loss: 1 / 100,
		spikeMultiplier: 1.1,
		spikeTime: 1000,
		smoothTime: 5000,
	},

	mid: {
		ping: 70,
		jitter: 10,
		loss: 2 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	},

	bad: {
		ping: 120,
		jitter: 20,
		loss: 5 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	},

	spotty: {
		ping: 120,
		jitter: 20,
		loss: 75 / 100,
		spikeMultiplier: 2,
		spikeTime: 400,
		smoothTime: 2000,
	},

	terrible: {
		ping: 300,
		jitter: 100,
		loss: 10 / 100,
		spikeMultiplier: 1.5,
		spikeTime: 1000,
		smoothTime: 5000,
	},

	longsmooth: {
		ping: 500,
		jitter: 0,
		loss: 0 / 100,
		spikeMultiplier: 1,
		spikeTime: 1000,
		smoothTime: 5000,
	},
} satisfies Record<string, LagProfile | null>

