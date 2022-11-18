import gsap from 'gsap'
import { AnimationMixer, Object3D, Clock, LoopOnce } from 'three'

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
    this.clock = new Clock()
    this.capsule = capsule

    this.container = new Object3D()
    this.show = false

    this.screen = new Screen({ webgl: this.webgl })
    this.container.add(this.screen.container)
  }

  async load () {
    this.gltf = await loadGltf('webgl/morpheus.gltf', this.webgl.dracoLoader)
    await this.screen.load()
  }

  init () {
    this.container.scale.set(GLTF_SCALE * 1.08, GLTF_SCALE * 1.08, GLTF_SCALE * 1.08)
    this.container.position.x = -0.035
    this.container.add(this.gltf.scene)

    materials.setMaterials(this.gltf.scene.children[0])

    this.mixer = new AnimationMixer(this.gltf.scene)
    const animation = this.gltf.animations[0]
    this.animation = this.mixer.clipAction(animation)
    this.animation.loop = LoopOnce
    this.animation.clampWhenFinished = true

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

  handleFirstAnim = () => {
    this.capsule.dragDropController.start()
    this.mixer.removeEventListener('finished', this.handleFirstAnim)
  }

  handleLastAnim = () => {
    this.screen.startFade()
    this.mixer.removeEventListener('finished', this.handleLastAnim)
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
            this.animation.play()
            this.capsule.dragDropController.destination = this.container.position.y + this.height * 0.25
            this.mixer.addEventListener('finished', this.handleFirstAnim)
          }
        })
        .to(this.container.rotation, {
          y: -Math.PI / 2.5,
          duration: 2,
          ease: 'power2.inOut'
        }, '0')
    } else if (val === STEPS.MORPHEUS) {
      this.animation.paused = false
      this.animation.timeScale = -1
      this.animation.play()
      this.mixer.addEventListener('finished', this.handleLastAnim)
    }
  }

  render () {
    if (this.screen) { this.screen.render() }
    if (this.mixer) { this.mixer.update(this.clock.getDelta()) }
  }
}
