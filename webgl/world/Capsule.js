import gsap from 'gsap'
import { MeshNormalMaterial, Object3D } from 'three'

import DragDropController from '../utils/DragDropController'
import DragRotateController from '../utils/DragRotateController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/ModelLoader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Capsule {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.top = false
    this.customY = false
    this.container = new Object3D()
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
    this.init()
  }

  init () {
    this.gltf.scene.children[0].material = new MeshNormalMaterial()
    this.container.add(this.gltf.scene)

    this.dragRotateController = new DragRotateController({
      container: this.container,
      mouse: this.mouse
    })
    this.dragRotateController.start()

    this.dragDropController = new DragDropController({
      container: this.container,
      camera: this.webgl.camera,
      mouse: this.mouse,
      store: this.webgl.store
    })
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    this.width = sizeData.width
    this.height = sizeData.height
    this.windowWidth = sizeData.windowWidth
    this.windowHeight = sizeData.windowHeight

    this.basePosition = 0
    this.topPosition = this.windowHeight / 2 - this.height

    this.dragDropController.resize(this.height, this.windowHeight)

    if (!this.customY) {
      this.container.position.y = this.top ? this.topPosition : this.basePosition
    }
  }

  render () {
    if (this.dragRotateController) { this.dragRotateController.update() }
    if (this.dragDropController) { this.dragDropController.update() }
  }

  handleStep (val) {
    if (val === STEPS.PLUG_CAPSULE) {
      this.top = true
      this.dragRotateController.stop()

      gsap.timeline()
        .to(this.container.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(this.container.position, {
          y: this.topPosition,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            this.dragDropController.resize(this.height, this.windowHeight)
            this.dragDropController.start()
            this.customY = true
          }
        }, '0')
    }
  }
}
