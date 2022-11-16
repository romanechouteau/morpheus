import { Object3D, Quaternion } from 'three'
import { lerp } from 'three/src/math/MathUtils'

const ROTATE_FACTOR = 1
const LERP_FACTOR = 0.13

const BASE_QUAT = new Quaternion()
const DUMMY_QUAT = new Quaternion()
const QUAT = new Quaternion()

export default class DragRotateController {
  constructor ({ container, mouse }) {
    this.mouse = mouse
    this.container = container

    this.dummy = new Object3D()
    this.started = false
    this.dragging = false
    this.startMousePos = { x: 0, y: 0 }
    this.targetRotation = { x: 0, y: 0 }
  }

  start () {
    window.addEventListener('mousedown', this.handleMouseDown)
    this.started = true
  }

  stop () {
    window.removeEventListener('mousedown', this.handleMouseDown)
    this.dragging = false
    this.started = false
  }

  handleMouseDown = () => {
    this.dragging = true
    this.startMousePos = {
      x: this.mouse.xCoords,
      y: this.mouse.yCoords
    }

    BASE_QUAT.setFromEuler(this.container.rotation)
    this.dummy.rotation.set(0, 0, 0)

    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.dragging = false
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  updateTarget () {
    this.targetRotation = {
      x: (this.mouse.yCoords - this.startMousePos.y) * ROTATE_FACTOR * -1,
      y: (this.mouse.xCoords - this.startMousePos.x) * ROTATE_FACTOR
    }
  }

  update () {
    if (!this.started) { return null }

    if (this.dragging) {
      this.updateTarget()
    }

    this.dummy.rotation.set(
      lerp(this.dummy.rotation.x, this.targetRotation.x, LERP_FACTOR),
      lerp(this.dummy.rotation.y, this.targetRotation.y, LERP_FACTOR),
      0
    )
    DUMMY_QUAT.setFromEuler(this.dummy.rotation)
    QUAT.multiplyQuaternions(DUMMY_QUAT, BASE_QUAT)

    this.container.rotation.setFromQuaternion(QUAT)
  }
}
