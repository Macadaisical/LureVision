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
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 border-l-4" style={{ borderColor: '#C41E3A' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: '#1B365D' }}>Simulation Controls</h2>
        <button
          onClick={resetToDefaults}
          className="text-sm hover:underline transition-colors"
          style={{ color: '#C41E3A' }}
        >
          Reset Defaults
        </button>
      </div>

      {/* Fish Species Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-medium" style={{ color: '#1B365D' }}>
          Fish Species
        </label>
        <select
          value={params.speciesId}
          onChange={(e) => handleSpeciesChange(e.target.value)}
          className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ fontSize: '11px' }}
        >
          <optgroup label="Freshwater">
            {getFreshwaterSpecies().map(species => (
              <option key={species.id} value={species.id}>
                {species.name} ({species.scientificName})
              </option>
            ))}
          </optgroup>
          <optgroup label="Saltwater">
            {getSaltwaterSpecies().map(species => (
              <option key={species.id} value={species.id}>
                {species.name} ({species.scientificName})
              </option>
            ))}
          </optgroup>
          <optgroup label="Anadromous">
            {getAnadromousSpecies().map(species => (
              <option key={species.id} value={species.id}>
                {species.name} ({species.scientificName})
              </option>
            ))}
          </optgroup>
          <optgroup label="Deep-Sea">
            {getDeepSeaSpecies().map(species => (
              <option key={species.id} value={species.id}>
                {species.name} ({species.scientificName})
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Species Information Panel */}
      {currentSpecies && (
        <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-blue-800">
              {currentSpecies.name}
            </h4>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {currentSpecies.visionType}
            </span>
          </div>
          <p className="text-xs text-blue-700 italic">
            {currentSpecies.scientificName}
          </p>
          <div className="text-xs text-blue-600">
            <p><strong>Environment:</strong> {currentSpecies.environment}</p>
            <p><strong>Vision Type:</strong> {currentSpecies.visionType} ({Object.keys(currentSpecies.coneTypes).length} cone{Object.keys(currentSpecies.coneTypes).length !== 1 ? 's' : ''})</p>
            {currentSpecies.specialFeatures.length > 0 && (
              <p><strong>Special Features:</strong> {currentSpecies.specialFeatures.slice(0, 2).join(', ')}{currentSpecies.specialFeatures.length > 2 ? '...' : ''}</p>
            )}
          </div>
        </div>
      )}

      {/* Water Clarity Slider */}
      <div className="space-y-2">
        <label className="block text-xs font-medium" style={{ color: '#1B365D' }}>
          Water Clarity: {params.waterProperties.clarity.label}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={(() => {
            // Calculate current position based on interpolated values
            const kRRange = WATER_CLARITY_PRESETS[WATER_CLARITY_PRESETS.length - 1].kR - WATER_CLARITY_PRESETS[0].kR;
            const currentKROffset = params.waterProperties.clarity.kR - WATER_CLARITY_PRESETS[0].kR;
            return Math.round((currentKROffset / kRRange) * 100);
          })()}
          onChange={(e) => handleClarityChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Clear</span>
          <span>Murky</span>
          <span>Muddy</span>
        </div>
        {showAdvanced && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            kR: {params.waterProperties.clarity.kR.toFixed(2)}, kG: {params.waterProperties.clarity.kG.toFixed(2)}, kB: {params.waterProperties.clarity.kB.toFixed(2)} m⁻¹
          </div>
        )}
      </div>

      {/* Salinity Slider (conditional for saltwater species) */}
      {shouldShowSalinitySlider(params.speciesId) && (
        <div className="space-y-2">
          <label className="block text-xs font-medium" style={{ color: '#1B365D' }}>
            Salinity: {params.waterProperties.salinity} ppt
          </label>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={params.waterProperties.salinity}
            onChange={(e) => handleSalinityChange(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Fresh (0 ppt)</span>
            <span>Brackish (15 ppt)</span>
            <span>Ocean (35 ppt)</span>
          </div>
          {showAdvanced && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              Dissolved salt concentration affects light transmission and spectral attenuation
            </div>
          )}
        </div>
      )}

      {/* Depth Slider */}
      <div className="space-y-2">
        <label className="block text-xs font-medium" style={{ color: '#1B365D' }}>
          Depth: {params.depth} ft
        </label>
        <input
          type="range"
          min="0"
          max="30"
          step="1"
          value={params.depth}
          onChange={(e) => handleDepthChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 ft</span>
          <span>15 ft</span>
          <span>30 ft</span>
        </div>
      </div>

      {/* Sky/Light Conditions Slider */}
      <div className="space-y-2">
        <label className="block text-xs font-medium" style={{ color: '#1B365D' }}>
          Sky/Light Conditions: {params.lightCondition.label}
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={(() => {
            // Calculate current position based on interpolated values
            const rodRange = LIGHT_CONDITIONS[LIGHT_CONDITIONS.length - 1].rodBlend - LIGHT_CONDITIONS[0].rodBlend;
            const currentRodOffset = params.lightCondition.rodBlend - LIGHT_CONDITIONS[0].rodBlend;
            return Math.round((currentRodOffset / rodRange) * 100);
          })()}
          onChange={(e) => handleLightChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Bright Sun</span>
          <span>Overcast</span>
          <span>Low Light</span>
        </div>
        {showAdvanced && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            Rod: {Math.round(params.lightCondition.rodBlend * 100)}%, Sat: {Math.round(params.lightCondition.saturation * 100)}%
          </div>
        )}
      </div>

      {/* Backscatter/Haze */}
      <div className="space-y-1">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={params.backscatter}
            onChange={(e) => handleBackscatterChange(e.target.checked)}
            className="text-red-600"
            style={{ accentColor: '#C41E3A' }}
          />
          <span className="text-xs font-medium" style={{ color: '#1B365D' }}>
            Add backscatter/haze
          </span>
        </label>
        <p className="text-xs text-gray-400 ml-6">
          Adds realistic veiling light effect for murky/muddy water
        </p>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="border-t pt-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Settings
        </button>
      </div>

      {/* Upload and Simulate Buttons */}
      <div className="flex space-x-2">
        {/* Upload Button */}
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="w-full py-2 px-3 rounded-lg font-medium text-white transition-colors cursor-pointer text-center text-sm"
               style={{ backgroundColor: '#1B365D' }}
               onMouseEnter={(e) => {
                 (e.target as HTMLDivElement).style.backgroundColor = '#152B4D';
               }}
               onMouseLeave={(e) => {
                 (e.target as HTMLDivElement).style.backgroundColor = '#1B365D';
               }}>
            {hasImage ? 'New Image' : 'Upload Image'}
          </div>
        </label>

        {/* Refresh Button (updates happen automatically as you drag sliders) */}
        <button
          onClick={onSimulate}
          disabled={isProcessing || !hasImage}
          className="flex-1 py-2 px-3 rounded-lg font-medium text-white transition-colors text-sm"
          style={isProcessing || !hasImage ? {
            backgroundColor: '#9CA3AF',
            cursor: 'not-allowed'
          } : {
            backgroundColor: '#C41E3A',
          }}
          onMouseEnter={(e) => {
            if (!isProcessing && hasImage) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#A31729';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing && hasImage) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#C41E3A';
            }
          }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Refresh View'
          )}
        </button>
      </div>

      {/* Species Information Panel */}
      {(() => {
        const selectedSpecies = getSpeciesById(params.speciesId);
        if (!selectedSpecies) return null;

        return (
          <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: 'rgba(27, 54, 93, 0.1)', border: '1px solid rgba(27, 54, 93, 0.2)' }}>
            <div className="font-medium mb-1" style={{ color: '#1B365D' }}>
              {selectedSpecies.name} Vision Characteristics
            </div>
            <div className="space-y-1 text-gray-700">
              <div>• Vision Type: {selectedSpecies.visionType}</div>
              <div>• Environment: {selectedSpecies.environment}</div>
              {selectedSpecies.coneTypes.shortWave && (
                <div>• UV cone: ~{selectedSpecies.coneTypes.shortWave}nm</div>
              )}
              {selectedSpecies.coneTypes.mediumWave && (
                <div>• Medium cone: ~{selectedSpecies.coneTypes.mediumWave}nm</div>
              )}
              {selectedSpecies.coneTypes.longWave && (
                <div>• Long cone: ~{selectedSpecies.coneTypes.longWave}nm</div>
              )}
              <div className="mt-1 italic text-gray-600">
                {selectedSpecies.description}
              </div>
              {selectedSpecies.specialFeatures.length > 0 && (
                <div className="mt-1">
                  <div className="font-medium">Special Features:</div>
                  {selectedSpecies.specialFeatures.slice(0, 2).map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Scientific Note */}
      <div className="text-xs text-gray-600 p-3 rounded-lg" style={{ backgroundColor: 'rgba(196, 30, 58, 0.1)' }}>
        <p className="font-medium mb-1" style={{ color: '#1B365D' }}>Scientific Foundation:</p>
        <ul className="space-y-1">
          <li>• Species-specific cone sensitivities from research data</li>
          <li>• Beer-Lambert law for underwater light attenuation</li>
          <li>• Rod/cone transitions in different lighting conditions</li>
          <li>• Salinity effects on light transmission (saltwater species)</li>
        </ul>
      </div>
    </div>
  );
}