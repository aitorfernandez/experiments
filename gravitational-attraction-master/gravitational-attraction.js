export default (p) => {
  const margin = 48

  const totalTriangles = 12
  const triangles = []

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

  let hue, ellipse

  function createTriangle() {
    const color = p.color(p.random(hue))

    const initialVertex = p.round(p.random(100, 140))
    const vertex = {
      v1: initialVertex, v2: initialVertex, v3: initialVertex
    }

    const module = p.round(p.random(5, 12))
    let activeVertex = rndVertex()

    const dir = p.random() < 0.5
    let up = p.random() < 0.5

    let angle = p.random(p.TWO_PI)
    let scale = 0.0

    let lifespan = 1
    let old = false

    const amplitude = p.round(p.random(20, 80))
    const vel = p.random(0.02, 0.06)

    const distance = p.random(initialVertex, initialVertex * 2)
    const padding = 12

    function rndVertex() {
      return `v${p.round(p.random(2)) + 1}`
    }

    function isDead() {
      return lifespan < 0
    }

    function update() {
      angle += vel
      scale = p.cos(angle) * 0.5

      if (p.frameCount % module === 0) {
        activeVertex = rndVertex()
      }

      if (
        vertex[activeVertex] > initialVertex + amplitude
        || vertex[activeVertex] < initialVertex - amplitude
      ) {
        up = !up
      }

      const motion = p.abs(p.cos(angle * 2) * p.sin(angle * 4))
      if (up) {
        vertex[activeVertex] += motion
      } else {
        vertex[activeVertex] -= motion
      }

      if (old) {
        lifespan -= p.random(0, 4)
      } else {
        lifespan += p.random(1, 3)
      }

      if (lifespan > 255) {
        old = true
      }
    }

    function draw(d) {
      color.setAlpha(lifespan)
      p.fill(color)

      p.push()
      p.rotate(dir ? angle : angle * -1)
      p.translate(distance * d, 0)

      p.push()
      p.rotate(angle)
      p.scale(scale)

      p.ellipse(-(vertex.v1), vertex.v1, padding, padding)
      p.ellipse(0, -(vertex.v2), padding, padding)
      p.ellipse(vertex.v3, vertex.v3, padding, padding)

      p.triangle(-(vertex.v1) + padding, vertex.v1, 0, -(vertex.v2) + padding, vertex.v3 - padding, vertex.v3)
      p.pop()
      p.pop()
    }

    return {
      isDead,
      update,
      draw
    }
  }

  function createEllipse() {
    const color = p.color(p.random(hue))

    let angle = 0
    let scale = 0

    function update() {
      angle += 0.02
      scale = p.sin(angle) - 1.5
    }

    function draw() {
      color.setAlpha(105)
      p.fill(color)

      p.push()
      p.scale(scale)
      p.ellipse(0, 0, 24, 24)
      p.pop()
    }

    function getScale() {
      return scale
    }

    return {
      getScale,
      update,
      draw
    }
  }

  function addTriangles(n) {
    for (let i = 0; i < n; i += 1) {
      triangles.push(createTriangle())
    }
  }

  function reset() {
    hue = p.random(colors)

    triangles.length = 0
    addTriangles(totalTriangles)

    ellipse = createEllipse()
  }

  function setup() {
    p.createCanvas(p.windowWidth - margin, p.windowHeight - margin)
    p.frameRate(24)

    p.ellipseMode(p.CENTER)

    reset()
  }

  function draw() {
    p.background('white')

    p.noStroke()

    p.push()
    p.translate(p.width / 2, p.height / 2)

    ellipse.update()
    ellipse.draw()

    triangles.forEach((triangle) => {
      triangle.update()
      triangle.draw(ellipse.getScale())
    })
    p.pop()

    let i = triangles.length
    while (i -= 1) {
      if (triangles[i].isDead()) {
        triangles.splice(i, 1)
      }
    }

    if (triangles.length < totalTriangles / 2) {
      addTriangles(p.round(p.random(6, totalTriangles)))
    }
  }

  p.play = function() {
    p.loop()
  }

  p.stop = function() {
    p.noLoop()
  }

  p.reset = reset

  p.setup = setup
  p.draw = draw
}
