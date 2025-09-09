import { SimulationParams } from '@/types';

/**
 * WebGL-based aquatic vision processor for high-performance real-time rendering
 */
export class WebGLAquaticVisionProcessor {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private framebuffer: WebGLFramebuffer | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas');
    const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    
    this.gl = gl as WebGLRenderingContext;
    this.initializeWebGL();
  }

  private async initializeWebGL() {
    const gl = this.gl;

    // Load shader sources
    const vertexShaderSource = await this.loadShaderSource('/src/shaders/gameFishVision.vert');
    const fragmentShaderSource = await this.loadShaderSource('/src/shaders/gameFishVision.frag');

    // Create and compile shaders
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    // Create and link program
    this.program = gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create WebGL program');
    }

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(this.program);
      gl.deleteProgram(this.program);
      throw new Error(`Failed to link program: ${error}`);
    }

    // Set up geometry (full-screen quad)
    this.setupGeometry();
  }

  private async loadShaderSource(path: string): Promise<string> {
    // In a real implementation, we'd fetch from the server
    // For now, return hardcoded shader source
    if (path.includes('.vert')) {
      return `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;
    } else {
      return `
        precision mediump float;
        
        uniform sampler2D u_image;
        varying vec2 v_texCoord;
        
        uniform float u_depth;
        uniform vec3 u_kValues;
        uniform float u_salinity;
        uniform float u_rodBlend;
        uniform float u_saturation;
        uniform float u_backscatter;
        uniform vec3 u_rodWeights;
        
        vec3 srgbToLinear(vec3 srgb) {
          return mix(srgb / 12.92, 
                     pow((srgb + 0.055) / 1.055, vec3(2.4)),
                     step(0.04045, srgb));
        }
        
        vec3 linearToSrgb(vec3 linear) {
          vec3 result = mix(linear * 12.92,
                            1.055 * pow(linear, vec3(1.0/2.4)) - 0.055,
                            step(0.0031308, linear));
          return clamp(result, 0.0, 1.0);
        }
        
        vec3 calculateSalinityAdjustedK(vec3 baseK, float salinity) {
          float salinityFactor = salinity / 10.0;
          return baseK * (1.0 + salinityFactor * vec3(0.008, 0.005, 0.003));
        }
        
        vec3 applyUnderwaterAttenuation(vec3 rgb, float depth, vec3 k, float salinity) {
          float doublePassDepth = 2.0 * depth * 0.3048; // feet to meters
          vec3 adjustedK = calculateSalinityAdjustedK(k, salinity);
          return rgb * exp(-adjustedK * doublePassDepth);
        }
        
        vec2 rgbToFishResponse(vec3 rgb) {
          return vec2(
            dot(rgb, vec3(0.85, 0.65, 0.15)),
            dot(rgb, vec3(0.25, 0.92, 0.45))
          );
        }
        
        float calculateRodResponse(vec3 rgb) {
          return dot(rgb, u_rodWeights);
        }
        
        vec3 reconstructFishVision(vec2 fishCones, float rodResponse) {
          vec3 coneRgb = vec3(
            fishCones.x * 0.75 + fishCones.y * 0.25,
            fishCones.x * 0.15 + fishCones.y * 0.85,
            fishCones.x * 0.05 + fishCones.y * 0.45
          );
          
          vec3 rodRgb = vec3(rodResponse);
          return mix(coneRgb, rodRgb, u_rodBlend);
        }
        
        vec3 adjustSaturation(vec3 rgb, float saturation) {
          float luminance = dot(rgb, vec3(0.299, 0.587, 0.114));
          return mix(vec3(luminance), rgb, saturation);
        }
        
        vec3 addBackscatter(vec3 rgb, float depth, float intensity) {
          float hazeFactor = min(depth / 30.0, 1.0) * intensity * 0.15;
          vec3 hazeColor = vec3(0.4, 0.5, 0.6);
          return mix(rgb, hazeColor, hazeFactor);
        }
        
        void main() {
          vec4 texel = texture2D(u_image, v_texCoord);
          vec3 rgb = texel.rgb;
          
          vec3 linearRgb = srgbToLinear(rgb);
          vec3 attenuatedRgb = applyUnderwaterAttenuation(linearRgb, u_depth, u_kValues, u_salinity);
          
          vec2 fishCones = rgbToFishResponse(attenuatedRgb);
          float rodResponse = calculateRodResponse(attenuatedRgb);
          
          vec3 fishRgb = reconstructFishVision(fishCones, rodResponse);
          fishRgb = adjustSaturation(fishRgb, u_saturation);
          fishRgb = addBackscatter(fishRgb, u_depth, u_backscatter);
          
          vec3 finalRgb = linearToSrgb(fishRgb);
          gl_FragColor = vec4(finalRgb, texel.a);
        }
      `;
    }
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(type);
    
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      console.error(`Shader compilation error: ${error}`);
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  private setupGeometry() {
    const gl = this.gl;

    // Full-screen quad vertices
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ]);

    // Texture coordinates
    const texCoords = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
    ]);

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  }

  /**
   * Process an image using WebGL shaders
   */
  async processImage(imageData: ImageData, params: SimulationParams): Promise<ImageData> {
    if (!this.program) {
      throw new Error('WebGL not initialized');
    }

    const gl = this.gl;
    const { width, height } = imageData;

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;
    gl.viewport(0, 0, width, height);

    // Create and upload texture
    if (!this.texture) {
      this.texture = gl.createTexture();
    }
    
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Use shader program
    gl.useProgram(this.program);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    this.setUniforms(params);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Read pixels
    const pixels = new Uint8ClampedArray(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    return new ImageData(pixels, width, height);
  }

  private setUniforms(params: SimulationParams) {
    const gl = this.gl;
    if (!this.program) return;

    // Texture
    gl.uniform1i(gl.getUniformLocation(this.program, 'u_image'), 0);

    // Simulation parameters
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_depth'), params.depth);
    gl.uniform3f(gl.getUniformLocation(this.program, 'u_kValues'), 
      params.waterProperties.clarity.kR, params.waterProperties.clarity.kG, params.waterProperties.clarity.kB);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_salinity'), params.waterProperties.salinity);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_rodBlend'), params.lightCondition.rodBlend);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_saturation'), params.lightCondition.saturation);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_backscatter'), params.backscatter ? 1.0 : 0.0);
    gl.uniform3f(gl.getUniformLocation(this.program, 'u_rodWeights'), 0.15, 0.75, 0.35);
  }

  dispose() {
    const gl = this.gl;
    if (this.program) gl.deleteProgram(this.program);
    if (this.vertexBuffer) gl.deleteBuffer(this.vertexBuffer);
    if (this.texCoordBuffer) gl.deleteBuffer(this.texCoordBuffer);
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
  }
}