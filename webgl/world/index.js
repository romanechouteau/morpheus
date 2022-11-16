import { Object3D, AmbientLight } from 'three'
import Capsule from './Capsule'
import Machine from './Machine'

export default class World {
  constructor ({ webgl, camera, mouse }) {
    this.mouse = mouse
    this.webgl = webgl
    this.camera = camera

    this.container = new Object3D()

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

    this.container.add(this.capsule.container)
  }

  setMachine () {
    this.machine = new Machine({
      webgl: this.webgl,
      mouse: this.mouse
    })

    this.container.add(this.machine.container)
  }

  load () {
    return Promise.all([
      this.capsule.load(),
      this.machine.load()
    ])
  }

  render () {
    if (this.capsule) { this.capsule.render() }
  }

  resize () {
    if (this.capsule) { this.capsule.resize() }
    if (this.machine) { this.machine.resize() }
  }

  handleStep (val) {
    if (this.capsule) { this.capsule.handleStep(val) }
    if (this.machine) { this.machine.handleStep(val) }
  }
}
