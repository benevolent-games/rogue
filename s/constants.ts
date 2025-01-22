
import {Degrees, Vec2} from "@benev/toolbox"

export const constants = {
	urls: {
		cover: "/assets/images/rogue-crusade-poster.webp",
		benevLogo: "/assets/graphics/benevolent2.svg",
		envmap: "/assets/studiolights.env",
		dungeonGlb: "/assets/dungeons/byzantium-006.glb",
		pimsleyGlb: "/assets/glbs/pimsley-anims13.glb",
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
		height: 1.8,
		radius: 0.3,
		torchHeight: 3,
		movement: {
			speed: 2,
			speedSprint: 3,
			attackingSpeedMultiplier: 1,
			sprintWhileAttacking: false,
			omnidirectionalSprint: false,
		},
		anim: {
			speedMultiplier: 0.75,
			strafeSpeedIncrease: 0.6,
			movementSharpness: 20,
			rotationSharpness: 20,
			legworkSharpness: 5,
			sprintSway: Degrees.toRadians(15),
		},
		turnCap: {
			adaptationSharpness: 3,
			standstill: Degrees.toRadians(700),
			fullsprint: Degrees.toRadians(180),
		},
	},

	camera: {
		moveSharpness: 10,
		pivotHeight: 1.2,
		swivelSnappingIncrements: 0, // Degrees.toRadians(45),
		distanceBounds: new Vec2(3, 25),
		tiltBounds: new Vec2(Degrees.toRadians(0.1), Degrees.toRadians(60)),
		initial: {
			swivel: Degrees.toRadians(0),
			tilt: Degrees.toRadians(10),
			distanceFraction: 1 / 4,
		},
	},
}

