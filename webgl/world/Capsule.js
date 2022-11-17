import gsap from 'gsap'
import { MeshPhongMaterial, Object3D } from 'three'

import DragDropController from '../utils/DragDropController'
import DragRotateController from '../utils/DragRotateController'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { getObjectSizeData } from '../../tools/sizing'

export default class Capsule {
  constructor ({ webgl, mouse }) {
    this.webgl = webgl
    this.mouse = mouse

    this.top = false
    this.hide = true
    this.customY = false
    this.container = new Object3D()
  }

  async load () {
    this.gltf = await loadGltf('webgl/capsule.gltf', this.webgl.dracoLoader)
  }

  init () {
    this.container.scale.set(0.08, 0.08, 0.08)
    this.container.add(this.gltf.scene)

    this.setMaterials()

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

    gsap.to(this.container.position, {
      y: 0,
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.hide = false
      }
    })
  }

  setMaterials () {
    const base = this.gltf.scene.children[0]
    const whiteMaterial = new MeshPhongMaterial({
      color: 0xFFFFFF
    })
    const blackMaterial = new MeshPhongMaterial({
      color: 0x333333
    })

    for (let i = 0; i < base.children.length; i++) {
      const group = base.children[i]

      this.setMaterial(group, group.name === 'etiquette' ? whiteMaterial : blackMaterial)
    }
  }

  setMaterial (element, material) {
    if (element.type === 'Mesh') {
      element.material = material
    }
    if (element.children && element.children.length > 0) {
      element.children.forEach((object) => {
        this.setMaterial(object, material)
      })
    }
  }

  resize () {
    const sizeData = getObjectSizeData(this.webgl.camera, this.container)

    const height = sizeData.height
    const windowHeight = sizeData.windowHeight
    this.topPosition = windowHeight / 2 - height * 0.75
    const hidePosition = windowHeight / 2 + height

    this.dragDropController.resize(height, windowHeight)

    if (!this.customY) {
      this.container.position.y = this.hide ? hidePosition : this.top ? this.topPosition : 0
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
            this.dragDropController.updateBasePosition()
            this.dragDropController.start()
            this.customY = true
          }
        }, '0')
    }
  }
}
