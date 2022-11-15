import { WebGLRenderer, sRGBEncoding, PerspectiveCamera, Scene } from 'three'

import Mouse from '~/webgl/utils/Mouse'
import World from '~/webgl/world/index'

export default class Webgl {
  constructor ({ canvas }) {
    this.width = 0
    this.height = 0
    this.canvas = canvas
    this.hasFocus = true
    this.pixelRatio = this.getPixelRatio()

    this.resize(window.innerWidth, window.innerHeight)
    this.setRenderer()
    this.setCamera()
    this.setMouse()
    this.setWorld()

    window.addEventListener('resize', this.resize)
  }

  setRenderer () {
    this.scene = new Scene()

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.setClearColor(0x000000, 1.0)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setSize(this.width, this.height)
  }

  setCamera () {
    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000)
    this.camera.position.set(0, 0, 10)
    this.scene.add(this.camera)
  }

  setMouse () {
    this.mouse = new Mouse({ width: this.width, height: this.height })
  }

  setWorld () {
    this.world = new World({
      webgl: this.webgl,
      camera: this.camera,
      mouse: this.mouse
    })
    this.scene.add(this.world.container)
  }

  resize = (width, height) => {
    this.width = width
    this.height = height
    if (this.camera) {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
    }
    if (this.mouse) {
      this.mouse.width = this.width
      this.mouse.height = this.height
    }
    if (this.renderer) {
      this.renderer.setSize(this.width, this.height)
    }
  }

  getPixelRatio () {
    return Math.min(window.devicePixelRatio || 1, 2)
  }

  render = () => {
    requestAnimationFrame(this.render)
    if (this.world) { this.world.render() }
    if (this.hasFocus && this.scene && this.camera && this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }
}