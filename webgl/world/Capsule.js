import gsap from 'gsap'
import { Object3D, AnimationMixer, LoopPingPong, Clock } from 'three'

import DragDropController from '../utils/DragDropController'
import DragRotateController from '../utils/DragRotateController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { getObjectSizeData } from '../../tools/sizing'
import materials from './Materials'
import { GLTF_SCALE } from '.'

export default class Capsule {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse
    this.clock = new Clock()

    this.top = false
    this.hide = true
    this.customY = false
    this.container = new Object3D()
  }

  async load () {
    this.gltf = await loadGltf('webgl/capsule.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.container.scale.set(GLTF_SCALE, GLTF_SCALE, GLTF_SCALE)
    this.container.add(this.gltf.scene)

    materials.setMaterials(this.gltf.scene.children[0])

    this.mixer = new AnimationMixer(this.gltf.scene)
    const animation = this.gltf.animations[0]
    this.animation = this.mixer.clipAction(animation)
    this.animation.loop = LoopPingPong
    this.animation.repetitions = 2

    this.dragRotateController = new DragRotateController({
      container: this.container,
      mouse: this.mouse
    })

    this.dragDropController = new DragDropController({
      container: this.container,
      camera: this.webgl.camera,
      mouse: this.mouse,
      store: this.webgl.store
    })

    gsap.to(this.container.position, {
      y: 0,
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.hide = false
        this.dragRotateController.start()
        setTimeout(() => {
          this.animation.play()
        }, 500)
      }
    })
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    this.height = sizeData.height
    const windowHeight = sizeData.windowHeight
    this.topPosition = windowHeight / 2 - this.height * 0.75
    const hidePosition = windowHeight / 2 + this.height

    this.dragDropController.resize(this.height, windowHeight)

    if (!this.customY) {
      this.container.position.y = this.hide ? hidePosition : this.top ? this.topPosition : 0
    }
  }

  render () {
    if (this.dragRotateController) { this.dragRotateController.update() }
    if (this.dragDropController) { this.dragDropController.update() }
    if (this.mixer) { this.mixer.update(this.clock.getDelta()) }
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
          duration: 2,
          ease: 'power2.inOut'
        })
        .to(this.container.position, {
          y: this.topPosition,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            this.dragDropController.updateBasePosition()
            this.customY = true
          }
        }, '0')
    } else if (val === STEPS.MORPHEUS) {
      const current = this.container.position.y
      gsap.to(this.container.position, {
        y: current - this.height * 0.28,
        duration: 1,
        delay: 0.6,
        ease: 'linear'
      })
    }
  }
}
