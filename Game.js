const canvas = document.getElementById('GOL')
const context = canvas.getContext('2d')
const slider = document.querySelector('#slider')
const sliderText = document.querySelector('#sliderSpan')

let rows
let cols
let size = 20
let clicked = false
let clickedAfterReset = true
let grid
let next
let interval

canvas.addEventListener('mousedown', function (e) {
  var cords = getCords(e)
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
    var cords = getCords(e)
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
  nextGeneration()
  grid = next
  draw()
}
function makeRandomGrid() {
  for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
      grid[y][x] = Math.round(Math.random())
    }
  }
}
function rng(){
    makeRandomGrid();
    makeNext();
}
function draw() {
  for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
      var i = y * size
      var j = x * size
      if (grid[y][x] == 1) {
        drawCell(j, i)
      }
    }
  }
}
function nextGeneration() {
  for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
      var alive = countAlive(y, x)
      var currentState = grid[y][x]
      if (currentState == 1) {
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
  var alive = 0
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i == 0 && j == 0) continue
      var col = (y + i + cols) % cols
      var row = (x + j + rows) % rows
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
  grid = emptyGrid()
}
function makeGrid() {
  var arr = new Array(cols)
  for (var y = 0; y < cols; y++) {
    arr[y] = new Array(rows)
  }
  return arr
}
function emptyGrid() {
  var arr = makeGrid()
  for (var y = 0; y < cols; y++) {
    for (var x = 0; x < rows; x++) {
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
  var red = Math.floor(Math.random() * 255)
  var green = Math.floor(Math.random() * 255)
  var blue = Math.floor(Math.random() * 255)
  return 'rgb(' + red + ',' + green + ',' + blue + ' )'
}
function clickCell(x, y) {
  var cell = returnCellCords(x, y)
  var cellPos = returnCellPosition(cell)
  grid[cell.y][cell.x] = 1
  drawCell(cellPos.x, cellPos.y)
}
function returnCellCords(x, y) {
  var row = Math.floor(x / size)
  var col = Math.floor(y / size)
  return { x: row, y: col }
}
function returnCellPosition(cell) {
  var row = cell.x * size
  var col = cell.y * size
  return { x: row, y: col }
}
function getCords(event) {
  return { x: event.offsetX, y: event.offsetY }
}
