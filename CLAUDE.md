# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AquaticVision is a Next.js application that simulates how various aquatic life perceive colors underwater. It uses WebGL shaders to apply scientifically-based vision models that support:

- Multiple vision types: monochromatic, dichromatic, trichromatic, tetrachromatic, and pentachromatic
- Species-specific cone sensitivities based on published research
- Underwater light attenuation by wavelength (Beer-Lambert law)
- Environmental parameters (salinity, depth, turbidity)
- Rod/cone transitions in different lighting conditions

## Architecture

### Frontend (Next.js + React + TypeScript)
- `/src/app/` - Next.js app router pages

- `/src/components/` - React components
- `/src/lib/` - Utility functions and algorithms
- `/src/shaders/` - WebGL shader code
- `/src/types/` - TypeScript type definitions
- `/public/jigs/` - Jig skirt image assets

### Key Systems
1. **WebGL Pipeline**: Client-side image processing using custom shaders
2. **Aquatic Vision Engine**: Implements underwater attenuation and multi-species vision simulation
3. **Species Database**: Configurable vision matrices for different aquatic life
4. **UI Controls**: Parameter adjustment (species, depth, clarity, lighting, salinity)
5. **A/B Viewer**: Split-screen comparison of original vs species-specific vision

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npm run type-check
```

## Scientific Parameters

### Water Clarity Attenuation Constants (kR, kG, kB in m⁻¹)
- **Clear**: kR=0.30, kG=0.12, kB=0.08
- **Murky**: kR=0.60, kG=0.35, kB=0.28  
- **Muddy**: kR=1.10, kG=0.70, kB=0.60

### Light Conditions
- **Bright**: Rod blend 0-10%, saturation 100%
- **Overcast**: Rod blend 25-40%, saturation 65-75%
- **Low light**: Rod blend 60-85%, saturation 25-40%

## Core Algorithms

The bass vision simulation follows a 3-step pipeline:
1. **Underwater Attenuation**: Apply Beer-Lambert per-channel attenuation
2. **Bass Cone Conversion**: Map RGB to bass LWS/RH2 cone responses + rod
3. **Reconstruction**: Blend cone/rod signals and reconstruct displayable RGB

## Performance Requirements
- Target: <50ms/frame at 2048px on M1
- 60 FPS on modern laptops
- Uses OffscreenCanvas + Web Workers to prevent UI jank

## Testing

Visual validation should verify:
- Chartreuse ≈ white under bright conditions
- Green ≈ blue convergence in hue
- Red remains distinct from achromatic colors
- Red fades faster than green/blue with depth

## Project Status and Stored Memory

A memory storage system was created by Claude in order to bridge the gap between coding sessions.
Review the status at /Users/tjjaglinski/Library/CloudStorage/GoogleDrive-macadaisical@gmail.com/My Drive/-Claude/ClaudesMemoryFolder BEFORE STARTING THE CODING SESSION.

Project status below may not be current.

## Project Status as of August 22nd at 2:00 p.m.

BassVision Project Summary:
  - Project: Next.js bass vision simulator using WebGL shaders
  - Location: /Users/tjjaglinski/Library/CloudStorage/GoogleDrive-macadaisical@gmail.com/My Drive/PixelPusher/Chief/Thumpin/Website/-code/BassVision_V2/
  - Status: Fully functional streamlined interface completed
  - Key Features Implemented:
    - Removed jig presets for streamlined design
    - Side-by-side upload + current image layout
    - Auto-processing when image uploaded (no manual trigger needed)
    - All controls converted to sliders (Water Clarity, Depth, Sky/Light Conditions)
    - Compact no-scroll interface
  - Key Components: ImageUpload.tsx, ControlPanel.tsx, ImageViewer.tsx, page.tsx
  - Server: Running on localhost:3000 via npm run dev
  - GitHub: Private repo at https://github.com/Macadaisical/BassVision_V2
  - Issues Fixed: Grammarly hydration warnings, jig image loading, layout optimization