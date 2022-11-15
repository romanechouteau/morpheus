export default class Mouse {
  constructor ({ width, height }) {
    this.x = 0
    this.y = 0
    this.xCoords = 0
    this.yCoords = 0
    this.width = width
    this.height = height

    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  onMouseMove (evt) {
    this.x = evt.clientX
    this.y = evt.clientY
    this.xCoords = evt.clientX / this.width * 2 - 1
    this.yCoords = 1 - evt.clientY / this.height * 2
  }
}
