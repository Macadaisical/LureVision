'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ImageViewerProps {
  originalImage: ImageData | null;
  aquaticVisionImage: ImageData | null;
  onExport: (format: 'png' | 'collage') => void;
  onImageUpload: (imageData: ImageData) => void;
}

export function ImageViewer({ originalImage, aquaticVisionImage, onExport, onImageUpload }: ImageViewerProps) {
  const [splitPosition, setSplitPosition] = useState(50); // Percentage
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'aquatic'>('split');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawComparison = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage || !aquaticVisionImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    if (viewMode === 'original') {
      ctx.putImageData(originalImage, 0, 0);
    } else if (viewMode === 'aquatic') {
      ctx.putImageData(aquaticVisionImage, 0, 0);
    } else {
      // Split view
      const splitX = Math.floor((originalImage.width * splitPosition) / 100);

      // Draw original image on left
      const originalLeft = ctx.createImageData(splitX, originalImage.height);
      for (let y = 0; y < originalImage.height; y++) {
        for (let x = 0; x < splitX; x++) {
          const srcIndex = (y * originalImage.width + x) * 4;
          const dstIndex = (y * splitX + x) * 4;
          originalLeft.data[dstIndex] = originalImage.data[srcIndex];
          originalLeft.data[dstIndex + 1] = originalImage.data[srcIndex + 1];
          originalLeft.data[dstIndex + 2] = originalImage.data[srcIndex + 2];
          originalLeft.data[dstIndex + 3] = originalImage.data[srcIndex + 3];
        }
      }
      ctx.putImageData(originalLeft, 0, 0);

      // Draw game fish vision on right
      const gameFishRight = ctx.createImageData(originalImage.width - splitX, originalImage.height);
      for (let y = 0; y < originalImage.height; y++) {
        for (let x = splitX; x < originalImage.width; x++) {
          const srcIndex = (y * originalImage.width + x) * 4;
          const dstIndex = (y * (originalImage.width - splitX) + (x - splitX)) * 4;
          gameFishRight.data[dstIndex] = aquaticVisionImage.data[srcIndex];
          gameFishRight.data[dstIndex + 1] = aquaticVisionImage.data[srcIndex + 1];
          gameFishRight.data[dstIndex + 2] = aquaticVisionImage.data[srcIndex + 2];
          gameFishRight.data[dstIndex + 3] = aquaticVisionImage.data[srcIndex + 3];
        }
      }
      ctx.putImageData(gameFishRight, splitX, 0);

      // Draw split line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, originalImage.height);
      ctx.stroke();
    }
  }, [originalImage, aquaticVisionImage, splitPosition, viewMode]);

  useEffect(() => {
    drawComparison();
  }, [drawComparison]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (viewMode !== 'split') return;
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSplitPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (viewMode !== 'split') return;
    
    const container = containerRef.current;
    if (!container || !e.touches[0]) return;

    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSplitPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Scale down if image is too large
      const maxWidth = 2048;
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      onImageUpload(imageData);
      
      URL.revokeObjectURL(imageUrl);
    };

    img.src = imageUrl;
    
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const hasImages = originalImage && aquaticVisionImage;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Game Fish Vision Comparison
          </h2>
          {hasImages && (
            <div className="flex space-x-2">
              <button
                onClick={() => onExport('png')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export PNG
              </button>
              <button
                onClick={() => onExport('collage')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export Collage
              </button>
            </div>
          )}
        </div>

        {/* View mode toggles */}
        {hasImages && (
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'original'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setViewMode('aquatic')}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === 'aquatic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Game Fish Vision
            </button>
          </div>
        )}
      </div>

      {/* Image display area */}
      <div 
        ref={containerRef}
        className="relative bg-gray-100 min-h-[250px] flex items-center justify-center cursor-crosshair"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {hasImages ? (
          <div className="relative max-w-full max-h-[350px]">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain shadow-lg"
            />
            
            {/* Labels for split view */}
            {viewMode === 'split' && (
              <>
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  Original
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  Game Fish Vision
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <label htmlFor="main-file-upload" className="cursor-pointer">
              <input
                id="main-file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: '#1B365D' }}>
                  Upload Your Lure Image
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click here or drag and drop your jig, lure, or bait image
                </p>
                <div 
                  className="inline-block px-6 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#C41E3A' }}
                >
                  Choose Image File
                </div>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Split position indicator */}
      {hasImages && viewMode === 'split' && (
        <div className="p-2 bg-gray-50 border-t border-gray-200">
          <div className="text-center text-xs text-gray-600">
            Split at {Math.round(splitPosition)}% • Move mouse to adjust
          </div>
        </div>
      )}
    </div>
  );
}