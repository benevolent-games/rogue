
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

	game: {
		antialiasing: false,
		resolution: 0.25,
		tickRate: 60,
		snapshotRate: 1,
		physics: {
			iterations: 2,
			defaultDamping: 5,
		},
		crusader: {
			smoothing: 30 / 100,
			radius: 0.4,
			speed: 1.5,
			speedSprint: 2.5,
		},
	},
}

