// Stub di `three/webgpu`.
//
// three-globe importa `WebGPURenderer` e `StorageInstancedBufferAttribute` da
// `three/webgpu`, ma li usa SOLO in un percorso di GPU-compute basato su WebGPU
// che questa app non attiva mai (usiamo points/arcs/rings/polygons via WebGL).
// Caricare davvero `three/webgpu` fa crashare i browser senza WebGPU (es. Safari
// iOS) perché valuta `GPUShaderStage` al momento dell'import. Con questo stub il
// modulo reale non viene mai caricato; il rendering WebGL resta identico.

export class WebGPURenderer {
  constructor() {
    throw new Error(
      "three/webgpu è disattivato (stub): percorso GPU-compute non supportato in questa app.",
    );
  }
}

export class StorageInstancedBufferAttribute {}
