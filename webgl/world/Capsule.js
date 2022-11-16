import gsap from 'gsap'
import { MeshNormalMaterial, Object3D } from 'three'

import DragController from '../utils/DragController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/ModelLoader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Capsule {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.top = false
    this.container = new Object3D()
    this.dragDrop = false
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

    this.resize()
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    this.width = sizeData.width
    this.height = sizeData.height
    this.windowWidth = sizeData.windowWidth
    this.windowHeight = sizeData.windowHeight

    const half = this.windowHeight / 2
    this.basePosition = 0
    this.topPosition = half - this.height

    this.container.position.y = this.top ? this.topPosition : this.basePosition
  }

  render () {
    if (this.dragController) { this.dragController.update() }
  }

  handleStep (val) {
    if (val === STEPS.PLUG_CAPSULE) {
      this.top = true
      this.dragController.stop()

      gsap.timeline()
        .to(this.container.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power2.out'
        })
        .to(this.container.position, {
          y: this.topPosition,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => {
            this.dragDrop = true
          }
        }, '0')
    }
  }
}