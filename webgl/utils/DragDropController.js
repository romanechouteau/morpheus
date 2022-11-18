import { Raycaster, Vector2 } from 'three'

import { lerp } from 'three/src/math/MathUtils'

const LERP_FACTOR = 0.13

export default class DragDropController {
  constructor ({ container, mouse, store, camera, isHorizontal, handleFirstDrag }) {
    this.mouse = mouse
    this.store = store
    this.camera = camera
    this.container = container
    this.isHorizontal = isHorizontal
    this.handleFirstDrag = handleFirstDrag

    this.active = false
    this.dragging = false
    this.hasDragged = false
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

      if (this.hasDragged === false) {
        this.hasDragged = true
        if (this.handleFirstDrag) {
          this.handleFirstDrag()
        }
      }
    }
  }

  handleMouseUp = () => {
    this.dragging = false
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  resize (size, windowSize) {
    this.size = size
    this.windowSize = windowSize
    this.updateBasePosition()
  }

  updateBasePosition () {
    this.target = this.isHorizontal ? this.container.position.x : this.container.position.y
  }

  updateTarget () {
    const coord = this.isHorizontal ? this.mouse.xCoords : this.mouse.yCoords
    this.target = this.isHorizontal
      ? Math.max(coord * (this.windowSize * 0.5), -this.windowSize * 0.5)
      : Math.min(coord * (this.windowSize * 0.5), this.windowSize * 0.5)
  }

  checkPosition () {
    if (this.destination === undefined || this.active === false) { return null }

    if (
      (!this.isHorizontal && this.container.position.y - this.size * 0.5 < this.destination) ||
      (this.isHorizontal && this.container.position.x > this.destination)
    ) {
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

    if (this.isHorizontal) {
      this.container.position.x = lerp(this.container.position.x, this.target, LERP_FACTOR)
    } else {
      this.container.position.y = lerp(this.container.position.y, this.target, LERP_FACTOR)
    }

    this.checkPosition()
  }
}
