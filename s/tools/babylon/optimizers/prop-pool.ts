
import {Prop} from "@benev/toolbox"

import {Pool} from "./pool.js"
import {Crate} from "../logistics/crate.js"

export class PropPool extends Pool<Prop> {
	constructor(crate: Crate, instance: boolean) {
		super(() => {
			const payload = instance
				? crate.instance()
				: crate.clone()
			return {
				payload,
				noodle: {
					enable: () => payload.setEnabled(true),
					disable: () => payload.setEnabled(false),
					dispose: () => payload.dispose(),
				},
			}
		})
	}
}

