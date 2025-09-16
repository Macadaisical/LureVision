'use client';

import { useState } from 'react';
import { SimulationParams } from '@/types';
import { WATER_CLARITY_PRESETS, LIGHT_CONDITIONS, DEFAULT_PARAMS } from '@/lib/constants';
import { getFreshwaterSpecies, getSaltwaterSpecies, getAnadromousSpecies, getDeepSeaSpecies, shouldShowSalinitySlider, getDefaultSalinityForSpecies, getSpeciesById } from '@/lib/fishSpecies';

interface ControlPanelProps {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
  onSimulate: () => void;
  isProcessing: boolean;
  onImageUpload: (imageData: ImageData) => void;
  hasImage: boolean;
}

export function ControlPanel({ params, onParamsChange, onSimulate, isProcessing, onImageUpload, hasImage }: ControlPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentSpecies = getSpeciesById(params.speciesId);

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

  const handleClarityChange = (value: number) => {
    // Interpolate between presets for smoother transitions
    const normalizedValue = value / 100; // 0-1 range
    const scaledValue = normalizedValue * (WATER_CLARITY_PRESETS.length - 1);
    const lowerIndex = Math.floor(scaledValue);
    const upperIndex = Math.min(lowerIndex + 1, WATER_CLARITY_PRESETS.length - 1);
    const blend = scaledValue - lowerIndex;

    const lower = WATER_CLARITY_PRESETS[lowerIndex];
    const upper = WATER_CLARITY_PRESETS[upperIndex];

    const interpolatedClarity = {
      name: lower.name,
      label: blend > 0.5 ? upper.label : lower.label,
      kR: lower.kR + (upper.kR - lower.kR) * blend,
      kG: lower.kG + (upper.kG - lower.kG) * blend,
      kB: lower.kB + (upper.kB - lower.kB) * blend,
    };

    onParamsChange({
      ...params,
      waterProperties: {
        ...params.waterProperties,
        clarity: interpolatedClarity
      }
    });
  };

  const handleLightChange = (value: number) => {
    // Interpolate between presets for smoother transitions
    const normalizedValue = value / 100; // 0-1 range
    const scaledValue = normalizedValue * (LIGHT_CONDITIONS.length - 1);
    const lowerIndex = Math.floor(scaledValue);
    const upperIndex = Math.min(lowerIndex + 1, LIGHT_CONDITIONS.length - 1);
    const blend = scaledValue - lowerIndex;

    const lower = LIGHT_CONDITIONS[lowerIndex];
    const upper = LIGHT_CONDITIONS[upperIndex];

    const interpolatedLight = {
      name: lower.name,
      label: blend > 0.5 ? upper.label : lower.label,
      rodBlend: lower.rodBlend + (upper.rodBlend - lower.rodBlend) * blend,
      saturation: lower.saturation + (upper.saturation - lower.saturation) * blend,
    };

    onParamsChange({ ...params, lightCondition: interpolatedLight });
  };

  const handleDepthChange = (depth: number) => {
    onParamsChange({ ...params, depth });
  };

  const handleSpeciesChange = (speciesId: string) => {
    const newSalinity = getDefaultSalinityForSpecies(speciesId);
    onParamsChange({
      ...params,
      speciesId,
      waterProperties: {
        ...params.waterProperties,
        salinity: newSalinity
      }
    });
  };

  const handleSalinityChange = (salinity: number) => {
    onParamsChange({
      ...params,
      waterProperties: {
        ...params.waterProperties,
        salinity
      }
    });
  };

  const handleBackscatterChange = (backscatter: boolean) => {
    onParamsChange({ ...params, backscatter });
  };

  const resetToDefaults = () => {
    onParamsChange(DEFAULT_PARAMS);
  };

  return (
    <div className="space-y-6">
      {/* Species Selection Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: '#1B365D' }}>Species Selection</h3>
          <button
            onClick={resetToDefaults}
            className="text-xs hover:underline transition-colors"
            style={{ color: '#C41E3A' }}
          >
            Reset
          </button>
        </div>

        <div className="relative">
          <select
            value={params.speciesId}
            onChange={(e) => handleSpeciesChange(e.target.value)}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white appearance-none pr-10"
          >
            <optgroup label="🌊 Freshwater">
              {getFreshwaterSpecies().map(species => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="🌊 Saltwater">
              {getSaltwaterSpecies().map(species => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="🔄 Anadromous">
              {getAnadromousSpecies().map(species => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="🌑 Deep-Sea">
              {getDeepSeaSpecies().map(species => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
            </optgroup>
          </select>
          <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {currentSpecies && (
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(126, 189, 228, 0.1)', border: '1px solid rgba(126, 189, 228, 0.3)' }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium" style={{ color: '#1B365D' }}>
                {currentSpecies.name}
              </h4>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#C41E3A', color: 'white' }}>
                {currentSpecies.visionType}
              </span>
            </div>
            <p className="text-xs text-gray-600 italic mb-1">
              {currentSpecies.scientificName}
            </p>
            <div className="text-xs text-gray-700">
              <span className="font-medium">{Object.keys(currentSpecies.coneTypes).length} cone vision</span> • <span>{currentSpecies.environment}</span>
            </div>
          </div>
        )}
      </div>

      {/* Environmental Parameters Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1B365D' }}>Environmental Parameters</h3>

        {/* Water Clarity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: '#1B365D' }}>Water Clarity</label>
            <span className="text-sm font-medium" style={{ color: '#C41E3A' }}>{params.waterProperties.clarity.label}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={(() => {
              const kRRange = WATER_CLARITY_PRESETS[WATER_CLARITY_PRESETS.length - 1].kR - WATER_CLARITY_PRESETS[0].kR;
              const currentKROffset = params.waterProperties.clarity.kR - WATER_CLARITY_PRESETS[0].kR;
              return Math.round((currentKROffset / kRRange) * 100);
            })()}
            onChange={(e) => handleClarityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #7EBDE4 0%, #1B365D 50%, #8B4513 100%)',
              accentColor: '#C41E3A'
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Clear</span>
            <span>Murky</span>
            <span>Muddy</span>
          </div>
        </div>

        {/* Salinity (conditional for saltwater species) */}
        {shouldShowSalinitySlider(params.speciesId) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: '#1B365D' }}>Salinity</label>
              <span className="text-sm font-medium" style={{ color: '#C41E3A' }}>{params.waterProperties.salinity} ppt</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={params.waterProperties.salinity}
              onChange={(e) => handleSalinityChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #7EBDE4 0%, #1B365D 100%)',
                accentColor: '#C41E3A'
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Fresh</span>
              <span>Brackish</span>
              <span>Ocean</span>
            </div>
          </div>
        )}

        {/* Depth */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: '#1B365D' }}>Depth</label>
            <span className="text-sm font-medium" style={{ color: '#C41E3A' }}>{params.depth} ft</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={params.depth}
            onChange={(e) => handleDepthChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #FFD700 0%, #7EBDE4 50%, #1B365D 100%)',
              accentColor: '#C41E3A'
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Surface</span>
            <span>15 ft</span>
            <span>Deep</span>
          </div>
        </div>

        {/* Light Conditions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: '#1B365D' }}>Light Conditions</label>
            <span className="text-sm font-medium" style={{ color: '#C41E3A' }}>{params.lightCondition.label}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={(() => {
              const rodRange = LIGHT_CONDITIONS[LIGHT_CONDITIONS.length - 1].rodBlend - LIGHT_CONDITIONS[0].rodBlend;
              const currentRodOffset = params.lightCondition.rodBlend - LIGHT_CONDITIONS[0].rodBlend;
              return Math.round((currentRodOffset / rodRange) * 100);
            })()}
            onChange={(e) => handleLightChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #FFD700 0%, #87CEEB 50%, #2F4F4F 100%)',
              accentColor: '#C41E3A'
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>☀️ Bright</span>
            <span>☁️ Overcast</span>
            <span>🌙 Low Light</span>
          </div>
        </div>
      </div>

      {/* Processing & Upload Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1B365D' }}>Image & Processing</h3>

        {/* Upload Button */}
        <label className="block mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div
            className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 cursor-pointer text-center border-2 border-transparent hover:shadow-md"
            style={{ backgroundColor: '#C41E3A' }}
            onMouseEnter={(e) => {
              (e.target as HTMLDivElement).style.backgroundColor = '#A31729';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLDivElement).style.backgroundColor = '#C41E3A';
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>{hasImage ? 'Upload New Image' : 'Upload Image'}</span>
            </div>
          </div>
        </label>

        {/* Process Button */}
        <button
          onClick={onSimulate}
          disabled={isProcessing || !hasImage}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border-2"
          style={isProcessing || !hasImage ? {
            backgroundColor: '#F3F4F6',
            borderColor: '#D1D5DB',
            color: '#9CA3AF',
            cursor: 'not-allowed'
          } : {
            backgroundColor: 'transparent',
            borderColor: '#1B365D',
            color: '#1B365D'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing && hasImage) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#1B365D';
              (e.target as HTMLButtonElement).style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing && hasImage) {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.target as HTMLButtonElement).style.color = '#1B365D';
            }
          }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Process Image</span>
            </div>
          )}
        </button>
      </div>

      {/* Advanced Settings Toggle */}
      {showAdvanced && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#1B365D' }}>Advanced Settings</h3>

          <div className="space-y-4">
            {/* Backscatter/Haze */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={params.backscatter}
                onChange={(e) => handleBackscatterChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
                style={{ accentColor: '#C41E3A' }}
              />
              <div>
                <span className="text-sm font-medium" style={{ color: '#1B365D' }}>
                  Enable backscatter/haze
                </span>
                <p className="text-xs text-gray-500">
                  Adds realistic veiling light effect for murky water
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Advanced Toggle Button */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        {showAdvanced ? '▲ Hide Advanced Settings' : '▼ Show Advanced Settings'}
      </button>
    </div>
  );
}