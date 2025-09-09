/**
 * Fish species database with vision characteristics for GameFishVision
 */

export interface FishSpecies {
  id: string;
  name: string;
  scientificName: string;
  environment: 'freshwater' | 'saltwater' | 'anadromous';
  visionType: 'dichromatic' | 'trichromatic' | 'tetrachromatic';
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
  // Freshwater Species
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