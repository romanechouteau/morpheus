import { Object3D } from 'three'
import { loadGltf } from '../../tools/ModelLoader'

export default class Capsule {
  constructor ({ webgl }) {
    this.webgl = webgl

    this.container = new Object3D()
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
    this.container.add(this.gltf.scene)
  }
}
