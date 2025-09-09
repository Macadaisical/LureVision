'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { JigPreset } from '@/types';

interface ImageUploadProps {
  onImageSelect: (imageData: ImageData) => void;
  jigPresets: JigPreset[];
  selectedPreset: string | null;
  onPresetSelect: (presetId: string) => void;
}

export function ImageUpload({ 
  onImageSelect, 
  jigPresets, 
  selectedPreset, 
  onPresetSelect 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const processImageFile = useCallback((file: File) => {
    console.log('Processing uploaded file:', file.name, file.type, file.size);
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      console.log('Uploaded image loaded successfully:', img.width, 'x', img.height);
      // Create canvas to extract ImageData
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      // Scale down if image is too large
      const maxWidth = 2048;
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
        console.log('Scaling image to:', width, 'x', height);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and extract image data
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      
      console.log('Image processed successfully, calling onImageSelect');
      setCurrentImage(imageUrl);
      onImageSelect(imageData);
    };

    img.onerror = (error) => {
      console.error('Failed to load uploaded image:', error);
    };

    img.src = imageUrl;
  }, [onImageSelect]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDragActive(false);
    if (acceptedFiles.length > 0) {
      processImageFile(acceptedFiles[0]);
    }
  }, [processImageFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handlePresetClick = (preset: JigPreset) => {
    console.log('Preset clicked:', preset.name, preset.fullImage);
    onPresetSelect(preset.id);
    
    // Load the preset image
    const img = new Image();
    img.onload = () => {
      console.log('Preset image loaded:', preset.name, img.width, 'x', img.height);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Failed to get canvas context for preset');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      console.log('Preset image processed, calling onImageSelect');
      setCurrentImage(preset.fullImage);
      onImageSelect(imageData);
    };
    
    img.onerror = (error) => {
      console.error('Failed to load preset image:', preset.name, error);
    };
    
    img.src = preset.fullImage;
  };

  return (
    <div className="space-y-4">
      {/* Jig Presets - Only show if presets are provided */}
      {jigPresets.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2">Choose a Jig Color</h4>
          <div className="grid grid-cols-2 gap-2">
            {jigPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedPreset === preset.id
                  ? 'ring-2 ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={selectedPreset === preset.id ? {
                borderColor: '#C41E3A'
              } : {}}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.thumbnail}
                  alt={preset.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onLoad={() => {
                    console.log(`✅ Successfully loaded jig image: ${preset.name}`);
                  }}
                  onError={() => {
                    console.error(`❌ Failed to load jig image: ${preset.name}, src: ${preset.thumbnail}`);
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-opacity pointer-events-none"></div>
              <div className="p-2 bg-white bg-opacity-90">
                <p className="text-xs font-medium text-gray-800 text-center truncate">
                  {preset.name}
                </p>
              </div>
            </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Divider - Only show if presets exist */}
      {jigPresets.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">or</span>
          </div>
        </div>
      )}

      {/* File Upload and Current Image - Inline Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upload Section */}
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-3">Upload Your Own Image</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragActive || dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-3">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="text-base font-medium text-gray-700">
                  {isDragActive || dragActive
                    ? 'Drop image here'
                    : 'Drag & drop an image here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports JPEG, PNG, WebP up to 12MP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Image Preview */}
        {currentImage ? (
          <div>
            <h3 className="text-base font-medium mb-3" style={{ color: '#1B365D' }}>
              Current Image
            </h3>
            <div className="bg-white border-2 rounded-lg p-3" style={{ borderColor: '#C41E3A' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt="Current selection"
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '160px', objectFit: 'contain' }}
              />
              <p className="text-xs text-gray-600 text-center mt-2">
                Ready for bass vision analysis
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image selected</p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}