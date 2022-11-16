import gsap from 'gsap'
import { Object3D, AmbientLight } from 'three'

import { STEPS } from '../../store'
import { getObjectSizeData } from '../../tools/sizing'
import Capsule from './Capsule'
import Machine from './Machine'

export default class World {
  constructor ({ webgl, camera, mouse }) {
    this.mouse = mouse
    this.webgl = webgl
    this.camera = camera

    this.container = new Object3D()
    this.machineContainer = new Object3D()
    this.hideMachine = false
    this.machineHidePosition = 0

    this.setLight()
    this.setCapsule()
    this.setMachine()
  }

  setLight () {
    this.light = new AmbientLight(0xFFFFFF)

    this.container.add(this.light)
  }

  setCapsule () {
    this.capsule = new Capsule({
      webgl: this.webgl,
      mouse: this.mouse
    })

    this.machineContainer.add(this.capsule.container)
  }

  setMachine () {
    this.machine = new Machine({
      webgl: this.webgl,
      mouse: this.mouse,
      capsule: this.capsule
    })

    this.machineContainer.add(this.machine.container)
    this.container.add(this.machineContainer)
  }

  load () {
    return Promise.all([
      this.capsule.load(),
      this.machine.load()
    ]).then(() => this.onLoaded())
  }

  onLoaded () {
    this.resize()
  }

  render () {
    if (this.capsule) { this.capsule.render() }
  }

  resize () {
    if (this.capsule) { this.capsule.resize() }
    if (this.machine) { this.machine.resize() }

    if (this.machineContainer) {
      const sizeData = getObjectSizeData(this.webgl.camera, this.machineContainer)
      this.machineHidePosition = sizeData.windowWidth / 2 + sizeData.width
      this.machineContainer.position.x = this.hideMachine ? this.machineHidePosition : 0
    }
  }

  handleStep (val) {
    if (this.capsule) { this.capsule.handleStep(val) }
    if (this.machine) { this.machine.handleStep(val) }

    if (val === STEPS.CHIP) {
      this.hideMachine = true
      gsap.to(this.machineContainer.position, {
        x: this.machineHidePosition,
        duration: 1,
        ease: 'power2.inOut'
      })
    }
  }
}
