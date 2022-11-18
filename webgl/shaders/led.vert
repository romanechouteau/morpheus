void main() {
   gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xyz, 1.0 );
}