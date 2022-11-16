import gsap from 'gsap'
import { MeshNormalMaterial, Object3D } from 'three'

import { STEPS } from '../../store'
import { loadGltf } from '../../tools/ModelLoader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Machine {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.container = new Object3D()
    this.show = false
  }

  async load () {
    this.gltf = await loadGltf('webgl/test.gltf', this.webgl.dracoLoader)
    this.init()
  }

  init () {
    this.gltf.scene.children[0].material = new MeshNormalMaterial()
    this.container.add(this.gltf.scene)

    this.container.rotation.y = -Math.PI

    this.resize()
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    this.width = sizeData.width
    this.height = sizeData.height
    this.windowWidth = sizeData.windowWidth
    this.windowHeight = sizeData.windowHeight

    const half = this.windowHeight / 2
    this.hidePosition = -half - this.height
    this.showPosition = -half + this.height

    this.container.position.y = this.show ? this.showPosition : this.hidePosition
  }

  handleStep (val) {
    if (val === STEPS.PLUG_CAPSULE) {
      this.show = true
      gsap.timeline()
        .to(this.container.position, {
          y: this.showPosition,
          duration: 1,
          ease: 'power2.out'
        })
        .to(this.container.rotation, {
          y: 0,
          duration: 1,
          ease: 'power2.out'
        }, '0')
    }
  }
}
