precision mediump float;

// Input texture
uniform sampler2D u_image;
varying vec2 v_texCoord;

// Simulation parameters
uniform float u_depth;        // Depth in meters
uniform vec3 u_kValues;       // [kR, kG, kB] attenuation coefficients
uniform float u_rodBlend;     // Rod contribution (0-1)
uniform float u_saturation;   // Color saturation (0-1)
uniform float u_backscatter;  // Backscatter factor (0-1)

// Bass vision matrices (approximated as uniforms)
uniform mat3 u_rgbToBass;     // RGB to LWS/RH2 cones
uniform mat3 u_bassToRgb;     // Bass cones back to RGB
uniform vec3 u_rodWeights;    // Rod response weights

// sRGB to linear conversion
vec3 srgbToLinear(vec3 srgb) {
    return mix(srgb / 12.92, 
               pow((srgb + 0.055) / 1.055, vec3(2.4)),
               step(0.04045, srgb));
}

// Linear to sRGB conversion
vec3 linearToSrgb(vec3 linear) {
    vec3 result = mix(linear * 12.92,
                      1.055 * pow(linear, vec3(1.0/2.4)) - 0.055,
                      step(0.0031308, linear));
    return clamp(result, 0.0, 1.0);
}

// Apply underwater attenuation (Beer-Lambert law)
vec3 applyUnderwaterAttenuation(vec3 rgb, float depth, vec3 k) {
    float doublePassDepth = 2.0 * depth;
    return rgb * exp(-k * doublePassDepth);
}

// Convert RGB to bass cone responses
vec2 rgbToBassResponse(vec3 rgb) {
    // Manual matrix multiplication for 3x2 → 2x1
    return vec2(
        dot(rgb, vec3(0.85, 0.65, 0.15)), // LWS response
        dot(rgb, vec3(0.25, 0.92, 0.45))  // RH2 response
    );
}

// Calculate rod response
float calculateRodResponse(vec3 rgb) {
    return dot(rgb, u_rodWeights);
}

// Reconstruct bass vision from cone + rod responses
vec3 reconstructBassVision(vec2 bassCones, float rodResponse) {
    // Convert bass cones back to RGB
    vec3 coneRgb = vec3(
        bassCones.x * 0.75 + bassCones.y * 0.25, // R
        bassCones.x * 0.15 + bassCones.y * 0.85, // G  
        bassCones.x * 0.05 + bassCones.y * 0.45  // B
    );
    
    // Rod as achromatic signal
    vec3 rodRgb = vec3(rodResponse);
    
    // Blend cone and rod responses
    return mix(coneRgb, rodRgb, u_rodBlend);
}

// Adjust color saturation
vec3 adjustSaturation(vec3 rgb, float saturation) {
    float luminance = dot(rgb, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luminance), rgb, saturation);
}

// Add backscatter/haze effect
vec3 addBackscatter(vec3 rgb, float depth, float intensity) {
    float hazeFactor = min(depth / 9.144, 1.0) * intensity * 0.15; // 9.144m = 30ft
    vec3 hazeColor = vec3(0.4, 0.5, 0.6); // Bluish-gray haze
    return mix(rgb, hazeColor, hazeFactor);
}

void main() {
    // Sample the input texture
    vec4 texel = texture2D(u_image, v_texCoord);
    vec3 rgb = texel.rgb;
    
    // Convert sRGB to linear
    vec3 linearRgb = srgbToLinear(rgb);
    
    // Step 1: Apply underwater attenuation
    vec3 attenuatedRgb = applyUnderwaterAttenuation(linearRgb, u_depth, u_kValues);
    
    // Step 2: Convert to bass cone + rod responses
    vec2 bassCones = rgbToBassResponse(attenuatedRgb);
    float rodResponse = calculateRodResponse(attenuatedRgb);
    
    // Step 3: Reconstruct bass vision
    vec3 bassRgb = reconstructBassVision(bassCones, rodResponse);
    
    // Apply saturation adjustment
    bassRgb = adjustSaturation(bassRgb, u_saturation);
    
    // Add backscatter if enabled
    bassRgb = addBackscatter(bassRgb, u_depth, u_backscatter);
    
    // Convert back to sRGB
    vec3 finalRgb = linearToSrgb(bassRgb);
    
    gl_FragColor = vec4(finalRgb, texel.a);
}