# AquaticVision

Advanced aquatic life vision simulation - from monochromatic to pentachromatic vision systems across marine and freshwater species.

## 🌊 Overview

AquaticVision is a Next.js application that simulates how various aquatic life perceive colors underwater using scientifically-based vision models. Unlike traditional color vision simulators, AquaticVision supports the full spectrum of aquatic vision types found in nature.

## 🐟 Supported Vision Types

- **Monochromatic** (1 cone type): Deep-sea species, hagfish
- **Dichromatic** (2 cone types): Bass, redfish, tarpon, walleye  
- **Trichromatic** (3 cone types): Goldfish, some cichlids
- **Tetrachromatic** (4 cone types): Trout, zebrafish, reef fish
- **Pentachromatic** (5 cone types): Advanced reef fish species

## 🔬 Scientific Foundation

Each species is implemented with research-backed cone sensitivity data:
- **Underwater light attenuation** modeled with Beer-Lambert law
- **Species-specific cone sensitivities** from published research
- **Environmental parameters** including salinity, depth, turbidity
- **Rod/cone transitions** for different lighting conditions

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Rendering**: WebGL shaders for GPU acceleration
- **Styling**: Tailwind CSS v4

### Key Components

- **AquaticVisionProcessor**: Core vision simulation engine
- **Species Database**: Configurable vision matrices for different species
- **WebGL Pipeline**: High-performance GPU processing
- **Export System**: PNG and comparison collage generation

## 🌊 Development Roadmap

**Phase 1**: Repository setup and core migration ✅  
**Phase 2**: Vision system architecture (Days 2-3)  
**Phase 3**: Species database expansion (Days 4-6)  
**Phase 4**: Environmental systems (Days 7-8)  
**Phase 5**: Advanced features (Days 9-10)

## 📊 Performance

- Target: <50ms/frame processing
- GPU acceleration with WebGL shaders
- Real-time parameter adjustment
- 60+ FPS on modern hardware

## 🧬 Based on BassVision

AquaticVision is built on the proven architecture of BassVision, extending from single-species bass vision to comprehensive aquatic life simulation.

---

*Generated with scientific research backing from marine biology and vision science literature*