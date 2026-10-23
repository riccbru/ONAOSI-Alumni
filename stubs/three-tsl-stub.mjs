// Stub di `three/tsl` (Three Shading Language).
//
// three-globe fa `import * as tsl from 'three/tsl'` e destruttura `tsl` solo
// dentro le funzioni del percorso GPU-compute (WebGPU) che non usiamo mai.
// Un namespace vuoto è sufficiente: evita di caricare il modulo reale, che
// tirerebbe dentro `three/webgpu` e quindi `GPUShaderStage` (crash su Safari iOS).

export {};
