
import {DracoDecoder} from "@babylonjs/core/Meshes/Compression/dracoDecoder.js"

const dir = "/node_modules/@babylonjs/core/assets/Draco"

DracoDecoder.DefaultConfiguration.wasmUrl = `${dir}/draco_wasm_wrapper_gltf.js`
DracoDecoder.DefaultConfiguration.wasmBinaryUrl = `${dir}/draco_decoder_gltf.wasm`
DracoDecoder.DefaultConfiguration.fallbackUrl = `${dir}/draco_decoder_gltf.js`

