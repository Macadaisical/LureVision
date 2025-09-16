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
  {
    id: 'deep-sea-anglerfish',
    name: 'Deep-sea Anglerfish',
    scientificName: 'Melanocetus johnsonii',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 490, // Single cone optimized for bioluminescence detection
    },
    specialFeatures: [
      'Bioluminescent lure',
      'Enhanced light sensitivity',
      'Pressure adaptation',
      'Mate-finding via bioluminescence'
    ],
    description: 'Deep-sea predator with monochromatic vision highly specialized for detecting bioluminescent signals in the complete darkness of the deep ocean.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // DICHROMATIC SPECIES CONTINUED (2 cones)
  // =======================
  {
    id: 'northern-pike',
    name: 'Northern Pike',
    scientificName: 'Esox lucius',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 530,
      longWave: 605
    },
    specialFeatures: [
      'Ambush predator vision',
      'Motion-sensitive detection',
      'Enhanced contrast sensitivity',
      'Lateral line integration'
    ],
    description: 'Apex freshwater predator with dichromatic vision optimized for detecting movement and silhouettes in vegetation-rich environments.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'striped-bass',
    name: 'Striped Bass',
    scientificName: 'Morone saxatilis',
    environment: 'anadromous',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 538,
      longWave: 612
    },
    specialFeatures: [
      'Anadromous vision adaptation',
      'Schooling fish detection',
      'Variable salinity tolerance',
      'Turbid water specialization'
    ],
    description: 'Highly sought game fish with dichromatic vision adapted for both freshwater rivers and saltwater coastal environments.',
    salinity: {
      min: 0,
      max: 35,
      typical: 15
    }
  },
  {
    id: 'bluegill',
    name: 'Bluegill',
    scientificName: 'Lepomis macrochirus',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 533,
      longWave: 618
    },
    specialFeatures: [
      'Nest-guarding behavior',
      'Small prey detection',
      'Social schooling vision',
      'Shallow water adaptation'
    ],
    description: 'Popular panfish with dichromatic vision well-suited for detecting small invertebrates and defending territory in shallow waters.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'snook',
    name: 'Common Snook',
    scientificName: 'Centropomus undecimalis',
    environment: 'saltwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 542,
      longWave: 615
    },
    specialFeatures: [
      'Ambush predator in structure',
      'Mangrove environment specialist',
      'Low-light hunting capability',
      'Brackish water adaptation'
    ],
    description: 'Prized inshore game fish with dichromatic vision adapted for hunting in complex mangrove and structural environments.',
    salinity: {
      min: 5,
      max: 35,
      typical: 20
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
  {
    id: 'parrotfish',
    name: 'Stoplight Parrotfish',
    scientificName: 'Sparisoma viride',
    environment: 'saltwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 460,
      mediumWave: 535,
      longWave: 615,
    },
    specialFeatures: [
      'Coral reef navigation',
      'Algae detection on coral',
      'Territorial color recognition',
      'Phase-change color adaptation'
    ],
    description: 'Reef herbivore with trichromatic vision specialized for identifying edible algae and navigating complex coral environments.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // TETRACHROMATIC SPECIES (4 cones)
  // =======================
  {
    id: 'zebrafish',
    name: 'Zebrafish',
    scientificName: 'Danio rerio',
    environment: 'freshwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 360,    // UV cone
      mediumWave: 415,   // Violet cone
      longWave: 480,     // Blue cone
      ultraLongWave: 570 // Green-yellow cone
    },
    specialFeatures: [
      'UV vision for predator detection',
      'Schooling coordination',
      'Research model organism',
      'Enhanced spatial resolution'
    ],
    description: 'Important research species with advanced tetrachromatic vision including UV detection, used extensively in vision and behavior studies.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'atlantic-salmon',
    name: 'Atlantic Salmon',
    scientificName: 'Salmo salar',
    environment: 'anadromous',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 350,    // UV cone
      mediumWave: 430,   // Blue cone
      longWave: 535,     // Green cone
      ultraLongWave: 625 // Red cone
    },
    specialFeatures: [
      'UV polarization detection',
      'Navigation by celestial cues',
      'Prey detection in open ocean',
      'Life-stage vision adaptation'
    ],
    description: 'Iconic anadromous species with sophisticated tetrachromatic vision that changes throughout their complex life cycle.',
    salinity: {
      min: 0,
      max: 35,
      typical: 0
    }
  },
  {
    id: 'bluefin-tuna',
    name: 'Atlantic Bluefin Tuna',
    scientificName: 'Thunnus thynnus',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 355,    // UV cone
      mediumWave: 445,   // Blue cone
      longWave: 530,     // Green cone
      ultraLongWave: 620 // Red cone
    },
    specialFeatures: [
      'High-speed predation vision',
      'Pelagic environment adaptation',
      'Large eye design for light gathering',
      'Long-distance migration navigation'
    ],
    description: 'Apex pelagic predator with tetrachromatic vision optimized for detecting prey in the open ocean environment.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
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
  },

  // =======================
  // PHASE 3 EXPANSION: DEEP-SEA SPECIALISTS (5 species)
  // =======================
  {
    id: 'vampire-squid',
    name: 'Vampire Squid',
    scientificName: 'Vampyroteutbis infernalis',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 480, // Rod-dominated system
    },
    specialFeatures: [
      'Largest eyes relative to body size',
      'Bioluminescence detection specialist',
      'Oxygen minimum zone adaptation',
      'Photophore coordination'
    ],
    description: 'Lives in oceanic oxygen minimum zones with enormous eyes optimized for detecting the faintest bioluminescent signals in complete darkness.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'barreleye-fish',
    name: 'Barreleye Fish',
    scientificName: 'Macropinna microstoma',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 480, // Pure rod vision
    },
    specialFeatures: [
      'Transparent head structure',
      'Rotating tubular eyes',
      'Green filtering lenses',
      'Upward-facing vision'
    ],
    description: 'Remarkable deep-sea fish with tubular eyes that rotate upward to spot prey silhouettes against faint surface light filtering down.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'silver-spinyfin',
    name: 'Silver Spinyfin',
    scientificName: 'Diretmus argenteus',
    environment: 'deep-sea',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 430,   // Modified rhodopsin
      mediumWave: 480,  // Standard rhodopsin
      longWave: 520,    // Long-wavelength rhodopsin
    },
    specialFeatures: [
      'Multiple rhodopsin variants',
      'Bioluminescence spectrum detection',
      'Vertical migration adaptation',
      'Enhanced blue-green sensitivity'
    ],
    description: 'Evolved multiple rhodopsin-based photoreceptors to detect different wavelengths of bioluminescent communication signals in the deep ocean.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'gulper-eel',
    name: 'Gulper Eel',
    scientificName: 'Eurypharynx pelecanoides',
    environment: 'deep-sea',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 470, // Vestigial rod system
    },
    specialFeatures: [
      'Extremely reduced eyes',
      'Primarily chemosensory hunting',
      'Massive expandable mouth',
      'Minimal light detection only'
    ],
    description: 'Abyssal predator with vestigial vision that relies almost entirely on chemical and mechanical senses to locate prey in complete darkness.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'migrating-lanternfish',
    name: 'Spotted Lanternfish',
    scientificName: 'Myctophum punctatum',
    environment: 'deep-sea',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 480,  // Rod system
      longWave: 510,    // Single cone type
    },
    specialFeatures: [
      'Diel vertical migration',
      'Photophore patterns',
      'Counter-illumination camouflage',
      'Species-specific light signals'
    ],
    description: 'Performs massive daily migrations from deep water to surface, using bioluminescent photophores for communication and camouflage.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // TROPICAL REEF SPECIALISTS (4 species)
  // =======================
  {
    id: 'foureye-butterflyfish',
    name: 'Foureye Butterflyfish',
    scientificName: 'Chaetodon capistratus',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 360,   // UV cone
      mediumWave: 420,  // Blue cone
      longWave: 480,    // Green cone
      ultraLongWave: 560 // Red cone
    },
    specialFeatures: [
      'UV coral polyp detection',
      'False eyespot patterns',
      'Territorial behavior recognition',
      'Monogamous pair bonding'
    ],
    description: 'Reef specialist with UV vision for detecting coral polyps and complex pattern recognition for social behaviors and predator deterrence.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'queen-angelfish',
    name: 'Queen Angelfish',
    scientificName: 'Holacanthus ciliaris',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 370,   // UV cone
      mediumWave: 430,  // Blue cone
      longWave: 490,    // Green cone
      ultraLongWave: 570 // Red cone
    },
    specialFeatures: [
      'Excellent color discrimination',
      'Territorial aggression displays',
      'Sponge feeding specialization',
      'Complex reef navigation'
    ],
    description: 'Large reef angelfish with sophisticated color vision adapted for complex territorial behaviors and specialized sponge feeding.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'bluehead-wrasse',
    name: 'Bluehead Wrasse',
    scientificName: 'Thalassoma bifasciatum',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 365,   // UV cone
      mediumWave: 425,  // Blue cone
      longWave: 485,    // Green cone
      ultraLongWave: 565 // Red cone
    },
    specialFeatures: [
      'Sexual dimorphism detection',
      'Cleaning station behavior',
      'Sequential hermaphroditism',
      'Color phase transitions'
    ],
    description: 'Highly social reef fish with advanced color vision supporting complex behaviors including sex change and cooperative cleaning.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'regal-tang',
    name: 'Regal Tang',
    scientificName: 'Paracanthurus hepatus',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 375,   // UV cone
      mediumWave: 440,  // Blue cone
      longWave: 495,    // Green cone
      ultraLongWave: 575 // Red cone
    },
    specialFeatures: [
      'Schooling coordination',
      'Polarization sensitivity',
      'Predator detection enhancement',
      'Algae browsing specialization'
    ],
    description: 'Popular aquarium species with tetrachromatic vision adapted for maintaining large school cohesion and detecting predators on coral reefs.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // PREDATORY FISH SPECIALISTS (3 species)
  // =======================
  {
    id: 'great-barracuda',
    name: 'Great Barracuda',
    scientificName: 'Sphyraena barracuda',
    environment: 'saltwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 480,  // Blue-green cone
      longWave: 540,    // Yellow-green cone
    },
    specialFeatures: [
      'Motion detection optimization',
      'High-speed pursuit predation',
      'Long-distance target acquisition',
      'Reduced chromatic complexity'
    ],
    description: 'Apex predator with simplified color vision optimized for detecting movement and contrast rather than color discrimination.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'bull-shark',
    name: 'Bull Shark',
    scientificName: 'Carcharhinus leucas',
    environment: 'saltwater',
    visionType: 'monochromatic',
    coneTypes: {
      mediumWave: 530,  // Single cone type
    },
    specialFeatures: [
      'Excellent low-light vision',
      'Enhanced motion sensitivity',
      'Turbid water adaptation',
      'Freshwater tolerance'
    ],
    description: 'Aggressive shark species that sacrificed color vision for enhanced contrast sensitivity, allowing effective hunting in murky water.',
    salinity: {
      min: 0,
      max: 35,
      typical: 25
    }
  },
  {
    id: 'mahi-mahi',
    name: 'Mahi-mahi',
    scientificName: 'Coryphaena hippurus',
    environment: 'saltwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 460,  // Blue cone
      longWave: 520,    // Green-yellow cone
    },
    specialFeatures: [
      'Pelagic hunting optimization',
      'Fast motion tracking',
      'Open ocean adaptation',
      'High-speed pursuit'
    ],
    description: 'Fast-growing pelagic predator with dichromatic vision optimized for tracking fast-moving prey in the open ocean environment.',
    salinity: {
      min: 35,
      max: 35,
      typical: 35
    }
  },

  // =======================
  // FRESHWATER EXPANSION (4 species)
  // =======================
  {
    id: 'european-perch',
    name: 'European Perch',
    scientificName: 'Perca fluviatilis',
    environment: 'freshwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 450,   // Blue cone (juvenile UV cone lost)
      mediumWave: 530,  // Green cone
      longWave: 660,    // Red cone
    },
    specialFeatures: [
      'Ontogenetic vision changes',
      'UV sensitivity loss with age',
      'Schooling behavior coordination',
      'Predator-prey role transition'
    ],
    description: 'Loses UV sensitivity during maturation as feeding strategy shifts from plankton to larger prey, demonstrating vision adaptation to ecological role.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'common-carp',
    name: 'Common Carp',
    scientificName: 'Cyprinus carpio',
    environment: 'freshwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 360,   // UV cone
      mediumWave: 415,  // Blue cone
      longWave: 530,    // Green cone
      ultraLongWave: 605 // Red cone
    },
    specialFeatures: [
      'UV plankton detection',
      'Omnivorous feeding vision',
      'Excellent color discrimination',
      'Bottom feeding specialization'
    ],
    description: 'Maintains comprehensive tetrachromatic vision throughout life to support versatile omnivorous feeding strategy in varied freshwater habitats.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'channel-catfish',
    name: 'Channel Catfish',
    scientificName: 'Ictalurus punctatus',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 480,  // Blue-green cone
      longWave: 560,    // Yellow-red cone
    },
    specialFeatures: [
      'Reduced vision dependency',
      'Enhanced chemosensory abilities',
      'Bottom-dwelling adaptation',
      'Barbel integration with vision'
    ],
    description: 'Nocturnal bottom-dweller with limited color vision that relies heavily on chemical and tactile senses for navigation and feeding.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'northern-pike-enhanced',
    name: 'Northern Pike (Enhanced Model)',
    scientificName: 'Esox lucius',
    environment: 'freshwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 440,   // Blue cone
      mediumWave: 533,  // Green cone
      longWave: 625,    // Red cone
    },
    specialFeatures: [
      'Enhanced motion detection',
      'Ambush predator vision',
      'Vegetation camouflage detection',
      'Lateral line integration'
    ],
    description: 'Updated model showing full trichromatic vision in pike, with enhanced motion detection capabilities for ambush predation among vegetation.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },

  // =======================
  // UNUSUAL VISION SYSTEMS (4 species)
  // =======================
  {
    id: 'winter-flounder',
    name: 'Winter Flounder',
    scientificName: 'Pseudopleuronectes americanus',
    environment: 'saltwater',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 450,   // Blue cone
      mediumWave: 530,  // Green cone
      longWave: 580,    // Red cone
    },
    specialFeatures: [
      'Eye migration during development',
      'Asymmetric body pigmentation',
      'Benthic lifestyle adaptation',
      'Bilateral visual symmetry'
    ],
    description: 'Remarkable flatfish that undergoes eye migration during metamorphosis while maintaining symmetric vision capabilities in both eyes.',
    salinity: {
      min: 30,
      max: 35,
      typical: 35
    }
  },
  {
    id: 'elephant-nose-fish',
    name: 'Elephant-nose Fish',
    scientificName: 'Gnathonemus petersii',
    environment: 'freshwater',
    visionType: 'dichromatic',
    coneTypes: {
      mediumWave: 480,  // Blue-green cone
      longWave: 620,    // Red-enhanced cone
    },
    specialFeatures: [
      'Reflective retinal cups',
      'Rod-cone bundles',
      'Electroreception integration',
      'Nocturnal vision enhancement'
    ],
    description: 'Unique "grouped retina" with mirror-like reflective cups that enhance light gathering, combined with sophisticated electroreception.',
    salinity: {
      min: 0,
      max: 0,
      typical: 0
    }
  },
  {
    id: 'starry-flounder',
    name: 'Starry Flounder',
    scientificName: 'Platichthys stellatus',
    environment: 'anadromous',
    visionType: 'trichromatic',
    coneTypes: {
      shortWave: 420,   // UV-blue cone
      mediumWave: 510,  // Green cone
      longWave: 590,    // Red cone
    },
    specialFeatures: [
      'Variable eye sidedness',
      'Freshwater-saltwater adaptation',
      'Modified spectral sensitivity',
      'Estuarine specialization'
    ],
    description: 'Anadromous flatfish with vision adapted for both marine and freshwater phases, showing flexibility in eye arrangement.',
    salinity: {
      min: 0,
      max: 35,
      typical: 15
    }
  },
  {
    id: 'four-eyed-fish',
    name: 'Four-eyed Fish',
    scientificName: 'Anableps anableps',
    environment: 'saltwater',
    visionType: 'tetrachromatic',
    coneTypes: {
      shortWave: 365,   // UV cone
      mediumWave: 435,  // Blue cone
      longWave: 500,    // Green cone
      ultraLongWave: 570 // Red cone
    },
    specialFeatures: [
      'Split eyes for air/water vision',
      'Dual optical adaptation',
      'Surface-dwelling specialization',
      'Simultaneous aerial/aquatic vision'
    ],
    description: 'Remarkable surface-dweller with eyes divided into aerial and aquatic segments, allowing simultaneous vision above and below water.',
    salinity: {
      min: 15,
      max: 35,
      typical: 25
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

// =======================
// ENHANCED FILTERING SYSTEM
// =======================

/**
 * Get all game fish species (popular fishing targets)
 */
export function getGameFishSpecies() {
  const gameFish = [
    'largemouth-bass', 'northern-pike', 'striped-bass', 'bluegill',
    'rainbow-trout', 'atlantic-salmon', 'walleye', 'redfish', 'tarpon', 
    'snook', 'bluefin-tuna'
  ];
  return FISH_SPECIES.filter(species => gameFish.includes(species.id));
}

/**
 * Get species by special visual capabilities
 */
export function getSpeciesByCapability(capability: 'uv-vision' | 'low-light' | 'bioluminescence' | 'enhanced-sensitivity') {
  return FISH_SPECIES.filter(species => {
    switch (capability) {
      case 'uv-vision':
        return species.visionType === 'tetrachromatic' || species.visionType === 'pentachromatic';
      case 'low-light':
        return species.specialFeatures.some(feature => 
          feature.includes('low-light') || feature.includes('tapetum lucidum') || 
          feature.includes('Enhanced light sensitivity'));
      case 'bioluminescence':
        return species.specialFeatures.some(feature => 
          feature.includes('biolumines') || feature.includes('Bioluminescent'));
      case 'enhanced-sensitivity':
        return species.specialFeatures.some(feature => 
          feature.includes('Enhanced') || feature.includes('enhanced'));
      default:
        return false;
    }
  });
}

/**
 * Get species recommendations based on water conditions
 */
export function getRecommendedSpecies(waterType: 'clear' | 'murky' | 'deep', environment: 'freshwater' | 'saltwater' | 'any' = 'any') {
  const candidates = environment === 'any' ? FISH_SPECIES : FISH_SPECIES.filter(s => 
    s.environment === environment || s.environment === 'anadromous');

  switch (waterType) {
    case 'clear':
      // Species that benefit from good visibility and color discrimination
      return candidates.filter(s => 
        s.visionType === 'trichromatic' || s.visionType === 'tetrachromatic' || s.visionType === 'pentachromatic');
    case 'murky':
      // Species adapted for low visibility conditions
      return candidates.filter(s => 
        s.specialFeatures.some(f => f.includes('low-light') || f.includes('enhanced') || f.includes('Turbid')));
    case 'deep':
      // Deep-sea specialists
      return candidates.filter(s => s.environment === 'deep-sea');
    default:
      return candidates;
  }
}

/**
 * Get species statistics for the current database
 */
export function getSpeciesStats() {
  const visionTypes = {
    monochromatic: getSpeciesByVisionType('monochromatic').length,
    dichromatic: getSpeciesByVisionType('dichromatic').length,
    trichromatic: getSpeciesByVisionType('trichromatic').length,
    tetrachromatic: getSpeciesByVisionType('tetrachromatic').length,
    pentachromatic: getSpeciesByVisionType('pentachromatic').length,
  };

  const environments = {
    freshwater: getFreshwaterSpecies().length,
    saltwater: getSaltwaterSpecies().length,
    anadromous: getAnadromousSpecies().length,
    deepSea: getDeepSeaSpecies().length,
  };

  return {
    total: FISH_SPECIES.length,
    visionTypes,
    environments,
    hasUVCapable: getSpeciesByCapability('uv-vision').length,
    hasLowLight: getSpeciesByCapability('low-light').length,
    hasBioluminescence: getSpeciesByCapability('bioluminescence').length,
  };
}

// =======================
// PHASE 3 ENHANCED GROUPING AND FILTERING SYSTEM
// =======================

/**
 * Advanced species filtering by multiple criteria
 */
export interface SpeciesFilter {
  environment?: ('freshwater' | 'saltwater' | 'anadromous' | 'deep-sea')[];
  visionType?: VisionType[];
  capabilities?: string[];
  depthRange?: { min: number; max: number };
  salinity?: { min: number; max: number };
  searchTerm?: string;
}

/**
 * Filter species by multiple advanced criteria
 */
export function getFilteredSpecies(filter: SpeciesFilter): FishSpecies[] {
  return FISH_SPECIES.filter(species => {
    // Environment filter
    if (filter.environment && !filter.environment.includes(species.environment)) {
      return false;
    }

    // Vision type filter
    if (filter.visionType && !filter.visionType.includes(species.visionType)) {
      return false;
    }

    // Capabilities filter
    if (filter.capabilities && filter.capabilities.length > 0) {
      const hasAllCapabilities = filter.capabilities.every(capability =>
        species.specialFeatures.some(feature =>
          feature.toLowerCase().includes(capability.toLowerCase())
        )
      );
      if (!hasAllCapabilities) return false;
    }

    // Salinity range filter
    if (filter.salinity && species.salinity) {
      const speciesSalinity = species.salinity.typical;
      if (speciesSalinity < filter.salinity.min || speciesSalinity > filter.salinity.max) {
        return false;
      }
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch =
        species.name.toLowerCase().includes(searchLower) ||
        species.scientificName.toLowerCase().includes(searchLower) ||
        species.description.toLowerCase().includes(searchLower) ||
        species.specialFeatures.some(feature => feature.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    return true;
  });
}

/**
 * Get species grouped by ecological categories
 */
export function getSpeciesByEcology() {
  return {
    predators: FISH_SPECIES.filter(s =>
      s.specialFeatures.some(f =>
        f.includes('predator') || f.includes('Predator') ||
        f.includes('hunting') || f.includes('pursuit')
      )
    ),
    reefSpecialists: FISH_SPECIES.filter(s =>
      s.environment === 'saltwater' &&
      s.specialFeatures.some(f =>
        f.includes('reef') || f.includes('coral') || f.includes('territory')
      )
    ),
    deepSeaAdapted: getDeepSeaSpecies(),
    schoolingFish: FISH_SPECIES.filter(s =>
      s.specialFeatures.some(f =>
        f.includes('school') || f.includes('School') || f.includes('coordination')
      )
    ),
    bottomDwellers: FISH_SPECIES.filter(s =>
      s.specialFeatures.some(f =>
        f.includes('bottom') || f.includes('benthic') || f.includes('Bottom')
      )
    ),
    migratory: getAnadromousSpecies().concat(
      FISH_SPECIES.filter(s =>
        s.specialFeatures.some(f => f.includes('migration') || f.includes('Migration'))
      )
    )
  };
}

/**
 * Get species grouped by vision complexity
 */
export function getSpeciesByVisionComplexity() {
  return {
    simpleVision: [
      ...getSpeciesByVisionType('monochromatic'),
      ...getSpeciesByVisionType('dichromatic')
    ],
    advancedVision: [
      ...getSpeciesByVisionType('trichromatic'),
      ...getSpeciesByVisionType('tetrachromatic'),
      ...getSpeciesByVisionType('pentachromatic')
    ],
    uvCapable: getSpeciesByCapability('uv-vision'),
    lowLightSpecialists: getSpeciesByCapability('low-light'),
    bioluminescentSpecies: getSpeciesByCapability('bioluminescence')
  };
}

/**
 * Get species recommendations for specific fishing or research scenarios
 */
export function getSpeciesForScenario(scenario: 'game-fishing' | 'reef-aquarium' | 'research' | 'deep-sea' | 'freshwater-pond'): FishSpecies[] {
  switch (scenario) {
    case 'game-fishing':
      return getGameFishSpecies();

    case 'reef-aquarium':
      return FISH_SPECIES.filter(s =>
        s.environment === 'saltwater' &&
        (s.visionType === 'tetrachromatic' || s.visionType === 'pentachromatic') &&
        s.specialFeatures.some(f => f.includes('reef') || f.includes('coral'))
      );

    case 'research':
      return FISH_SPECIES.filter(s =>
        s.description.includes('research') ||
        s.name.includes('Zebrafish') ||
        s.name.includes('Goldfish') ||
        s.visionType === 'tetrachromatic' ||
        s.visionType === 'pentachromatic'
      );

    case 'deep-sea':
      return getDeepSeaSpecies();

    case 'freshwater-pond':
      return getFreshwaterSpecies().filter(s =>
        !s.specialFeatures.some(f => f.includes('large') || f.includes('predator'))
      );

    default:
      return FISH_SPECIES;
  }
}

/**
 * Get similar species based on vision characteristics and environment
 */
export function getSimilarSpecies(targetSpeciesId: string, limit: number = 5): FishSpecies[] {
  const targetSpecies = getSpeciesById(targetSpeciesId);
  if (!targetSpecies) return [];

  return FISH_SPECIES
    .filter(s => s.id !== targetSpeciesId)
    .map(species => ({
      species,
      similarity: calculateSpeciesSimilarity(targetSpecies, species)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.species);
}

/**
 * Calculate similarity score between two species
 */
function calculateSpeciesSimilarity(species1: FishSpecies, species2: FishSpecies): number {
  let score = 0;

  // Vision type similarity (40% weight)
  if (species1.visionType === species2.visionType) {
    score += 0.4;
  } else {
    // Partial credit for similar vision complexity
    const visionComplexity = {
      'monochromatic': 1,
      'dichromatic': 2,
      'trichromatic': 3,
      'tetrachromatic': 4,
      'pentachromatic': 5
    };
    const diff = Math.abs(visionComplexity[species1.visionType] - visionComplexity[species2.visionType]);
    score += Math.max(0, 0.4 - (diff * 0.1));
  }

  // Environment similarity (30% weight)
  if (species1.environment === species2.environment) {
    score += 0.3;
  } else if (
    (species1.environment === 'anadromous' && (species2.environment === 'freshwater' || species2.environment === 'saltwater')) ||
    (species2.environment === 'anadromous' && (species1.environment === 'freshwater' || species1.environment === 'saltwater'))
  ) {
    score += 0.15; // Partial credit for anadromous species
  }

  // Special features similarity (30% weight)
  const commonFeatures = species1.specialFeatures.filter(feature1 =>
    species2.specialFeatures.some(feature2 =>
      feature1.toLowerCase().includes(feature2.toLowerCase()) ||
      feature2.toLowerCase().includes(feature1.toLowerCase())
    )
  );
  const maxFeatures = Math.max(species1.specialFeatures.length, species2.specialFeatures.length);
  if (maxFeatures > 0) {
    score += (commonFeatures.length / maxFeatures) * 0.3;
  }

  return score;
}