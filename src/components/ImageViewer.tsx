'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface ImageViewerProps {
  originalImage: ImageData | null;
  lureVisionImage: ImageData | null;
  onExport: (format: 'png' | 'collage') => void;
  onImageUpload: (imageData: ImageData) => void;
}

export function ImageViewer({ originalImage, lureVisionImage, onExport, onImageUpload }: ImageViewerProps) {
  const [splitPosition, setSplitPosition] = useState(50); // Percentage
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'lure'>('split');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<number | null>(null);

  const hasImages = originalImage && lureVisionImage;

  const drawComparison = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage || !lureVisionImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    if (viewMode === 'original') {
      ctx.putImageData(originalImage, 0, 0);
    } else if (viewMode === 'lure') {
      ctx.putImageData(lureVisionImage, 0, 0);
    } else {
      // Split view
      const splitX = Math.max(1, Math.min(originalImage.width - 1, Math.floor((originalImage.width * splitPosition) / 100)));

      // Draw original image on left (only if splitX > 0)
      if (splitX > 0) {
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
      }

      // Draw LureVision on right (only if there's space)
      const rightWidth = originalImage.width - splitX;
      if (rightWidth > 0) {
        const lureVisionRight = ctx.createImageData(rightWidth, originalImage.height);
        for (let y = 0; y < originalImage.height; y++) {
          for (let x = splitX; x < originalImage.width; x++) {
            const srcIndex = (y * originalImage.width + x) * 4;
            const dstIndex = (y * rightWidth + (x - splitX)) * 4;
            lureVisionRight.data[dstIndex] = lureVisionImage.data[srcIndex];
            lureVisionRight.data[dstIndex + 1] = lureVisionImage.data[srcIndex + 1];
            lureVisionRight.data[dstIndex + 2] = lureVisionImage.data[srcIndex + 2];
            lureVisionRight.data[dstIndex + 3] = lureVisionImage.data[srcIndex + 3];
          }
        }
        ctx.putImageData(lureVisionRight, splitX, 0);
      }

      // Draw split line with better styling
      ctx.strokeStyle = '#C41E3A';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, originalImage.height);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [originalImage, lureVisionImage, splitPosition, viewMode]);

  useEffect(() => {
    drawComparison();
  }, [drawComparison]);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Throttled split position update using requestAnimationFrame
  const updateSplitPosition = useCallback(() => {
    if (pendingPositionRef.current !== null) {
      setSplitPosition(pendingPositionRef.current);
      pendingPositionRef.current = null;
    }
    animationFrameRef.current = null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (viewMode !== 'split' || !originalImage || !lureVisionImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use canvas bounding rect instead of container for accurate positioning
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Clamp x to canvas bounds and calculate percentage
    const clampedX = Math.max(0, Math.min(rect.width, x));
    const percentage = (clampedX / rect.width) * 100;

    // Throttle updates using requestAnimationFrame for smooth performance
    pendingPositionRef.current = percentage;
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updateSplitPosition);
    }
  }, [viewMode, originalImage, lureVisionImage, updateSplitPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (viewMode !== 'split' || !originalImage || !lureVisionImage || !e.touches[0]) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use canvas bounding rect for accurate touch positioning
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;

    // Clamp x to canvas bounds and calculate percentage
    const clampedX = Math.max(0, Math.min(rect.width, x));
    const percentage = (clampedX / rect.width) * 100;

    // Throttle updates using requestAnimationFrame for smooth performance
    pendingPositionRef.current = percentage;
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updateSplitPosition);
    }
  }, [viewMode, originalImage, lureVisionImage, updateSplitPosition]);

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

  return (
    <div className="space-y-4">
      {/* View Mode Controls */}
      {hasImages && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'split'
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={viewMode === 'split' ? { backgroundColor: '#C41E3A' } : {}}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Split View
              </div>
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'original'
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={viewMode === 'original' ? { backgroundColor: '#1B365D' } : {}}
            >
              Original
            </button>
            <button
              onClick={() => setViewMode('lure')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'lure'
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
              style={viewMode === 'lure' ? { backgroundColor: '#7EBDE4' } : {}}
            >
              Fish Vision
            </button>
          </div>

          {/* Export Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExport('png')}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: '#1B365D' }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#152B4D';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#1B365D';
              }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PNG
              </div>
            </button>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                defaultValue="png"
                onChange={(e) => onExport(e.target.value as 'png' | 'collage')}
              >
                <option value="png">PNG</option>
                <option value="collage">Collage</option>
              </select>
              <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Image Display Area */}
      <div
        ref={containerRef}
        className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
        style={{ minHeight: hasImages ? 'auto' : '400px' }}
      >
        {hasImages ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-auto cursor-crosshair"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            />

            {/* Split View Labels */}
            {viewMode === 'split' && (
              <>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: 'rgba(27, 54, 93, 0.9)' }}>
                  📸 Original
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: 'rgba(196, 30, 58, 0.9)' }}>
                  🐟 Fish Vision
                </div>
              </>
            )}

            {/* Split Position Indicator */}
            {viewMode === 'split' && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                Split: {Math.round(splitPosition)}% • Move cursor to adjust
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <label htmlFor="main-file-upload" className="cursor-pointer w-full max-w-md">
              <input
                id="main-file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-all duration-200 hover:bg-gray-50">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
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
                <h3 className="text-xl font-medium mb-2" style={{ color: '#1B365D' }}>
                  Upload Your Lure Image
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Drag and drop, or click to select your jig, lure, or bait image<br />
                  <span className="text-xs text-gray-500">Supports JPG, PNG • Max 2048px width</span>
                </p>
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:opacity-90"
                  style={{ backgroundColor: '#C41E3A' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Choose Image File
                </div>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}