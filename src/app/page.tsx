'use client';

import { useState, useCallback, useEffect } from 'react';
import { SimulationParams, LureVisionResult } from '@/types';
import { DEFAULT_PARAMS } from '@/lib/constants';
import { LureVisionProcessor } from '@/lib/aquaticVision';
import { ImageExporter } from '@/lib/export';
// import { JIG_PRESETS } from '@/lib/jigPresets'; // Removed presets for streamlined interface
import { ControlPanel } from '@/components/ControlPanel';
import { ImageViewer } from '@/components/ImageViewer';

export default function Home() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [result, setResult] = useState<LureVisionResult | null>(null);
  // const [selectedPreset, setSelectedPreset] = useState<string | null>(null); // Removed for streamlined interface
  const [isProcessing, setIsProcessing] = useState(false);
  const [processor, setProcessor] = useState<LureVisionProcessor | null>(null);
  
  // Initialize processor only on client side
  useEffect(() => {
    setProcessor(new LureVisionProcessor());
  }, []);

  // Auto-trigger simulation when parameters change (with debouncing)
  useEffect(() => {
    if (!currentImage || !processor || isProcessing) return;

    const timeoutId = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const startTime = performance.now();
        const lureVisionImage = await processor.processImage(currentImage, params);
        const processingTime = performance.now() - startTime;

        setResult({
          originalImage: currentImage,
          lureVisionImage,
          processingTime
        });
      } catch (error) {
        console.error('Auto-simulation failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [params, currentImage, processor, isProcessing]);

  const handleImageSelect = useCallback(async (imageData: ImageData) => {
    setCurrentImage(imageData);
    setResult(null); // Clear previous result
    
    // Automatically run game fish vision simulation
    if (processor) {
      setIsProcessing(true);
      try {
        const startTime = Date.now();
        const gameFishVisionResult = await processor.processImage(imageData, params);
        const processingTime = Date.now() - startTime;
        
        setResult({
          originalImage: imageData,
          lureVisionImage: gameFishVisionResult,
          processingTime
        });
      } catch (error) {
        console.error('Game fish vision processing failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [processor, params]);

  // const handlePresetSelect = useCallback((presetId: string) => {
  //   setSelectedPreset(presetId);
  // }, []); // Removed for streamlined interface

  const handleSimulate = useCallback(async () => {
    if (!currentImage || !processor) return;

    setIsProcessing(true);
    try {
      const startTime = performance.now();
      const lureVisionImage = await processor.processImage(currentImage, params);
      const processingTime = performance.now() - startTime;

      setResult({
        originalImage: currentImage,
        lureVisionImage,
        processingTime
      });
    } catch (error) {
      console.error('Simulation failed:', error);
      // You could add error handling UI here
    } finally {
      setIsProcessing(false);
    }
  }, [currentImage, params, processor]);

  const handleExport = useCallback((format: 'png' | 'collage') => {
    if (!result) return;

    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');

    if (format === 'png') {
      ImageExporter.exportPNG(result.lureVisionImage, `lure-vision_${timestamp}.png`);
    } else {
      ImageExporter.exportCollage(
        result.originalImage,
        result.lureVisionImage,
        params,
        `lure-vision-comparison_${timestamp}.png`
      );
    }
  }, [result, params]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Lake Background */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("/lake-background.jpg")',
        }}
      >
        {/* Header Navigation */}
        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/logo.png" 
                  alt="Thumpin Jigs Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#gamefishvision" className="text-white hover:text-red-400 transition-colors font-medium">
                  GAME FISH VISION
                </a>
                <a href="#how-it-works" className="text-white hover:text-red-400 transition-colors font-medium">
                  HOW IT WORKS
                </a>
                <a href="#science" className="text-white hover:text-red-400 transition-colors font-medium">
                  SCIENCE
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-bold mb-4" style={{ color: '#C41E3A' }}>
              GAME FISH VISION
            </h1>
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
              SIMULATOR
            </h2>
            <p className="text-xl mb-2 font-medium">
              Scientifically Proven Multi-Species Vision Analysis
            </p>
            <p className="text-lg mb-8 opacity-90">
              See the underwater world through any game fish&apos;s eyes using tournament-proven technology
            </p>
            <div className="inline-flex items-center justify-center px-8 py-3 border-2 border-red-600 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors cursor-pointer" 
                 onClick={() => document.getElementById('gamefishvision')?.scrollIntoView({ behavior: 'smooth' })}>
              START SIMULATION
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="gamefishvision" className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1B365D' }}>
              Jig Vision Simulator
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Upload jig photos or select presets. See how bass perceive your jigs at different depths and water conditions.
            </p>
          </div>

          {/* Streamlined Single Column Layout */}
          <div className="max-w-5xl mx-auto">
            
            
            {/* Image Viewer */}
            <div className="mb-4">
              <ImageViewer
                originalImage={result?.originalImage || null}
                lureVisionImage={result?.lureVisionImage || null}
                onExport={handleExport}
                onImageUpload={handleImageSelect}
              />
            </div>
            
            {/* Controls Section - Under the viewer */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <ControlPanel
                params={params}
                onParamsChange={setParams}
                onSimulate={handleSimulate}
                isProcessing={isProcessing}
                onImageUpload={handleImageSelect}
                hasImage={currentImage !== null}
              />
              
              {result && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-3" style={{ borderColor: '#C41E3A' }}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium" style={{ color: '#C41E3A' }}>
                      Analysis Complete
                    </h4>
                    <div className="text-xs text-gray-600">
                      {result.processingTime.toFixed(1)}ms • {result.originalImage.width}×{result.originalImage.height}px
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16" style={{ backgroundColor: '#1B365D' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tournament-proven technology based on scientific bass vision research
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Underwater Attenuation</h3>
              <p className="text-gray-300">
                Models how water absorbs different wavelengths using the Beer-Lambert law.
                Red light dies first, blue penetrates deepest - just like in real lakes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Bass Vision Analysis</h3>
              <p className="text-gray-300">
                Converts colors to bass cone responses (LWS ~614nm, RH2 ~535nm) plus rod vision.
                Bass see the world differently - they&apos;re red-green colorblind.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Tournament Results</h3>
              <p className="text-gray-300">
                Blends cone and rod signals based on lighting conditions to show you 
                exactly what bass see when they strike your jigs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section id="science" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#1B365D' }}>
              IT AIN&apos;T LUCK • IT&apos;S THUMPIN
            </h2>
            <p className="text-gray-600 max-w-4xl mx-auto">
              Based on research by Mitchem et al. and underwater optics principles. 
              This scientific simulation helps you choose the right jig colors for any lake condition, 
              giving you the edge that separates tournament winners from weekend warriors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}