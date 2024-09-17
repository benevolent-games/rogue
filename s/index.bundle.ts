
void async function main() {

	// rollup chunking should automatically checksum this for cache-busting
	await import("./starter.js")
}()

