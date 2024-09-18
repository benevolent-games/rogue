
import {Scene} from "@babylonjs/core"
import {Iron, AnyEngine, CanvasScaler, Gameloop, Rendering, loadGlb} from "@benev/toolbox"

export class World {
	static load = async() => {
		const canvas = document.createElement("canvas")

		const engine = await Iron.engine({
			canvas,
			webgl: {
				alpha: false,
				desynchronized: true,
				preserveDrawingBuffer: false,
				powerPreference: "high-performance",
			},
			// webgpu: {
			// 	antialias: true,
			// 	audioEngine: true,
			// 	powerPreference: "high-performance",
			// },
		})

		const scaler = Iron.canvasScaler(canvas)
		const scene = Iron.scene({engine, background: [.1, .1, .1, 1]})
		const gameloop = Iron.gameloop(engine, [scene])
		const rendering = Iron.rendering(scene)

		function dispose() {
			gameloop.stop()
			scene.dispose()
			engine.dispose()
		}

		return new this(
			canvas,
			scaler,
			engine,
			scene,
			gameloop,
			rendering,
			dispose,
		)
	}

	constructor(
		public readonly canvas: HTMLCanvasElement,
		public readonly scaler: CanvasScaler,
		public readonly engine: AnyEngine,
		public readonly scene: Scene,
		public readonly gameloop: Gameloop,
		public readonly rendering: Rendering,
		public readonly dispose: () => void,
	) {}

	async loadContainer(url: string) {
		return await loadGlb(this.scene, url)
	}
}

