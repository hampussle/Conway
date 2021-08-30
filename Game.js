const canvas = document.getElementById('GOL')
const context = canvas.getContext('2d')
const slider = document.querySelector('#slider')
const sliderText = document.querySelector('#sliderSpan')
const generationsText = document.querySelector('#generations')
const cellsText = document.querySelector('#cells')

let rows
let cols
let size = 20
let generations = 0
let aliveCells = 0

let clicked = false
let grid
let next
let interval

canvas.addEventListener('mousedown', function (e) {
  let cords = getCords(e)
  clickCell(cords.x, cords.y)
  clicked = true
})
canvas.addEventListener('mouseup', function () {
  clicked = false
})
canvas.addEventListener('mouseleave', function () {
  clicked = false
})
canvas.addEventListener('mousemove', function (e) {
  if (clicked) {
    let cords = getCords(e)
    clickCell(cords.x, cords.y)
  }
})
slider.oninput = function () {
  size = parseInt(slider.value)
  sliderText.innerHTML = 'size: ' + size
  stop()
  setup()
}
function setup() {
  updateCanvas()
  grid = makeGrid()
  makeRandomGrid()
  draw()
}
function start() {
  stop()
  interval = setInterval(function () {
    makeNext()
  }, 100)
  return interval
}
function updateCanvas() {
  canvas.width = window.innerWidth
  canvas.height =
    window.innerHeight - document.getElementById('navbar').clientHeight
  cols = Math.floor(canvas.height / size)
  rows = Math.floor(canvas.width / size)
}
function stop() {
  clearInterval(interval)
  interval = null
}
function makeNext() {
  clearCanvas()
  updateCanvas()
  next = makeGrid()
  if (cols > grid.length) {
    grid = makeGrid()
    makeRandomGrid()
  }
  generations++
  aliveCells = 0
  nextGeneration()
  grid = next
  updateText()
  draw()
}
function makeRandomGrid() {
  generations = 0
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[y][x] = Math.round(Math.random())
    }
  }
}
function rng() {
  makeRandomGrid()
  makeNext()
}
function draw() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      let i = y * size
      let j = x * size
      if (grid[y][x] == 1) {
        drawCell(j, i)
      }
    }
  }
}
function nextGeneration() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      let alive = countAlive(y, x)
      let currentState = grid[y][x]
      if (currentState == 1) {
        aliveCells++
        if (alive == 3 || alive == 2) next[y][x] = 1
        else if (alive <= 1 || alive >= 4) next[y][x] = 0
      } else {
        if (alive == 3) next[y][x] = 1
        else next[y][x] = 0
      }
    }
  }
}
function countAlive(y, x) {
  let alive = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i == 0 && j == 0) continue
      let col = (y + i + cols) % cols
      let row = (x + j + rows) % rows
      alive += grid[col][row]
    }
  }
  return alive
}
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}
function reset() {
  stop()
  clearCanvas()
  generations = 0
  aliveCells = 0
  updateText()
  grid = emptyGrid()
}
function makeGrid() {
  let arr = new Array(cols)
  for (let y = 0; y < cols; y++) {
    arr[y] = new Array(rows)
  }
  return arr
}
function emptyGrid() {
  let arr = makeGrid()
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      arr[y][x] = 0
    }
  }
  return arr
}
function drawCell(x, y) {
  context.beginPath()
  context.rect(x, y, size, size)
  context.fillStyle = getRandomColour()
  context.fill()
  context.stroke()
}
function getRandomColour() {
  let red = Math.floor(Math.random() * 255)
  let green = Math.floor(Math.random() * 255)
  let blue = Math.floor(Math.random() * 255)
  return 'rgb(' + red + ',' + green + ',' + blue + ' )'
}
function updateText() {
  cellsText.innerHTML = 'Alive cells: ' + aliveCells
  generationsText.innerHTML = 'Number of generations: ' + generations
}
function clickCell(x, y) {
  let cell = returnCellCords(x, y)
  let cellPos = returnCellPosition(cell)
  grid[cell.y][cell.x] = 1
  drawCell(cellPos.x, cellPos.y)
}
function returnCellCords(x, y) {
  let row = Math.floor(x / size)
  let col = Math.floor(y / size)
  return { x: row, y: col }
}
function returnCellPosition(cell) {
  let row = cell.x * size
  let col = cell.y * size
  return { x: row, y: col }
}
function getCords(event) {
  return { x: event.offsetX, y: event.offsetY }
}
