import Ball from './Ball'

export default class App {
  /**
   * Конструктор. Инициализирует объект необхоимыми свойствами
   */
  constructor(canvasNode, width, height) {
    this.canvas = canvasNode
    this.context = this.canvas.getContext('2d')

    this.canvas.width = width
    this.canvas.height = height
    this.canvas.style.backgroundColor = '#690'

    this.selectedBall = null

    this.cursorPosition = {
      x: 0,
      y: 0
    }
  }

  /**
   * Точка старта приложения
   */
  start() {
    this.initEvents()
    this.balls = [
      new Ball(this.canvas, 20, {x: 20, y: 20}),
      new Ball(this.canvas, 20, {x: 100, y: 45}),
      new Ball(this.canvas, 20, {x: 70, y: 100}),
      new Ball(this.canvas, 20, {x: 70, y: 200}),
      new Ball(this.canvas, 20, {x: 160, y: 70}),
    ]

    setInterval(::this.drawFrame, 1000 / 60)
  }

  /**
   * Выполняет всю логику для получения одного кадра, и рисует его
   */
  drawFrame() {
    this.clearPlayField()

    this.balls.forEach(ball => {
      ball.draw()
      if(ball.getSelected()) {
        ball.setPosition({...this.cursorPosition})
      }
    })
  }

  /**
   * Инициализирует все необходимые события
   */
  initEvents() {
    window.onmousemove = e => {
      const { left: correctX, top: correctY } = this.canvas.getBoundingClientRect()
      this.cursorPosition.x = e.pageX - correctX
      this.cursorPosition.y = e.pageY - correctY
    }

    window.onmousedown = () => {
      this.balls.forEach(ball => {
        if(ball.isCursorFocused(this.cursorPosition)) ball.setSelected(true)
      })
    }

    window.onmouseup = () => {
      this.balls.forEach(ball => {
        ball.setSelected(false)
      })
    }
  }

  /**
   * Очищает игровое поле, то есть удаляет шарики с их текущими позициями с поля
   */
  clearPlayField() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
