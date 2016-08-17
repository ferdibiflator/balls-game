import App from './App'
import './css/app.css'

var body = document.querySelector('body')
var canvasNode = document.getElementById('root')

// Задаем постоянный размер
canvasNode.width = body.offsetWidth
canvasNode.height = body.offsetHeight

var app = new App(canvasNode)
app.start()
