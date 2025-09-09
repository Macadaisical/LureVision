import { JigPreset } from '@/types';

/**
 * Jig skirt color presets using real jig photographs
 */
export const JIG_PRESETS: JigPreset[] = [
  {
    id: 'brown-flake',
    name: 'Brown Flake',
    thumbnail: '/jigs/JigSkirt_BrownFlake.jpg',
    fullImage: '/jigs/JigSkirt_BrownFlake.jpg',
    description: 'Dark brown with glitter - natural crawfish/bottom pattern'
  },
  {
    id: 'dark-green',
    name: 'Dark Green',
    thumbnail: '/jigs/JigSkirt_DarkGreen.jpg',
    fullImage: '/jigs/JigSkirt_DarkGreen.jpg',
    description: 'Solid dark green - vegetation mimicry color'
  },
  {
    id: 'pink-glitter',
    name: 'Pink Glitter',
    thumbnail: '/jigs/JigSkirt_Pink.jpg',
    fullImage: '/jigs/JigSkirt_Pink.jpg',
    description: 'Pink with glitter - high visibility for stained water'
  },
  {
    id: 'yellow-glitter',
    name: 'Yellow Glitter',
    thumbnail: '/jigs/JigSkirt_Yellow.jpg',
    fullImage: '/jigs/JigSkirt_Yellow.jpg',
    description: 'Bright yellow with glitter - chartreuse-like high contrast'
  }
];

/**
 * Get a jig preset by ID
 */
export function getJigPreset(id: string): JigPreset | undefined {
  return JIG_PRESETS.find(preset => preset.id === id);
}

/**
 * Create a placeholder jig image for testing
 * This generates a simple colored rectangle as SVG
 */
export function createPlaceholderJig(color: string, width = 500, height = 500): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)/8}" fill="#333" opacity="0.3"/>
      <text x="${width/2}" y="${height/2+5}" text-anchor="middle" fill="#fff" font-family="Arial" font-size="${Math.min(width, height)/20}" opacity="0.7">JIG</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}