export const getSizeAtZ = (z, camera, cameraCustomZ) => {
  const cameraZ = cameraCustomZ || camera.position.z
  const distance = cameraZ - z

  const vFov = camera.fov * Math.PI / 180

  const finalHeight = 2 * Math.tan(vFov / 2) * distance
  const finalWidth = finalHeight * camera.aspect
  return { width: finalWidth, height: finalHeight }
}
