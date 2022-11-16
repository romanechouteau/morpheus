import { Raycaster, Vector2 } from 'three'

import { lerp } from 'three/src/math/MathUtils'

const LERP_FACTOR = 0.13

export default class DragDropController {
  constructor ({ container, mouse, store, camera }) {
    this.mouse = mouse
    this.store = store
    this.camera = camera
    this.container = container

    this.active = false
    this.dragging = false
    this.raycaster = new Raycaster()
    this.pointer = new Vector2()
  }

  start () {
    window.addEventListener('mousedown', this.handleMouseDown)
    this.active = true
  }

  stop () {
    window.removeEventListener('mousedown', this.handleMouseDown)
    this.dragging = false
    this.active = false
  }

  handleMouseDown = () => {
    this.pointer.set(this.mouse.xCoords, this.mouse.yCoords)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersects = this.raycaster.intersectObjects(this.container.children)

    if (intersects.length > 0) {
      this.dragging = true
      window.addEventListener('mouseup', this.handleMouseUp)
    }
  }

  handleMouseUp = () => {
    this.dragging = false
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  resize (height, windowHeight) {
    this.height = height
    this.windowHeight = windowHeight

    this.targetY = this.container.position.y
  }

  updateTarget () {
    this.targetY = Math.min(this.mouse.yCoords * (this.windowHeight * 0.5), this.windowHeight * 0.5)
  }

  checkPosition () {
    if (this.destinationY === undefined) { return null }

    if ((this.container.position.y - this.height * 0.5) < this.destinationY) {
      this.dragging = false
      this.active = false
      this.store.commit('incrementStep')
    }
  }

  update () {
    if (!this.active) { return null }

    if (this.dragging) {
      this.updateTarget()
    }

    this.container.position.y = lerp(this.container.position.y, this.targetY, LERP_FACTOR)

    this.checkPosition()
  }
}
