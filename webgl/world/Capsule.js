import { MeshNormalMaterial, Object3D } from 'three'

import DragController from '../utils/DragController'
import { loadGltf } from '../../tools/ModelLoader'

export default class Capsule {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.container = new Object3D()
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
    this.init()
  }

  init () {
    this.gltf.scene.children[0].material = new MeshNormalMaterial()
    this.container.add(this.gltf.scene)

    this.dragController = new DragController({
      container: this.container,
      mouse: this.mouse
    })
    this.dragController.start()
  }

  render () {
    if (this.dragController) { this.dragController.update() }
  }
}
