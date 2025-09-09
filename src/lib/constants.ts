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
  visionType: 'dichromatic',
  coneCount: 2,
  coneLabels: ['LWS', 'RH2'],
  // RGB to bass cone responses (approximated from spectral sensitivity)
  rgbToSpecies: [
    [0.85, 0.25], // Red channel -> [LWS, RH2]
    [0.65, 0.92], // Green channel -> [LWS, RH2]
    [0.15, 0.45], // Blue channel -> [LWS, RH2]
  ],
  
  // Bass cones back to RGB (calibrated for dichromatic reconstruction)
  speciesToRgb: [
    [0.75, 0.15, 0.05], // LWS -> [R, G, B]
    [0.25, 0.85, 0.45], // RH2 -> [R, G, B]
  ],
  
  // Rod response weights (peak ~528nm, close to green)
  rodWeights: [0.15, 0.75, 0.35], // [R, G, B] contributions to rod signal
};

// =======================
// COMPLETE VISION MATRICES FOR ALL CONE TYPES
// =======================

// Monochromatic vision - Deep sea species (e.g., lanternfish, hagfish)
// Single cone peak ~480-500nm, optimized for available light detection
export const MONOCHROMATIC_VISION_MATRICES: VisionMatrices = {
  visionType: 'monochromatic',
  coneCount: 1,
  coneLabels: ['L-cone'],
  // RGB to single cone response (blue-green sensitive)
  rgbToSpecies: [
    [0.25], // Red channel -> L-cone
    [0.85], // Green channel -> L-cone
    [0.90], // Blue channel -> L-cone
  ],
  
  // Single cone back to RGB (achromatic reconstruction)
  speciesToRgb: [
    [0.33, 0.33, 0.33], // L-cone -> [R, G, B] (equal distribution)
  ],
  
  // Rod response weights (heavily weighted for low-light)
  rodWeights: [0.20, 0.60, 0.80], // Enhanced blue sensitivity for deep water
};

// Trichromatic vision - Goldfish and some cichlids
// Three cones: S-cone ~450nm, M-cone ~540nm, L-cone ~625nm (human-like)
export const TRICHROMATIC_VISION_MATRICES: VisionMatrices = {
  visionType: 'trichromatic',
  coneCount: 3,
  coneLabels: ['S-cone', 'M-cone', 'L-cone'],
  // RGB to three cone responses
  rgbToSpecies: [
    [0.75, 0.35, 0.95], // Red channel -> [S, M, L]
    [0.25, 0.90, 0.65], // Green channel -> [S, M, L]
    [0.95, 0.45, 0.15], // Blue channel -> [S, M, L]
  ],
  
  // Three cones back to RGB (human-like reconstruction)
  speciesToRgb: [
    [0.15, 0.05, 0.95], // S-cone -> [R, G, B]
    [0.25, 0.85, 0.45], // M-cone -> [R, G, B]
    [0.85, 0.25, 0.05], // L-cone -> [R, G, B]
  ],
  
  // Rod response weights (moderate sensitivity)
  rodWeights: [0.30, 0.65, 0.50], // Balanced rod response
};

// Tetrachromatic vision - Trout, zebrafish, reef fish
// Four cones: UV ~355nm, S-cone ~415nm, M-cone ~480nm, L-cone ~570nm
export const TETRACHROMATIC_VISION_MATRICES: VisionMatrices = {
  visionType: 'tetrachromatic',
  coneCount: 4,
  coneLabels: ['UV', 'S-cone', 'M-cone', 'L-cone'],
  // RGB to four cone responses (with UV extrapolation from blue)
  rgbToSpecies: [
    [0.65, 0.15, 0.25, 0.85], // Red channel -> [UV, S, M, L]
    [0.35, 0.45, 0.90, 0.75], // Green channel -> [UV, S, M, L]
    [0.85, 0.95, 0.65, 0.25], // Blue channel -> [UV, S, M, L]
  ],
  
  // Four cones back to RGB (enhanced reconstruction)
  speciesToRgb: [
    [0.05, 0.05, 0.75], // UV -> [R, G, B] (contributes to blue)
    [0.10, 0.15, 0.85], // S-cone -> [R, G, B]
    [0.25, 0.80, 0.45], // M-cone -> [R, G, B]
    [0.80, 0.35, 0.10], // L-cone -> [R, G, B]
  ],
  
  // Rod response weights (enhanced blue-UV for clear water)
  rodWeights: [0.20, 0.55, 0.75], // Enhanced short wavelength sensitivity
};

// Pentachromatic vision - Advanced reef fish and mantis shrimp family
// Five cones: UV ~350nm, Violet ~400nm, Blue ~470nm, Green ~540nm, Red ~620nm
export const PENTACHROMATIC_VISION_MATRICES: VisionMatrices = {
  visionType: 'pentachromatic',
  coneCount: 5,
  coneLabels: ['UV', 'Violet', 'Blue', 'Green', 'Red'],
  // RGB to five cone responses (most complex aquatic vision)
  rgbToSpecies: [
    [0.55, 0.25, 0.15, 0.35, 0.95], // Red channel -> [UV, V, B, G, R]
    [0.25, 0.35, 0.55, 0.90, 0.65], // Green channel -> [UV, V, B, G, R]
    [0.75, 0.85, 0.95, 0.45, 0.15], // Blue channel -> [UV, V, B, G, R]
  ],
  
  // Five cones back to RGB (maximum color discrimination)
  speciesToRgb: [
    [0.05, 0.05, 0.65], // UV -> [R, G, B]
    [0.15, 0.10, 0.85], // Violet -> [R, G, B]
    [0.10, 0.25, 0.90], // Blue -> [R, G, B]
    [0.20, 0.85, 0.35], // Green -> [R, G, B]
    [0.90, 0.25, 0.05], // Red -> [R, G, B]
  ],
  
  // Rod response weights (optimized for reef environments)
  rodWeights: [0.25, 0.50, 0.70], // Balanced with slight blue bias
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