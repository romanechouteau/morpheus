import { Object3D, AmbientLight } from 'three'
import Capsule from './Capsule'

export default class World {
  constructor ({ webgl, camera, mouse }) {
    this.mouse = mouse
    this.webgl = webgl
    this.camera = camera

    this.container = new Object3D()

    this.setLight()
    this.setCapsule()
  }

  setLight () {
    this.light = new AmbientLight(0xFFFFFF)

    this.container.add(this.light)
  }

  setCapsule () {
    this.capsule = new Capsule({
      webgl: this.webgl
    })

    this.container.add(this.capsule.container)
  }

  load () {
    return Promise.all[
      this.capsule.load()
    ]
  }

  render () {
    // actions to do each tick
  }
}
