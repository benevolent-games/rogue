
import {Map2} from "@benev/slate"
import {Prop} from "@benev/toolbox"
import {Propname} from "../../../../tools/propnames/propnames.js"

export type PropCategory = Map2<string, Map2<Propname, Prop>>

export class OrganizedProps {
	props: Map2<Propname, Prop>

	constructor(props: Map<string, Prop>) {
		this.props = new Map2<Propname, Prop>(
			[...props.entries()]
				.map(([name, prop]) => [Propname.parse(name), prop])
		)
	}

	categorize(key: string): PropCategory {
		const {props} = this
		return new Map2(
			[...Propname.organize(key, [...props.keys()])]
				.map(([style, propnames]) => [
					style,
					new Map2(
						propnames.map(propname => [
							propname,
							props.require(propname),
						])
					),
				])
		)
	}
}

