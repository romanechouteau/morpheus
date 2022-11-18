import gsap from 'gsap'
import {
  ClampToEdgeWrapping, Object3D, ShaderMaterial,
  UVMapping, CanvasTexture
} from 'three'

import vert from '../shaders/screen.vert'
import frag from '../shaders/screen.frag'
import { STEPS } from '../../store'
import { loadGltf } from '../../tools/Loader'
import { GLTF_SCALE } from '.'

const CANVAS_HEIGHT = 384
const CANVAS_WIDTH = 2 * CANVAS_HEIGHT

const TIME_FONT = 84
const MEDIUM_FONT = 40
const SMALL_FONT = 32
const TINY_FONT = 20

const TIME_MARGIN_TOP = 128
const INFO_MARGIN_TOP = 24
const SMALL_MARGIN_X = 8
const MEDIUM_MARGIN_X = 32

const FONT = 'input-mono,monospace'
const REGULAR = 400
const LIGHT = 300
const BOLD = 700

const ICONS = [
  {
    url: require('~/assets/injected.svg'),
    name: 'injected'
  },
  {
    url: require('~/assets/no-injection.svg'),
    name: 'no-injection'
  }
]

export default class Screen {
  constructor ({ webgl }) {
    this.webgl = webgl

    this.time = 0
    this.fade = 0
    this.date = new Date()
    this.formattedDate = ''
    this.formattedState = ''
    this.formattedTemp = '19°c'
    this.started = false
    this.container = new Object3D()
    this.styleLoaded = false
    this.icons = {}
    this.localisation = [48.864716, 2.349014]
  }

  loadIcon (data) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = data.url

      img.onload = () => {
        this.icons[data.name] = img
        resolve()
      }

