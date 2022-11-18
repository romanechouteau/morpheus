precision highp float;

uniform float uFade;

void main() {
  vec3 blackColor = vec3(0.13, 0.13, 0.13);
  vec3 whiteColor = vec3(0.9, 0.9, 0.9);

  vec3 color = mix(blackColor, whiteColor, uFade + 1.);

  gl_FragColor = vec4(color.rgb, 1.);
}