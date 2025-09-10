import { SimulationParams, VisionMatrices, WaterProperties, VisionType } from '@/types';
import { 
  BASS_VISION_MATRICES, 
  MONOCHROMATIC_VISION_MATRICES,
  TRICHROMATIC_VISION_MATRICES,
  TETRACHROMATIC_VISION_MATRICES,
  PENTACHROMATIC_VISION_MATRICES,
  calculateSalinityAdjustedK 
} from './constants';
import { getSpeciesById } from './fishSpecies';

/**
 * Core lure vision simulation algorithms
 * Implements the 3-step pipeline for multiple vision types
 * Supports mono-, di-, tri-, tetra-, and pentachromatic vision systems
 */

export class LureVisionProcessor {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private matrices: VisionMatrices;

  constructor() {
    this.matrices = BASS_VISION_MATRICES; // Default to bass matrices
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /**
   * Get species-specific vision matrices based on vision type
   */
  private getSpeciesVisionMatrices(speciesId: string): VisionMatrices {
    const species = getSpeciesById(speciesId);
    if (!species) {
      return BASS_VISION_MATRICES; // Fallback to bass
    }

    // Dynamic matrix selection based on species vision type
    switch (species.visionType) {
      case 'monochromatic':
        return MONOCHROMATIC_VISION_MATRICES;
      case 'dichromatic':
        return BASS_VISION_MATRICES; // Bass is our dichromatic baseline
      case 'trichromatic':
        return TRICHROMATIC_VISION_MATRICES;
      case 'tetrachromatic':
        return TETRACHROMATIC_VISION_MATRICES;
      case 'pentachromatic':
        return PENTACHROMATIC_VISION_MATRICES;
      default:
        return BASS_VISION_MATRICES; // Fallback
    }
  }

  /**
   * Get matrix dimensions for current vision type
   */
  private getMatrixDimensions(): { coneCount: number; visionType: VisionType } {
    return {
      coneCount: this.matrices.coneCount,
      visionType: this.matrices.visionType
    };
  }

  /**
   * Process an image through species-specific vision simulation
   */
  async processImage(
    imageData: ImageData,
    params: SimulationParams
  ): Promise<ImageData> {
    // Update matrices based on selected species
    this.matrices = this.getSpeciesVisionMatrices(params.speciesId);
    
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not available - processor must run in browser environment');
    }
    
    const startTime = performance.now();
    
    // Set canvas size to match image
    this.canvas.width = imageData.width;
    this.canvas.height = imageData.height;
    
    // Create output image data
    const outputData = new ImageData(imageData.width, imageData.height);
    
    // Process pixels
    for (let i = 0; i < imageData.data.length; i += 4) {
      const [r, g, b] = [
        imageData.data[i] / 255,
        imageData.data[i + 1] / 255,
        imageData.data[i + 2] / 255,
      ];
      
      // Convert sRGB to linear RGB
      const linearRgb = this.srgbToLinear([r, g, b]);
      
      // Apply underwater attenuation (step 1) with salinity adjustment
      const attenuatedRgb = this.applyUnderwaterAttenuation(
        linearRgb,
        params.depth,
        params.waterProperties
      );
      
      // Convert to species cone responses (step 2)
      const speciesCones = this.rgbToSpeciesResponse(attenuatedRgb);
      const rodResponse = this.calculateRodResponse(attenuatedRgb);
      
      // Reconstruct species-perceived image (step 3)
      const speciesRgb = this.reconstructSpeciesVision(
        speciesCones,
        rodResponse,
        params.lightCondition
      );
      
      // Apply backscatter if enabled
      const finalRgb = params.backscatter
        ? this.addBackscatter(speciesRgb, params.depth)
        : speciesRgb;
      
      // Convert back to sRGB and store
      const srgb = this.linearToSrgb(finalRgb);
      outputData.data[i] = Math.round(srgb[0] * 255);
      outputData.data[i + 1] = Math.round(srgb[1] * 255);
      outputData.data[i + 2] = Math.round(srgb[2] * 255);
      outputData.data[i + 3] = imageData.data[i + 3]; // Preserve alpha
    }
    
    const processingTime = performance.now() - startTime;
    console.log(`Aquatic vision processing took ${processingTime.toFixed(2)}ms`);
    
    return outputData;
  }

  /**
   * Step 1: Apply underwater attenuation using Beer-Lambert law with salinity adjustment
   * I_c*(z) = I_c * exp(-k_c * 2z)
   * The 2z factor accounts for double-pass (down + reflection back up)
   * Salinity affects attenuation coefficients based on dissolved ions
   */
  private applyUnderwaterAttenuation(
    rgb: number[],
    depthFeet: number,
    waterProperties: WaterProperties
  ): number[] {
    const depthMeters = depthFeet * 0.3048; // Convert feet to meters
    const doublePassDepth = 2 * depthMeters;
    
    // Calculate salinity-adjusted attenuation coefficients
    const adjustedK = calculateSalinityAdjustedK(
      waterProperties.clarity,
      waterProperties.salinity
    );
    
    return [
      rgb[0] * Math.exp(-adjustedK.kR * doublePassDepth), // Red
      rgb[1] * Math.exp(-adjustedK.kG * doublePassDepth), // Green
      rgb[2] * Math.exp(-adjustedK.kB * doublePassDepth), // Blue
    ];
  }