      img.onerror = reject
    })
  }

  async loadModel () {
    this.gltf = await loadGltf('webgl/screen.gltf', this.webgl.dracoLoader)
  }

  load () {
    return Promise.all([
      ...ICONS.map(data => this.loadIcon(data)),
      this.loadModel()
    ])
  }

  async init () {
    this.createCanvas()
    this.createObject()
    this.started = true

    this.getLocalisation()
    this.formattedTemp = await this.formatTemp()
  }

  createObject () {
    this.screen = this.gltf.scene.children[0]
    const geomRatio = 80 / 3
    this.screenMaterial = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0.0 },
        uFade: { value: 0.0 },
        uInterface: { value: this.texture },
        uMeshRatio: { value: geomRatio },
        uInterfaceRatio: { value: CANVAS_HEIGHT / CANVAS_WIDTH },
        color1: { value: [233 / 255, 205 / 255, 133 / 255] },
        color2: { value: [210 / 255, 165 / 255, 111 / 255] },
        color3: { value: [206 / 255, 152 / 255, 121 / 255] },
        color4: { value: [214 / 255, 153 / 255, 140 / 255] }
      }
    })
    this.screen.material = this.screenMaterial

    this.container.scale.set(1 / GLTF_SCALE * 5, 1 / GLTF_SCALE * 5, 1 / GLTF_SCALE * 5)
    this.container.position.x = 2
    this.container.position.y = -5
    this.container.rotation.y = -Math.PI / 11

    this.container.add(this.screen)
  }

  createCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.width = CANVAS_WIDTH
    this.canvas.height = CANVAS_HEIGHT
    this.context = this.canvas.getContext('2d')

    this.texture = new CanvasTexture(this.canvas, UVMapping, ClampToEdgeWrapping, ClampToEdgeWrapping)
  }

  formatDate () {
    return `${this.date.getHours().toString().padStart(2, '0')}:${this.date.getMinutes().toString().padStart(2, '0')}`
  }

  getLocalisation () {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        async (data) => {
          this.localisation = [data.coords.latitude, data.coords.longitude]
          this.formattedTemp = await this.formatTemp()
        },
        () => {})
    }
  }

  async formatTemp () {
    const meteoData = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.localisation[0]}&lon=${this.localisation[1]}&appid=9ee99ca097bcd7aad431d1d1d6452685&lang=fr&units=metric`)
    const json = await meteoData.json()
    this.tempChanged = true
    return `${Math.round(json.main.temp).toString().padStart(2, '0')}°c`
  }

  formatState () {
    if (this.webgl.store.state.step > STEPS.PLUG_CAPSULE) {
      return 'INJECTED'
    }

    return 'NO INJECTION'
  }

  stateIcon () {
    if (this.webgl.store.state.step > STEPS.PLUG_CAPSULE) {
      return 'injected'
    }

    return 'no-injection'
  }

  checkStyleLoaded () {
    if (this.styleLoaded) { return null }

    const stylesheet = document.head.querySelector('#font-stylesheet')
    this.styleLoaded = Boolean(stylesheet.sheet)
  }

  drawInterface () {
    this.date = new Date()
    const formattedDate = this.formatDate()
    const formattedState = this.formatState()

    if (!this.styleLoaded ||
      (formattedDate === this.formattedDate &&
        formattedState === this.formattedState &&
        this.tempChanged === false)) { return null }

    this.formattedDate = formattedDate
    this.formattedState = formattedState
    this.tempChanged = false

    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    const top = TIME_MARGIN_TOP
    this.context.font = `${REGULAR} ${TIME_FONT}px ${FONT}`
    this.context.fillStyle = 'white'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'top'
    this.context.fillText(this.formattedDate, CANVAS_WIDTH / 2, top)
    const timeWidth = this.context.measureText(this.formattedDate).width

    this.context.font = `${LIGHT} ${SMALL_FONT}px ${FONT}`
    this.context.textAlign = 'left'
    this.context.fillStyle = 'white'
    this.context.textBaseline = 'top'
    this.context.fillText(
      this.date.getHours() < 12 ? 'AM' : 'PM', CANVAS_WIDTH / 2 + timeWidth / 2 + SMALL_MARGIN_X, top - SMALL_FONT * 0.25
    )

    this.context.font = `${REGULAR} ${MEDIUM_FONT}px ${FONT}`
    this.context.textAlign = 'right'
    this.context.fillStyle = 'white'
    this.context.textBaseline = 'top'
    this.context.fillText(
      this.formattedTemp, CANVAS_WIDTH / 2 - timeWidth / 2, top + TIME_FONT + INFO_MARGIN_TOP
    )
    const tempWidth = this.context.measureText(this.formattedTemp).width

    const injectionX = CANVAS_WIDTH / 2 + timeWidth / 2
    const injectionY = top + TIME_FONT + INFO_MARGIN_TOP + MEDIUM_FONT / 2 - TINY_FONT / 2
    this.context.font = `${BOLD} ${TINY_FONT}px ${FONT}`
    this.context.textAlign = 'right'
    this.context.fillStyle = 'white'
    this.context.textBaseline = 'top'
    this.context.fillText(
      this.formattedState, injectionX, injectionY
    )

    const icon = this.icons[this.stateIcon()]
    const width = tempWidth - MEDIUM_MARGIN_X
    const height = width * (icon.height / icon.width)
    this.context.drawImage(icon, injectionX + MEDIUM_MARGIN_X, injectionY + TINY_FONT * 0.4 - height / 2, width, height)

    this.texture.needsUpdate = true
    this.screenMaterial.uniforms.uInterface.value = this.texture
    this.screenMaterial.uniforms.uInterface.needsUpdate = true
  }

  startFade () {
    gsap.to(this, {
      fade: 1,
      duration: 3,
      ease: 'power1.inOut'
    })
  }

  render () {
    if (!this.started) { return null }

    this.time += 0.002
    this.screenMaterial.uniforms.uTime.value = this.time
    this.screenMaterial.uniforms.uTime.needsUpdate = true

    if (this.screenMaterial.uniforms.uFade.value !== this.fade) {
      this.screenMaterial.uniforms.uFade.value = this.fade
      this.screenMaterial.uniforms.uFade.needsUpdate = true
    }

    this.checkStyleLoaded()
    this.drawInterface()
  }
}
