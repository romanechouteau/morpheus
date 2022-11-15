import { BoxGeometry, Mesh, MeshNormalMaterial, Object3D, AmbientLight } from 'three'

export default class World {
  constructor ({ webgl, camera, mouse }) {
    this.mouse = mouse
    this.webgl = webgl
    this.camera = camera

    this.container = new Object3D()

    this.setLight()
    this.setCube()
  }

  setLight () {
    this.light = new AmbientLight(0xEEEEEE)

    this.container.add(this.light)
  }

  setCube () {
    const geometry = new BoxGeometry(2, 2)
    const material = new MeshNormalMaterial()

    this.cube = new Mesh(geometry, material)
    this.container.add(this.cube)
  }

  render () {
    // actions to do each tick
  }
}
