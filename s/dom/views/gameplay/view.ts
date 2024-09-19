
import {html} from "@benev/slate"

import styles from "./styles.js"
import {nexus} from "../../nexus.js"
import {Realm} from "../../../logic/realm/realm.js"

export const Gameplay = nexus.shadowView(use => ({realm, exitToMainMenu}: {
		realm: Realm
		exitToMainMenu: () => void,
	}) => {

	use.name("gameplay-view")
	use.styles(styles)

	return html`
		${realm.world.canvas}
		<div class=overlay>
			<div class=topbar>
				<button @click="${exitToMainMenu}">menu</button>
			</div>
		</div>
	`
})

