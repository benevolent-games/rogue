
import {Degrees, Vec2} from "@benev/toolbox"

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
	},

	sim: {
		tickRate: 60,
		snapshotRate: 1,
		localSnapshotArea: new Vec2(25, 25),
	},

	physics: {
		iterations: 2,
		defaultDamping: 5,
		timeTillSleep: 1000,
	},

	crusader: {
		smoothing: 30 / 100,
		rotationSmoothing: 40 / 100,
		radius: 0.4,
		speed: 2,
		speedSprint: 4,
	},

	camera: {
		pivotHeight: 1.6,
		swivelSnappingIncrements: Degrees.toRadians(45),
		distanceBounds: new Vec2(6, 25),
		tiltBounds: new Vec2(Degrees.toRadians(0.1), Degrees.toRadians(60)),
		initial: {
			swivel: Degrees.toRadians(0),
			tilt: Degrees.toRadians(10),
			distanceFraction: 1 / 4,
		},
	},
}

