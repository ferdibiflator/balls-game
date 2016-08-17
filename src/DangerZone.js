export default class DangerZone {
  /**
   * Конструктор. Инициализирует объект необхоимыми свойствами
   */
  constructor(context, width, height, position) {
        this.context = context,
        this.position = position,
        this.width = width
        this.height = height
  }

  /**
   * Отобразить область
   */
  draw() {
    const { x, y } = this.position
    const context = this.context

    context.fillStyle = '#fcee07'
    context.fillRect(x, y, this.width, this.height)
  }
}
