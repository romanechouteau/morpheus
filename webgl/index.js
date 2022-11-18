import { WebGLRenderer, sRGBEncoding, PerspectiveCamera, Scene, Clock } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import Mouse from '~/tools/Mouse'
import World from '~/webgl/world/index'

export default class Webgl {
  constructor ({ canvas, store }) {
    this.width = 0
    this.height = 0
    this.canvas = canvas
    this.hasFocus = true
    this.isLoaded = false
    this.pixelRatio = this.getPixelRatio()
    this.store = store
    this.clock = new Clock()

    this.resize(window.innerWidth, window.innerHeight)
    this.setRenderer()
    this.setCamera()
    this.setMouse()
    this.setLoader()
    this.setWorld()

    this.load()
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
    this.renderer.setClearColor(0xFFFFFF, 1.0)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setSize(this.width, this.height)
  }

  setCamera () {
    this.camera = new PerspectiveCamera(15, this.width / this.height, 1, 1000)
    this.camera.position.set(0, 0, 35)
    this.scene.add(this.camera)
  }

  setMouse () {
    this.mouse = new Mouse({ width: this.width, height: this.height })
  }

  setLoader () {
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    this.dracoLoader.setDecoderConfig({ type: 'js' })
  }

  setWorld () {
    this.world = new World({
      webgl: this,
      camera: this.camera,
      mouse: this.mouse,
      clock: this.clock
    })
    this.scene.add(this.world.container)
  }

  async load () {
    await this.world.load()
    this.isLoaded = true
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
    if (this.world) {
      this.world.resize()
    }
  }

  getPixelRatio () {
    return Math.min(window.devicePixelRatio || 1, 2)
  }

  render = () => {
    requestAnimationFrame(this.render)
    if (!this.isLoaded) { return }
    if (this.world) { this.world.render() }
    if (this.hasFocus && this.scene && this.camera && this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  handleStep = (val) => {
    if (this.world) { this.world.handleStep(val) }
  }
}
