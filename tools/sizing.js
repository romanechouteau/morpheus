import { Box3, Vector3 } from 'three'

export const getSizeAtZ = (z, camera, cameraCustomZ) => {
  const cameraZ = cameraCustomZ || camera.position.z
  const distance = cameraZ - z

  const vFov = camera.fov * Math.PI / 180

  const height = 2 * Math.tan(vFov / 2) * distance
  const width = height * camera.aspect
  return { width, height }
}

export const getObjectDimensions = (object) => {
  const box = new Box3().setFromObject(object)

  const size = new Vector3()
  box.getSize(size)
  const width = size.x
  const height = size.y

  return { width, height }
}

export const getObjectSizeData = (camera, object) => {
  const { width: windowWidth, height: windowHeight } = getSizeAtZ(object.position.z, camera)
  const { width, height } = getObjectDimensions(object)

  return { width, height, windowWidth, windowHeight }
}
