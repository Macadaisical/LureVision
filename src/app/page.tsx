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
    
    // Automatically run LureVision simulation
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
        console.error('LureVision processing failed:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="LureVision Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-xl font-bold" style={{ color: '#1B365D' }}>
                LureVision
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#simulator" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Simulator
              </a>
              <a href="#settings" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                Settings
              </a>
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                About
              </a>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#C41E3A' }}
                onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Lure
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Compact Two-Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Sidebar - Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C41E3A' }}></div>
                <h2 className="text-lg font-bold" style={{ color: '#1B365D' }}>
                  Simulation Parameters
                </h2>
              </div>

              <ControlPanel
                params={params}
                onParamsChange={setParams}
                onSimulate={handleSimulate}
                isProcessing={isProcessing}
                onImageUpload={handleImageSelect}
                hasImage={currentImage !== null}
              />

              {result && (
                <div className="mt-6 p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium" style={{ color: '#C41E3A' }}>
                      Analysis Complete
                    </h4>
                    <div className="text-xs text-gray-600">
                      {result.processingTime.toFixed(1)}ms
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.originalImage.width}×{result.originalImage.height}px
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Main Area - Image Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7EBDE4' }}></div>
                  <h2 className="text-lg font-bold" style={{ color: '#1B365D' }}>
                    Vision Comparison
                  </h2>
                </div>
                <div className="text-sm text-gray-500">
                  Upload an image to begin analysis
                </div>
              </div>

              <ImageViewer
                originalImage={result?.originalImage || null}
                lureVisionImage={result?.lureVisionImage || null}
                onExport={handleExport}
                onImageUpload={handleImageSelect}
              />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}