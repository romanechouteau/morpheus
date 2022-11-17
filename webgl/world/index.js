import gsap from 'gsap'
import { Object3D, AmbientLight } from 'three'

import { STEPS } from '../../store'
import { getObjectSizeData } from '../../tools/sizing'
import Chip from './Chip'
import Human from './Human'
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
    this.setChip()
    this.setHuman()
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

  setChip () {
    this.chip = new Chip({
      webgl: this.webgl,
      mouse: this.mouse
    })

    this.container.add(this.chip.container)
  }

  setHuman () {
    this.human = new Human({
      webgl: this.webgl,
      mouse: this.mouse,
      chip: this.chip
    })

    this.container.add(this.human.container)
  }

  load () {
    return Promise.all([
      this.capsule.load(),
      this.machine.load(),
      this.chip.load(),
      this.human.load()
    ]).then(() => this.onLoaded())
  }

  onLoaded () {
    this.init()
    this.resize()
  }

  render () {
    if (this.capsule) { this.capsule.render() }
    if (this.chip) { this.chip.render() }
  }

  resize () {
    if (this.capsule) { this.capsule.resize() }
    if (this.machine) { this.machine.resize() }
    if (this.human) { this.human.resize() }
    if (this.chip) { this.chip.resize() }

    if (this.machineContainer) {
      const sizeData = getObjectSizeData(this.webgl.camera, this.machineContainer)
      this.machineHidePosition = sizeData.windowWidth / 2 + sizeData.width
      this.machineContainer.position.x = this.hideMachine ? this.machineHidePosition : 0
    }
  }

  init () {
    if (this.capsule) { this.capsule.init() }
    if (this.machine) { this.machine.init() }
    if (this.human) { this.human.init() }
    if (this.chip) { this.chip.init() }
  }

  handleStep (val) {
    if (this.capsule) { this.capsule.handleStep(val) }
    if (this.machine) { this.machine.handleStep(val) }
    if (this.chip) { this.chip.handleStep(val) }
    if (this.human) { this.human.handleStep(val) }

    if (val === STEPS.CHIP) {
      this.hideMachine = true
      gsap.to(this.machineContainer.position, {
        x: this.machineHidePosition,
        duration: 1,
        ease: 'power2.inOut'
      })
    } else if (val === STEPS.CHIP_DEPLOY) {
      gsap.timeline()
        .to(this.camera.position, {
          x: this.human.container.position.x,
          z: 6,
          duration: 2,
          ease: 'power2.inOut'
        })
    }
  }
}
