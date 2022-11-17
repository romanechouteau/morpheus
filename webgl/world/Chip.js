import gsap from 'gsap'
import { MeshNormalMaterial, Object3D, Vector3 } from 'three'

import DragDropController from '../utils/DragDropController'
import DragRotateController from '../utils/DragRotateController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/ModelLoader'
import { getObjectSizeData } from '../../tools/sizing'

const VEC3 = new Vector3()

export default class Chip {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.container = new Object3D()
    this.hide = true
    this.showPosition = 0
    this.customX = false
    this.left = false
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.gltf.scene.children[0].material = new MeshNormalMaterial()
    this.chipContainer = this.gltf.scene
    this.container.add(this.gltf.scene)

    this.dragRotateController = new DragRotateController({
      container: this.container,
      mouse: this.mouse,
      id: 'chip'
    })

    this.dragDropController = new DragDropController({
      container: this.chipContainer,
      camera: this.webgl.camera,
      mouse: this.mouse,
      store: this.webgl.store,
      isHorizontal: true,
      handleFirstDrag: this.handleFirstDrag
    })
  }

  handleFirstDrag = () => {
    this.chipContainer.getWorldPosition(VEC3)
    this.webgl.world.container.add(this.chipContainer)
    this.chipContainer.position.copy(VEC3)
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    const hidePosition = -sizeData.windowWidth / 2 - sizeData.width
    this.leftPosition = -sizeData.windowWidth * 0.25

    const chipData = getObjectSizeData(this.webgl.camera, this.chipContainer)

    this.dragDropController.resize(chipData.width, chipData.windowWidth)

    if (!this.customX) {
      this.container.position.x = this.hide
        ? hidePosition
        : this.left ? this.leftPosition : 0
    }
  }

  render () {
    if (this.dragRotateController) { this.dragRotateController.update() }
    if (this.dragDropController) { this.dragDropController.update() }
  }

  handleStep (val) {
    if (val === STEPS.CHIP) {
      this.hide = false
      gsap.to(this.container.position, {
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          this.dragRotateController.start()
        }
      })
    } else if (val === STEPS.CHIP_MOVE) {
      this.dragRotateController.stop()

      gsap.timeline()
        .to(this.container.position, {
          x: this.leftPosition,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(this.container.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            this.dragDropController.start()
          }
        }, '0')
    }
  }
}
