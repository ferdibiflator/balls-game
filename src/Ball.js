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
    this.stepVector = {x: Math.floor(Math.random() * 100) - 50, y: Math.floor(Math.random() * 100) - 50}
    this.stepSize = 4
  }

  /**
   * Отображает шарик на игровом поле. Если он выбран, то отображает его с выделением
   */
  draw() {
    const { x, y } = this.position
    const context = this.context

    context.beginPath()
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false)
    context.fillStyle = '#12ac28'
    context.fill()

    if(this.isSelected) {
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
  doStep() {
    const { x: currPosX, y: currPosY } = this.position

    this.position = {
      x: currPosX + this.stepSize * this.stepVector.x / (Math.abs(this.stepVector.x) + Math.abs(this.stepVector.y)),
      y: currPosY + this.stepSize * this.stepVector.y / (Math.abs(this.stepVector.x) + Math.abs(this.stepVector.y))
    }
  }

  /**
   * Сообщить шару, что у него коллизия со сторон(ы): top, right, bottom, left.
   * На основе коллизий изменяет вектор движения шара
   */
  collision(from) {
    // если шарик прижали сверху и снизу, то останавливаем перемещения по оси Y
    if(from.top && from.bottom) {
      this.stepVector.y = 0
    }
    // если шарик в коллизии сверху И двигался наверх ИЛИ в коллизии снизу И двигался вниз
    else if( (from.top && this.stepVector.y < 0) || (from.bottom && this.stepVector.y > 0) ) {
      this.stepVector.y = -this.stepVector.y
    }

    // если шарик прижали слева и справа, то останавливаем перемещения по оси X
    if(from.left && from.right) {
      this.stepVector.x = 0
    }
    // если шарик в коллизии слева И двигался влево ИЛИ в коллизии справа И двигался направо
    else if((from.left && this.stepVector.x < 0) || (from.right && this.stepVector.x > 0)) {
      this.stepVector.x = -this.stepVector.x
    }
  }
}
