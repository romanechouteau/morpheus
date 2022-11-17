import gsap from 'gsap'
import { MeshNormalMaterial, Object3D } from 'three'

import { STEPS } from '../../store'
import { loadGltf } from '../../tools/ModelLoader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Machine {
  constructor ({ webgl, mouse, capsule }) {
    this.webgl = webgl
    this.mouse = mouse
    this.capsule = capsule

    this.container = new Object3D()
    this.show = false
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.gltf.scene.children[0].material = new MeshNormalMaterial()
    this.container.add(this.gltf.scene)

    this.container.rotation.y = -Math.PI
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    const height = sizeData.height
    const windowHeight = sizeData.windowHeight

    const half = windowHeight / 2
    const hidePosition = -half - height
    this.showPosition = -half + height

    this.container.position.y = this.show ? this.showPosition : hidePosition
    this.capsule.dragDropController.destination = this.container.position.y
  }

  handleStep (val) {
    if (val === STEPS.PLUG_CAPSULE) {
      this.show = true
      gsap.timeline()
        .to(this.container.position, {
          y: this.showPosition,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            this.capsule.dragDropController.destination = this.container.position.y
          }
        })
        .to(this.container.rotation, {
          y: 0,
          duration: 1,
          ease: 'power2.inOut'
        }, '0')
    }
  }
}
