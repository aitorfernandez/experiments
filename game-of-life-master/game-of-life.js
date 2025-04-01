export default (p) => {
  const resolution = 24

  const red = [
    '#db556e', '#cc4161', '#f791a7', '#e20b2b', '#9b2026', '#e08f76', '#ff93b5', '#ea798a', '#f4738f', '#d83a57', '#b70345', '#fcc7d7', '#dd6544', '#ea3e35', '#d35654', '#cc1631', '#db183f', '#a5181b'
  ]

  const orange = [
    '#eacf9d', '#e2b171', '#f78b42', '#f4bf7f', '#f9e7b8', '#e08a62', '#f7a518', '#f4be9c', '#f7ba60', '#efd0a5', '#d8a654', '#edba68', '#d84704', '#fcedc2', '#f2d1a9', '#f29c6a', '#f9b970', '#f2b035'
  ]

  const blue = [
    '#03afaf', '#0b86dd', '#6c9dcc', '#5d9bbf', '#02b9d6', '#2b7387', '#09889b', '#603ac9', '#051f87', '#b3f1f2', '#7e69d3', '#1821a0', '#7488db', '#b8aaef', '#00707a', '#17777c', '#112d77', '#8d72e5'
  ]

  const purple = [
    '#8019c4', '#772ce0', '#9258dd', '#803bb5', '#9d55c6', '#4608af', '#9d7ae2', '#8b0ef2', '#5f13b5', '#6611d6', '#964dc6', '#660a91', '#7e22c9', '#893ded', '#3d0a84', '#7d54dd', '#6e3ead', '#bba1f4'
  ]

  const monochrome = [
    '#878787', '#444444', '#969696', '#9e9e9e', '#8c8c8c', '#636363', '#aaaaaa', '#878787', '#727272', '#cccccc', '#686868', '#999999', '#666666', '#333333', '#a5a5a5', '#8e8e8e', '#515151', '#232323'
  ]

  const colors = [
    red, orange, blue, purple, monochrome
  ]

  let grid, cols, rows, hue

  function createCell(x, y, state, deaths) {
    const pos = p.createVector(x * resolution, y * resolution)

    function draw() {
      const opacity = 1 - (((deaths < 0 ? 0 : deaths > 100 ? 100 : deaths) / 100) * 2.4)
      const color = state ? p.random(hue) : p.color(`rgba(245, 245, 245, ${opacity})`)

      p.noStroke()

      p.fill(color)
      p.smooth()

      const offset = resolution / 2

      let radius = resolution - (opacity * 24)
      if (radius < 0) {
        radius *= -1
      }

      p.circle(pos.x + offset, pos.y + offset, radius > resolution ? offset : radius)
    }

    return {
      deaths,
      draw,
      state
    }
  }

  function make2dArray() {
    return Array.from(
      Array(cols), () => Array(rows)
    )
  }

  function countNeighbours(grid, x, y) {
    let sum = 0

    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        const col = (x + i + cols) % cols
        const row = (y + j + rows) % rows

        sum += grid[col][row].state
      }
    }

    sum -= grid[x][y].state
    return sum
  }

  function play() {
    p.loop()
  }

  function stop() {
    p.noLoop()
  }

  function reset() {
    hue = p.random(colors)

    cols = p.int(p.width / resolution)
    rows = p.int(p.height / resolution)

    grid = make2dArray()

    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const state = p.floor(p.random(2))
        grid[i][j] = createCell(i, j, state, state ? 0 : 1)
      }
    }
  }

  function setup() {
    p.createCanvas(
      p.windowWidth - resolution, p.windowHeight - resolution
    )
    p.frameRate(3)
    reset()
  }

  function draw() {
    p.background('white')

    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        grid[i][j].draw()
      }
    }

    // generate next grid
    const next = make2dArray(cols, rows)

    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const {
          deaths,
          state
        } = grid[i][j]

        const neighbours = countNeighbours(grid, i, j)

        // rules https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules

        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (state === 1 && neighbours < 2) {
          next[i][j] = createCell(i, j, 0, deaths + 1)

        // Any live cell with two or three live neighbours lives on to the next generation.
        } else if (state === 1 && (neighbours === 2 || neighbours === 3)) {
          next[i][j] = createCell(i, j, 1, deaths - 1)

        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        } else if (state === 1 && neighbours > 3) {
          next[i][j] = createCell(i, j, 0, deaths + 1)

        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        } else if (state === 0 && neighbours === 3) {
          next[i][j] = createCell(i, j, 1, deaths - 1)
        } else {
          next[i][j] = createCell(i, j, state, state ? deaths - 1 : deaths + 1)
        }
      }
    }

    grid = next
  }

  function windowResized() {
    // ...
  }

  p.play = play
  p.stop = stop

  p.reset = reset

  p.setup = setup
  p.draw = draw
  p.windowResized = windowResized
}
