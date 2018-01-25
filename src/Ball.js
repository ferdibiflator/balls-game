const MSEC_IN_SEC = 1000

/**
 * Шарик, главный герой
 */
export default class Ball {
  /**
   * Конструктор. Инициализирует объект необхоимыми свойствами
   */
  constructor(context, position) {
    this.context = context
    this.radius = 30
    this.position = position
    this.isSelected = false
    this.isMoving = false
    this.moveVector = this._generateMoveVector()
    this.velocity = 300
    this.lastMoveTime = Date.now()
  }

  /**
   * Отображает шарик на игровом поле. Если он выбран, то отображает его с выделением
   */
  draw() {
    const {x, y} = this.position
    const context = this.context

    context.beginPath()
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false)
    context.fillStyle = '#12ac28'
    context.fill()

    if (this.isSelected) {
      context.strokeStyle = '#f2a205'
      context.lineWidth = 4
      context.stroke()
    }
  }

  /**
   * Производит вычисление, основанное на рассчете гипотенузы, которая будет являться расстоянием от позиции курсора
   * до позиции центра шарика.
   * И возвращает ответ, находится ли шарик в фокусе позиции курсора
   */
  isCursorFocused(cursorPosition) {
    const xLength = Math.abs(this.position.x - cursorPosition.x)
    const yLength = Math.abs(this.position.y - cursorPosition.y)
    const hypotenuse = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))

    return hypotenuse <= this.radius
  }

  /**
   * Передвинуть шар на один шаг, направление движения рассчитывается на основе его вектора движения
   */
  move(time) {
    const {x: currPosX, y: currPosY} = this.position
    const timeDelta = (time - this.lastMoveTime) / MSEC_IN_SEC
    const moveAmount = this.velocity * timeDelta

    this.position = {
      x: currPosX + moveAmount * this.moveVector.x,
      y: currPosY + moveAmount * this.moveVector.y
    }

    this.lastMoveTime = time
  }

  setPosition ({x, y}, time) {
    this.position = { x, y }
    this.lastMoveTime = time
  }

  kick({x, y}) {
    const {x: currX, y: currY} = this.moveVector

    if(x) {
      if (this._isSameDirections(x, currX)) {
        this.moveVector.x = currX + (x - currX) / 2
      } else {
        this.moveVector.x = currX + (x - currX)
      }
    }

    if(y) {
      if (y && this._isSameDirections(y, currY)) {
        this.moveVector.y = currY + (y - currY) / 2
      } else {
        this.moveVector.y = currY + (y - currY)
      }
    }
  }

  _generateMoveVector() {
    const x = Math.random()
    const y = 1 - x
    const direction = Math.random() >= 0.5 ? 1 : -1

    return {x: x * direction, y: y * direction}
  }

  _isSameDirections(a, b) {
    return (a < 0 && b < 0) || (a >= 0 && b >= 0)
  }
}
