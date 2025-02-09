
import {Bicomm} from "../../relay/fiber.js"
import {Bidirectional, endpoint, Fns, JsonRpc, remote} from "renraku"

export function renrakuChannel<LocalFns extends Fns, RemoteFns extends Fns>(o: {
		bicomm: Bicomm<JsonRpc.Bidirectional>
		localFns: LocalFns
		timeout: number
	}) {

	const clientEndpoint = endpoint(o.localFns)

	const bidirectional = new Bidirectional({
		timeout: o.timeout,
		onSend: outgoing => o.bicomm.send(outgoing),
	})

	o.bicomm.recv.on(incoming => bidirectional.receive(clientEndpoint, incoming))

	return remote<RemoteFns>(bidirectional.remoteEndpoint)
}

