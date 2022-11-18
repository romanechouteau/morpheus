precision highp float;

uniform float uFade;

varying vec2 vUv;

void main() {
  vec3 blackColor = vec3(0.13, 0.13, 0.13);
  vec3 whiteColor = vec3(0.9, 0.9, 0.9);

  float dist = distance(vUv, vec2(0.5, 0.5));
  vec3 white = whiteColor * (1. - dist);

  vec3 color = mix(blackColor, white, uFade);

  gl_FragColor = vec4(color.rgb, 1.);
}