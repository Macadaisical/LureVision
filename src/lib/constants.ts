import { WaterClarity, LightCondition, VisionMatrices, WaterProperties } from '@/types';

// Water clarity presets with scientifically-based attenuation coefficients
export const WATER_CLARITY_PRESETS: WaterClarity[] = [
  {
    name: 'clear',
    label: 'Clear',
    kR: 0.30, // Red attenuates fastest
    kG: 0.12,
    kB: 0.08, // Blue penetrates deepest in clear water
  },
  {
    name: 'murky',
    label: 'Murky',
    kR: 0.60,
    kG: 0.35,
    kB: 0.28,
  },
  {
    name: 'muddy',
    label: 'Muddy',
    kR: 1.10,
    kG: 0.70,
    kB: 0.60, // Minimal attenuation shifts toward green in turbid water
  },
];

// Light condition presets affecting rod/cone balance
export const LIGHT_CONDITIONS: LightCondition[] = [
  {
    name: 'bright',
    label: 'Bright Sun',
    rodBlend: 0.05, // Minimal rod contribution (photopic)
    saturation: 1.0, // Full color saturation
  },
  {
    name: 'overcast',
    label: 'Overcast',
    rodBlend: 0.32, // Mixed rod/cone (mesopic)
    saturation: 0.70,
  },
  {
    name: 'low-light',
    label: 'Low Light',
    rodBlend: 0.75, // Heavy rod dominance (scotopic)
    saturation: 0.32, // Heavily desaturated
  },
];

// Bass vision matrices based on Mitchem et al. cone sensitivity curves
// LWS peak ~614nm, RH2 peak ~535nm, Rod peak ~528nm
export const BASS_VISION_MATRICES: VisionMatrices = {
  // RGB to bass cone responses (approximated from spectral sensitivity)
  rgbToFish: [
    [0.85, 0.25], // Red channel -> [LWS, RH2]
    [0.65, 0.92], // Green channel -> [LWS, RH2]
    [0.15, 0.45], // Blue channel -> [LWS, RH2]
  ],
  
  // Bass cones back to RGB (calibrated for dichromatic reconstruction)
  fishToRgb: [
    [0.75, 0.15, 0.05], // LWS -> [R, G, B]
    [0.25, 0.85, 0.45], // RH2 -> [R, G, B]
  ],
  
  // Rod response weights (peak ~528nm, close to green)
  rodWeights: [0.15, 0.75, 0.35], // [R, G, B] contributions to rod signal
};

// Salinity-dependent attenuation modifiers
// Based on research showing salinity affects refractive index and optical properties
export const SALINITY_MODIFIERS = {
  // Salinity factor for attenuation coefficients (0-40 ppt)
  // Higher salinity slightly increases light attenuation due to dissolved ions
  kR: 1.0 + 0.008, // Red: +0.8% per 10 ppt salinity
  kG: 1.0 + 0.005, // Green: +0.5% per 10 ppt salinity  
  kB: 1.0 + 0.003, // Blue: +0.3% per 10 ppt salinity
};

/**
 * Calculate salinity-adjusted attenuation coefficients
 * Based on empirical relationships from oceanic optics research
 */
export function calculateSalinityAdjustedK(
  baseK: { kR: number; kG: number; kB: number },
  salinity: number
): { kR: number; kG: number; kB: number } {
  const salinityFactor = salinity / 10; // Convert ppt to factor
  
  return {
    kR: baseK.kR * (1 + salinityFactor * 0.008),
    kG: baseK.kG * (1 + salinityFactor * 0.005),
    kB: baseK.kB * (1 + salinityFactor * 0.003),
  };
}

// Default simulation parameters
export const DEFAULT_PARAMS = {
  speciesId: 'largemouth-bass', // Default to largemouth bass
  depth: 10, // feet
  waterProperties: {
    clarity: WATER_CLARITY_PRESETS[0], // clear
    salinity: 0, // freshwater (ppt)
  } as WaterProperties,
  lightCondition: LIGHT_CONDITIONS[0], // bright
  backscatter: false,
};

// Performance constants
export const MAX_IMAGE_WIDTH = 2048; // Downscale large images
export const TARGET_FPS = 60;
export const MAX_PROCESSING_TIME = 50; // ms per frame