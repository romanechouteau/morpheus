import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three'

export const loadGltf = (src, dracoLoader) => {
  return new Promise((resolve) => {
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load(
      src,
      (loaded) => { resolve(loaded) }
    )
  })
}

export const loadTexture = (src) => {
  return new Promise((resolve) => {
    const textureLoader = new TextureLoader()
    textureLoader.load(
      src,
      (loaded) => { resolve(loaded) }
    )
  })
}
