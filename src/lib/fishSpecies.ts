/**
 * Aquatic species database with vision characteristics for LureVision
 * Supports monochromatic through pentachromatic vision systems
 */

import { VisionType } from '@/types';

export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  environment: 'freshwater' | 'saltwater' | 'anadromous' | 'deep-sea';
  visionType: VisionType;
  coneTypes: {
    shortWave?: number; // UV/violet cone peak (nm)
    mediumWave?: number; // Blue/green cone peak (nm) 
    longWave?: number; // Green/red cone peak (nm)
    ultraLongWave?: number; // Red cone peak (nm)
  };
  specialFeatures: string[];
  description: string;
  salinity?: {
    min: number;
    max: number;
    typical: number;
  };
}

export const FISH_SPECIES: FishSpecies[] = [
  // =======================
  // MONOCHROMATIC SPECIES (1 cone)
  // =======================
  {
    id: 'deep-sea-lanternfish',
    name: 'Deep-sea Lanternfish',
    scientificName: 'Myctophidae family',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 485, // Single cone optimized for deep-water blue light
    },
    specialFeatures: [
      'Optimized for low-light detection',
      'Bioluminescence communication',
      'Enhanced light sensitivity',
      'Minimal color discrimination'
    ],
    description: 'Deep-sea specialists with single-cone vision optimized for detecting available light in the deep ocean. Vision focused on brightness and contrast rather than color.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'pacific-hagfish',
    name: 'Pacific Hagfish',
    scientificName: 'Eptatretus stoutii',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 500, // Single cone for basic light detection
    },
    specialFeatures: [
      'Primitive visual system',
      'Relies heavily on touch and smell',
      'Basic light detection only',
      'Evolutionary ancient vision'
    ],
    description: 'Ancient marine species with the most primitive vision system, using single-cone light detection primarily for day/night cycles.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // DICHROMATIC SPECIES (2 cones) - Existing species
  // =======================
  {
    id: 'largemouth-bass',
    name: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 535, // Green-sensitive
      longWave: 614,   // Red-sensitive
    },
    specialFeatures: [
      'Red-green colorblind like humans',
      'Enhanced motion detection',
      'Excellent contrast sensitivity'
    ],
    description: 'The baseline species for our vision model. Bass have dichromatic vision similar to red-green colorblind humans, with peak sensitivities around 535nm and 614nm.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'rainbow-trout',
    name: 'Rainbow Trout',
    scientificName: 'Oncorhynchus mykiss',
    environment: 'anadromous',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 355,    // UV cone
      mediumWave: 532,   // Green cone
      longWave: 625,     // Red cone
      ultraLongWave: 505 // Blue cone
    },
    specialFeatures: [
      'UV vision capability',
      'Tetrachromatic color vision',
      'Polarized light detection',
      'Enhanced prey detection'
    ],
    description: 'Highly advanced vision with UV sensitivity. Can see ultraviolet patterns on prey and distinguish subtle color variations invisible to humans.',
    salinity: {
      min: 0,
      max: 35,
      typical: 0
    }
  },
  {
    id: 'walleye',
    name: 'Walleye',
    scientificName: 'Sander vitreus',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 530,
      longWave: 600
    },
    specialFeatures: [
      'Tapetum lucidum (reflective eye layer)',
      'Enhanced low-light vision',
      'Superior night hunting ability',
      'Light-gathering eye structure'
    ],
    description: 'Exceptional low-light vision thanks to a tapetum lucidum that reflects light back through the retina. Peak activity during dawn/dusk conditions.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },

  // Saltwater Species
  {
    id: 'redfish',
    name: 'Red Drum (Redfish)',
    scientificName: 'Sciaenops ocellatus',
    environment: 'saltwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 540,
      longWave: 620
    },
    specialFeatures: [
      'Saltwater-adapted dichromatic vision',
      'Enhanced red spectrum sensitivity',
      'Turbid water specialization'
    ],
    description: 'Coastal saltwater predator with vision adapted to turbid inshore waters. Strong red sensitivity helps detect prey against muddy bottoms.',
    salinity: {
      min: 15,
      max: 35,
      typical: 25
    }
  },
  {
    id: 'tarpon',
    name: 'Atlantic Tarpon',
    scientificName: 'Megalops atlanticus',
    environment: 'saltwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 545,
      longWave: 610
    },
    specialFeatures: [
      'Large eyes for enhanced light gathering',
      'Excellent low-light performance',
      'Superior motion detection',
      'Adapted for deep water hunting'
    ],
    description: 'Massive eyes provide excellent vision in both shallow flats and deep water. Exceptional at detecting movement and silhouettes.',
    salinity: {
      min: 20,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // TRICHROMATIC SPECIES (3 cones)
  // =======================
  {
    id: 'goldfish',
    name: 'Goldfish',
    scientificName: 'Carassius auratus',
    environment: 'freshwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 450,    // Blue cone
      mediumWave: 540,   // Green cone
      longWave: 625,     // Red cone
    },
    specialFeatures: [
      'Human-like color vision',
      'Excellent color discrimination',
      'Can distinguish fine color differences',
      'Visual learning capabilities'
    ],
    description: 'Popular aquarium species with human-like trichromatic vision. Excellent color discrimination makes them ideal subjects for color vision research.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'cichlid-haplochromis',
    name: 'Burton\'s Mouthbrooder',
    scientificName: 'Haplochromis burtoni',
    environment: 'freshwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 455,
      mediumWave: 535,
      longWave: 620,
    },
    specialFeatures: [
      'Advanced behavioral vision',
      'Social color recognition',
      'Territorial color displays',
      'Male-female color differentiation'
    ],
    description: 'African cichlid with sophisticated trichromatic vision used for social interactions, territory recognition, and mate selection.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },

  // =======================
  // PENTACHROMATIC SPECIES (5 cones)
  // =======================
  {
    id: 'reef-damselfish',
    name: 'Reef Damselfish',
    scientificName: 'Pomacentridae family',
    environment: 'saltwater',
    visionType: 'pentachromatic',
    coneTypes: {
      shortWave: 350,      // UV cone
      mediumWave: 400,     // Violet cone
      longWave: 470,       // Blue cone
      ultraLongWave: 540,  // Green cone
    },
    specialFeatures: [
      'Most complex aquatic color vision',
      'UV pattern recognition',
      'Reef navigation expertise',
      'Advanced predator detection',
      'Species recognition via UV patterns'
    ],
    description: 'Reef specialists with the most complex color vision in aquatic environments. Can see UV patterns invisible to most predators and prey.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'mantis-shrimp-family',
    name: 'Mantis Shrimp (simplified)',
    scientificName: 'Stomatopoda order',
    environment: 'saltwater',
    visionType: 'pentachromatic',
    coneTypes: {
      shortWave: 335,      // Deep UV
      mediumWave: 380,     // UV-violet
      longWave: 450,       // Blue
      ultraLongWave: 520,  // Green
    },
    specialFeatures: [
      'Most complex known color vision',
      'Polarized light detection',
      'Circular polarization vision',
      'UV communication patterns',
      'Advanced motion detection'
    ],
    description: 'Legendary for having the most complex color vision system known. This simplified 5-cone model represents their basic color detection (actual mantis shrimp have 12-16 different photoreceptor types).',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  }
];

// Split species groups into separate functions to avoid potential initialization issues
export function getFreshwaterSpecies() {
  return FISH_SPECIES.filter(species => species.environment === 'freshwater');
}

export function getSaltwaterSpecies() {
  return FISH_SPECIES.filter(species => species.environment === 'saltwater');
}

export function getAnadromousSpecies() {
  return FISH_SPECIES.filter(species => species.environment === 'anadromous');
}

export function getDeepSeaSpecies() {
  return FISH_SPECIES.filter(species => species.environment === 'deep-sea');
}

export function getSpeciesByVisionType(visionType: VisionType) {
  return FISH_SPECIES.filter(species => species.visionType === visionType);
}

export function getSpeciesById(id: string): FishSpecies | undefined {
  return FISH_SPECIES.find(species => species.id === id);
}

export function getDefaultSalinityForSpecies(speciesId: string): number {
  const species = getSpeciesById(speciesId);
  return species?.salinity?.typical || 0;
}

export function shouldShowSalinitySlider(speciesId: string): boolean {
  const species = getSpeciesById(speciesId);
  return species ? species.environment !== 'freshwater' : false;
}