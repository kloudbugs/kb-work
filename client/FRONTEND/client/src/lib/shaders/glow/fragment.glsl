uniform float time;
uniform vec3 color;
uniform float pulseSpeed;
uniform float glowIntensity;
uniform vec2 resolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Calculate the basic fresnel effect based on viewing angle
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));
  fresnel = pow(fresnel, 3.0) * 1.5;
  
  // Add animated glow pulsation
  float glowPulse = sin(time * pulseSpeed) * 0.5 + 0.5;
  
  // Calculate radial glow emanating from center
  float dist = length(vPosition) / 2.0;
  float radialGlow = 1.0 - smoothstep(0.0, 1.0, dist);
  
  // Combine all effects
  float glow = fresnel + radialGlow * glowPulse;
  
  // Add noise-like pattern for visual richness
  float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233)) * 43758.5453) * time * 0.1);
  glow += noise * 0.1;
  
  // Apply the final color with glow
  vec3 finalColor = color * glow * glowIntensity;
  gl_FragColor = vec4(finalColor, glow * 0.6);
}