// Types for aquatic life vision simulation

export interface WaterClarity {
  name: 'clear' | 'murky' | 'muddy';
  label: string;
  kR: number; // Red attenuation coefficient (m⁻¹)
  kG: number; // Green attenuation coefficient (m⁻¹)
  kB: number; // Blue attenuation coefficient (m⁻¹)
}

export interface WaterProperties {
  clarity: WaterClarity;
  salinity: number; // Parts per thousand (ppt): 0 = freshwater, ~35 = ocean
  temperature?: number; // Celsius (future enhancement)
}

export interface LightCondition {
  name: 'bright' | 'overcast' | 'low-light';
  label: string;
  rodBlend: number; // Rod contribution (0-1)
  saturation: number; // Color saturation (0-1)
}

export interface SimulationParams {
  speciesId: string; // Selected fish species ID
  depth: number; // Depth in feet (0-30)
  waterProperties: WaterProperties;
  lightCondition: LightCondition;
  backscatter: boolean; // Add haze/veiling light
}

export interface JigPreset {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  description?: string;
}

export interface AquaticVisionResult {
  originalImage: ImageData;
  aquaticVisionImage: ImageData;
  processingTime: number;
}

// WebGL shader uniforms
export interface ShaderUniforms {
  u_image: WebGLTexture;
  u_depth: number;
  u_kR: number;
  u_kG: number;
  u_kB: number;
  u_salinity: number;
  u_rodBlend: number;
  u_saturation: number;
  u_backscatter: number;
}

// Aquatic species vision types
export type VisionType = 'monochromatic' | 'dichromatic' | 'trichromatic' | 'tetrachromatic' | 'pentachromatic';

// Aquatic species cone sensitivity matrices (configurable per species)
export interface VisionMatrices {
  visionType: VisionType;
  coneCount: number; // 1-5 cones
  rgbToSpecies: number[][]; // 3x{coneCount} matrix for species cone responses
  speciesToRgb: number[][]; // {coneCount}x3 matrix for reconstruction
  rodWeights: number[]; // [r, g, b] weights for rod response
  coneLabels?: string[]; // Optional labels for cone types (e.g., ['LWS', 'RH2'] for bass)
}