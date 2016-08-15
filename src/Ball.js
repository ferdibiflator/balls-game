export default class Ball {
  /**
   * Конструктор. Инициализирует объект необхоимыми свойствами
   */
  constructor(canvas, radius, position = {x: radius, y: radius}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.radius = radius
    this.position = position
    this.selected = false
  }

  /**
   * Отображает шарик на игровом поле. Если он выбран, то отображает его с выделением
   */
  draw() {
    const { x, y } = this.position
    const context = this.context

    context.beginPath()
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false)
    context.fillStyle = 'red'
    context.fill()

    if(this.selected) {
      context.strokeStyle = 'yellow'
      context.stroke()
    }
  }

  /**
   * Задать состояние шарику (выбран/не выбран)
   */
  setSelected(state) {
    this.selected = state
  }

  /**
   * Получить состояние шарика (выбран/не выбран)
   */
  getSelected() {
    return this.selected === true
  }

  /**
   * Задать позицию шарику, с которой будет отображен шарик при следующей отрисовке
   */
  setPosition(position) {
    this.position = position
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
}
