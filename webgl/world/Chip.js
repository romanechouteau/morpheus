import gsap from 'gsap'
import { Object3D } from 'three'

import DragDropController from '../utils/DragDropController'
import DragRotateController from '../utils/DragRotateController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { getObjectSizeData } from '../../tools/sizing'
import materials from './Materials'
import { GLTF_SCALE } from '.'

const SHOW_SCALE = 4
const NORMAL_SCALE = 1.5

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
    this.gltf = await loadGltf('webgl/chip.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.container.scale.set(GLTF_SCALE * SHOW_SCALE, GLTF_SCALE * SHOW_SCALE, GLTF_SCALE * SHOW_SCALE)
    this.container.add(this.gltf.scene)

    materials.setMaterials(this.gltf.scene)

    this.dragRotateController = new DragRotateController({
      container: this.container,
      mouse: this.mouse,
      id: 'chip'
    })

    this.dragDropController = new DragDropController({
      container: this.container,
      camera: this.webgl.camera,
      mouse: this.mouse,
      store: this.webgl.store,
      isHorizontal: true
    })
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    const hidePosition = -sizeData.windowWidth / 2 - sizeData.width
    this.leftPosition = -sizeData.windowWidth * 0.25

    const chipData = getObjectSizeData(this.webgl.camera, this.container)

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
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
          this.dragRotateController.start()
        }
      })
    } else if (val === STEPS.CHIP_MOVE) {
      this.dragRotateController.stop()
      this.left = true

      gsap.timeline()
        .to(this.container.scale, {
          x: GLTF_SCALE * NORMAL_SCALE,
          y: GLTF_SCALE * NORMAL_SCALE,
          z: GLTF_SCALE * NORMAL_SCALE,
          duration: 2,
          ease: 'power2.inOut'
        })
        .to(this.container.position, {
          x: this.leftPosition,
          y: 0.5,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            this.dragDropController.updateBasePosition()
          }
        }, '0')
        .to(this.container.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            this.dragDropController.start()
          }
        }, '0')
    } else if (val === STEPS.CHIP_DEPLOY) {
      gsap.to(this.container.position, {
        z: -1,
        duration: 2,
        ease: 'power2.inOut'
      })
    }
  }
}
