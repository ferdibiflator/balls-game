import Ball from './Ball'
import DangerZone from './DangerZone'

/**
 * Основной каркас приложения, содержит "игровое поле", на котором располагаются "опасная область" и шарики.
 * А также основную логику приложения
 */
export default class App {
  /**
   * Конструктор. Производит инициализацию приложения
   */
  constructor(canvasNode) {
    this.canvas = canvasNode
    this.context = this.canvas.getContext('2d')
    this.canvas.style.backgroundColor = '#a1d302'

    this.cursorPosition = {
      x: 0,
      y: 0
    }

    this.dangerZone = new DangerZone(this.context,
      this.canvas.width / 2, this.canvas.height,
      {x: this.canvas.width / 2, y: 0})

    this.initEvents()
    this.createBalls()
  }

  /**
   * Точка старта приложения
   */
  start() {
    const fps = 60,
          interval = 1000 / fps

    setInterval(::this.calcAndDrawFrame, interval)
  }

  /**
   * Выполняет всю логику для получения одного кадра, и рисует его
   */
  calcAndDrawFrame() {
    this.clearFrame()
    this.dangerZone.draw()

    this.balls.forEach(ball => {
      if(ball.isSelected) {
        // меняем позицию выбранного курсором шарика
        ball.position = {...this.cursorPosition}
      } else {
        if(this.isBallInZone(this.dangerZone, ball)) {
          // шарик в опасной зоне, посоветуем ему начать двигаться и соблюдать коллизии
          ball.isMoving = true
          ball.collision(this.checkBallCollisionInsideZone(this.dangerZone, ball))
        } else{
          // шарик вне опасной зоны, он может отдохнуть
          ball.isMoving = false
        }

        if(ball.isMoving) {
          // шарику посоветовали двигаться - он двигается
          ball.doStep()
        }
      }

      ball.draw()
    })
  }

  /**
   * Проверяет, находится ли шар внутри области
   */
  isBallInZone(zone, ball) {
    const { x: ballPosX, y: ballPosY } = ball.position
    const { x: zonePosX, y: zonePosY } = zone.position
    const { width: zoneWidth, height: zoneHeight } = zone

    return (
      (ballPosX >= zonePosX && ballPosX <= zonePosX + zoneWidth) &&
      (ballPosY >= zonePosY && ballPosY <= zonePosY + zoneHeight)
    )
  }

  /**
   * Проверка на коллизии шара со стенками области ИЗНУТРИ.
   * NOTE: подразумевается, что шар уже находится внутри проверямой области
   */
  checkBallCollisionInsideZone(zone, ball) {
    const { radius: ballRadius, position: { x: ballPosX, y: ballPosY } } = ball
    const { width: zoneWidth, height: zoneHeight, position: { x: zonePosX, y: zonePosY } } = zone
    const collision = {top: false, right: false, bottom: false, left: false}

    // Проверка на наличие коллизий по оси Y
    if(ballPosY - ballRadius <= zonePosY) collision.top = true
    if(ballPosY + ballRadius >= zonePosY + zoneHeight) collision.bottom = true

    // Проверка на наличие коллизий по оси X
    if(ballPosX - ballRadius <= zonePosX) collision.left = true
    if(ballPosX + ballRadius >= zonePosX + zoneWidth) collision.right = true

    return collision
  }

  /**
   * Инициализирует все необходимые события
   */
  initEvents() {
    // следим за позицией курсора
    window.onmousemove = e => {
      const { left: correctX, top: correctY } = this.canvas.getBoundingClientRect()
      this.cursorPosition.x = e.pageX - correctX
      this.cursorPosition.y = e.pageY - correctY
    }

    // при нажатии мыши, ищем шары в фокусе, и захватываем их
    window.onmousedown = () => {
      this.balls.forEach(ball => {
        if(ball.isCursorFocused(this.cursorPosition)) {
          ball.isSelected = true
          ball.isMoving = false
        }
      })
    }

    // при отжатии мыши, отпускаем все шары
    window.onmouseup = () => {
      this.balls.forEach(ball => {
        ball.isSelected = false
      })
    }

    // при обновлении страницы сохраняем текущие позиции шаров
    window.onbeforeunload = () => {
      this.saveBallsPositions()
    }
  }

  /**
   * Очищает кадр/поле
   */
  clearFrame() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * Создает шарики, с которыми будем работать. Если в session storage есть сохраненные позиции, использует их,
   * иначе - создает шарики с изначальными позициями
   */
  createBalls() {
    var savedBallsPositions = this.loadBallsPositions()

    if(savedBallsPositions) {
      this.balls = savedBallsPositions.map(position => new Ball(this.context, position))
    } else {
      this.balls = [
        new Ball(this.context, {x: 35, y: 35}),
        new Ball(this.context, {x: 100, y: 45}),
        new Ball(this.context, {x: 70, y: 100}),
        new Ball(this.context, {x: 70, y: 200}),
        new Ball(this.context, {x: 160, y: 70}),
      ]
    }
  }

  /**
   * Сохраняет позиции шариков в session storage
   */
  saveBallsPositions() {
    var ballsPositions = JSON.stringify(this.balls.map(ball => ball.position))
    window.sessionStorage.setItem('ballsPositions', ballsPositions)
  }

  /**
   * Загружает позиции шариков из session storage
   */
  loadBallsPositions() {
    var saved =  window.sessionStorage.getItem('ballsPositions')

    return saved && JSON.parse(saved)
  }
}
