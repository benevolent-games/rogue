
export const constants = {
	urls: {
		cover: "/assets/images/rogue-crusade-poster.webp",
		benevLogo: "/assets/graphics/benevolent2.svg",
		envmap: "/assets/studiolights.env",
		dungeonGlb: "/assets/dungeons/byzantium-006.glb",
		shaders: {
			retro: "/assets/shaders/retro-02.json",
		},
	},

	ui: {
		animTime: 250,
	},

	fx: {
		antialiasing: false,
		resolution: 0.25,
	},

	sim: {
		tickRate: 60,
		snapshotRate: 1,
	},

	physics: {
		iterations: 2,
		defaultDamping: 5,
		timeTillSleep: 1000,
	},

	crusader: {
		smoothing: 30 / 100,
		radius: 0.4,
		speed: 2,
		speedSprint: 3.5,
	},
}

