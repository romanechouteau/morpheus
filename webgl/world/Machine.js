import gsap from 'gsap'
import { Object3D } from 'three'

import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { getObjectSizeData } from '../../tools/sizing'
import materials from './Materials'
import Screen from './Screen'
import { GLTF_SCALE } from '.'

export default class Machine {
  constructor ({ webgl, mouse, capsule }) {
    this.webgl = webgl
    this.mouse = mouse
    this.capsule = capsule

    this.container = new Object3D()
    this.show = false

    this.screen = new Screen({ webgl: this.webgl })
    // this.container.add(this.screen.container)
    this.webgl.scene.add(this.screen.container)
  }

  async load () {
    this.gltf = await loadGltf('webgl/morpheus.gltf', this.webgl.dracoLoader)
    await this.screen.load()
  }

  init () {
    this.container.scale.set(GLTF_SCALE * 1.03, GLTF_SCALE * 1.03, GLTF_SCALE * 1.03)
    this.container.position.x = -0.035
    this.container.add(this.gltf.scene)

    materials.setMaterials(this.gltf.scene.children[0])

    this.screen.init()

    this.container.rotation.y = -Math.PI * 2
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    this.height = sizeData.height
    const windowHeight = sizeData.windowHeight

    const half = windowHeight / 2
    const hidePosition = -half - this.height
    this.showPosition = -half + this.height * 0.5

    this.container.position.y = this.show ? this.showPosition : hidePosition
    this.capsule.dragDropController.destination = this.container.position.y + this.height * 0.25
  }

  handleStep (val) {
    if (val === STEPS.PLUG_CAPSULE) {
      this.show = true
      gsap.timeline()
        .to(this.container.position, {
          y: this.showPosition,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            this.capsule.dragDropController.destination = this.container.position.y + this.height * 0.25
          }
        })
        .to(this.container.rotation, {
          y: -Math.PI / 2.5,
          duration: 2,
          ease: 'power2.inOut'
        }, '0')
    } else if (val === STEPS.MORPHEUS) {
      this.screen.startFade()
    }
  }

  render () {
    if (this.screen) { this.screen.render() }
  }
}
