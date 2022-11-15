import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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