  /**
   * Step 2a: Convert RGB to species cone responses
   * Uses the 3x{coneCount} matrix to map RGB to species-specific cone catches
   * Supports 1-5 cone types dynamically
   */
  private rgbToSpeciesResponse(rgb: number[]): number[] {
    const [r, g, b] = rgb;
    const matrix = this.matrices.rgbToSpecies;
    const coneCount = this.matrices.coneCount;
    
    const coneResponses: number[] = [];
    
    // Calculate response for each cone type
    for (let coneIndex = 0; coneIndex < coneCount; coneIndex++) {
      const coneResponse = 
        matrix[0][coneIndex] * r + // Red contribution
        matrix[1][coneIndex] * g + // Green contribution  
        matrix[2][coneIndex] * b;  // Blue contribution
      
      coneResponses.push(coneResponse);
    }
    
    return coneResponses;
  }

  /**
   * Step 2b: Calculate rod response
   * Rod sensitivity varies by species, configurable via matrices
   */
  private calculateRodResponse(rgb: number[]): number {
    const weights = this.matrices.rodWeights;
    return weights[0] * rgb[0] + weights[1] * rgb[1] + weights[2] * rgb[2];
  }

  /**
   * Step 3: Reconstruct species-perceived image
   * Blends cone and rod responses based on lighting conditions
   * Supports 1-5 cone types dynamically
   */
  private reconstructSpeciesVision(
    speciesCones: number[],
    rodResponse: number,
    lightCondition: { rodBlend: number; saturation: number }
  ): number[] {
    // Convert species cones back to RGB space
    const matrix = this.matrices.speciesToRgb;
    const coneCount = this.matrices.coneCount;
    
    // Initialize RGB output
    const coneRgb = [0, 0, 0];
    
    // Sum contributions from all cone types
    for (let coneIndex = 0; coneIndex < coneCount; coneIndex++) {
      const coneResponse = speciesCones[coneIndex];
      coneRgb[0] += matrix[coneIndex][0] * coneResponse; // Red
      coneRgb[1] += matrix[coneIndex][1] * coneResponse; // Green
      coneRgb[2] += matrix[coneIndex][2] * coneResponse; // Blue
    }
    
    // Rod response as achromatic signal
    const rodRgb = [rodResponse, rodResponse, rodResponse];
    
    // Blend cone and rod responses
    const blendFactor = lightCondition.rodBlend;
    const mixedRgb = [
      coneRgb[0] * (1 - blendFactor) + rodRgb[0] * blendFactor,
      coneRgb[1] * (1 - blendFactor) + rodRgb[1] * blendFactor,
      coneRgb[2] * (1 - blendFactor) + rodRgb[2] * blendFactor,
    ];
    
    // Apply saturation adjustment
    return this.adjustSaturation(mixedRgb, lightCondition.saturation);
  }

  /**
   * Apply saturation adjustment (desaturate in low light)
   */
  private adjustSaturation(rgb: number[], saturation: number): number[] {
    const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    
    return [
      luminance + (rgb[0] - luminance) * saturation,
      luminance + (rgb[1] - luminance) * saturation,
      luminance + (rgb[2] - luminance) * saturation,
    ];
  }

  /**
   * Add backscatter/haze effect for murky water
   * Enhanced for deep-sea environments with bioluminescence
   */
  private addBackscatter(rgb: number[], depthFeet: number): number[] {
    const isDeepSea = depthFeet > 100; // Deep-sea threshold
    
    if (isDeepSea) {
      // Deep-sea environment: very dark with occasional bioluminescent spots
      return this.addBioluminescentEffects(rgb, depthFeet);
    } else {
      // Shallow water backscatter
      const hazeFactor = Math.min(depthFeet / 30, 1) * 0.15; // Max 15% haze at 30ft
      const hazeColor = [0.4, 0.5, 0.6]; // Bluish-gray haze
      
      return [
        rgb[0] * (1 - hazeFactor) + hazeColor[0] * hazeFactor,
        rgb[1] * (1 - hazeFactor) + hazeColor[1] * hazeFactor,
        rgb[2] * (1 - hazeFactor) + hazeColor[2] * hazeFactor,
      ];
    }
  }

  /**
   * Add bioluminescent effects for deep-sea species
   * Simulates the sparse, blue-green bioluminescent signals in deep ocean
   */
  private addBioluminescentEffects(rgb: number[], depthFeet: number): number[] {
    // Deep-sea is essentially black except for bioluminescence
    const ambientFactor = Math.max(0.01, Math.exp(-(depthFeet - 100) / 200)); // Exponential decay
    
    // Bioluminescent organisms emit primarily blue-green light (480-490nm)
    const bioLumBlue = 0.02 * Math.random(); // Sparse, random bioluminescent spots
    const bioLumGreen = 0.015 * Math.random();
    
    return [
      rgb[0] * ambientFactor, // Red is completely absorbed at depth
      rgb[1] * ambientFactor + bioLumGreen, // Green with bioluminescence
      rgb[2] * ambientFactor + bioLumBlue,  // Blue with bioluminescence
    ];
  }

  /**
   * Color space conversion utilities
   */
  private srgbToLinear(srgb: number[]): number[] {
    return srgb.map(c =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
  }

  private linearToSrgb(linear: number[]): number[] {
    return linear.map(c =>
      c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1/2.4) - 0.055
    ).map(c => Math.max(0, Math.min(1, c))); // Clamp to valid range
  }
}