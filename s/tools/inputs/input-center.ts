
import {ev, mapGuarantee, Signal, signal} from "@benev/slate"
import {Action, Input, Listener, ActionGroups} from "./types.js"

export class InputCenter<AC extends ActionGroups, A extends ActionGroups> {
	readonly mode: Signal<keyof A>

	#actionSet = new Set<Action>()
	#listeners = new Map<Action, Set<Listener>>()

	#actionMemory = new Map<Action, Signal<Input>>()
	#codeMemory = new Map<string, Signal<{down: boolean}>>

	constructor(
			public readonly actionCatalog: AC,
			public readonly actionModes: A,
			startMode: keyof A,
		) {

		this.mode = signal(startMode)

		for (const actionGroup of Object.values(actionModes)) {
			for (const action of Object.values(actionGroup)) {
				this.#actionSet.add(action)
				this.#actionMemory.set(action, signal({
					action,
					down: false,
					repeat: false,
					time: Date.now(),
				}))
			}
		}
	}

	/** get currently-active actions for the given mode */
	get actions() {
		return this.actionModes[this.mode.value]
	}

	/** get the input signal for an action */
	getActionSignal(action: Action) {
		const signal = this.#actionMemory.get(action)
		if (!signal) throw new Error(`unknown action "${action.label}"`)
		return signal
	}

	getCodeSignal(code: string) {
		return mapGuarantee(this.#codeMemory, code, () => signal({down: false}))
	}

	/** listen for an action input */
	on(action: Action, listener: Listener) {
		let set = this.#listeners.get(action)
		if (!set) {
			set = new Set<Listener>()
			this.#listeners.set(action, set)
		}
		set.add(listener)
		return () => set.delete(listener)
	}

	/** invoke an action with the given input */
	invoke(input: Input) {
		const actionSignal = this.getActionSignal(input.action)
		actionSignal.value = input

		const listeners = this.#listeners.get(input.action)

		if (listeners)
			for (const action of listeners)
				action(input)
	}

	/** find an action by its code, eg, "KeyQ" or "Touch1" */
	find(code: string) {
		return Object.values(this.actions)
			.filter(action => action.codes.includes(code))
	}

	/** listen to keyboard events to invoke action inputs */
	listenForKeyboardEvents(target: EventTarget) {
		const keyaction = (down: boolean) => (event: KeyboardEvent) => {
			const codeSignal = this.getCodeSignal(event.code)
			codeSignal.value = {down}

			const actions = this.find(event.code)

			if (actions.length > 0)
				event.preventDefault()

			for (const action of actions)
				this.invoke({
					down,
					action,
					time: Date.now(),
					repeat: event.repeat,
				})
		}
		return ev(target, {
			keydown: keyaction(true),
			keyup: keyaction(false),
		})
	}
}

