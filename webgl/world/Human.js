import gsap from 'gsap'
import { Object3D } from 'three'

import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Human {
  constructor ({ webgl, mouse, chip }) {
    this.webgl = webgl
    this.mouse = mouse
    this.chip = chip

    this.container = new Object3D()
    this.show = false
  }

  async load () {
    this.gltf = await loadGltf('webgl/human.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.container.scale.set(0.08, 0.08, 0.08)
    this.container.add(this.gltf.scene)

    this.container.rotation.y = -Math.PI
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    const height = sizeData.height
    const windowHeight = sizeData.windowHeight
    const windowWidth = sizeData.windowWidth

    const half = windowHeight / 2
    const hidePosition = -half - height
    this.showPosition = 0

    this.container.position.y = this.show ? this.showPosition : hidePosition
    this.container.position.x = windowWidth * 0.25
    this.chip.dragDropController.destination = this.container.position.x
  }

  handleStep (val) {
    if (val === STEPS.CHIP_MOVE) {
      this.show = true
      gsap.timeline()
        .to(this.container.position, {
          y: this.showPosition,
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(this.container.rotation, {
          y: 0,
          duration: 1,
          ease: 'power2.inOut'
        }, '0')
    }
  }
}
