
import {Quat, Vec3} from "@benev/toolbox"

export type Spatial = Partial<{
	position: Vec3
	rotation: Quat
	scale: Vec3
}>

export type ManifestQuery = Record<string, string | boolean>

