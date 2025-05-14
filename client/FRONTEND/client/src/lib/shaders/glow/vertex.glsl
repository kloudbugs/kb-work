uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  
  // Add subtle vertex displacement over time for visual interest
  vec3 newPosition = position + normal * sin(time * 1.5 + position.y * 5.0) * 0.03;
  
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}