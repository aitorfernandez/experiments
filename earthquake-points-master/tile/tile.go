package tile

import (
	"image"
	"image/color"
	"math"

	"github.com/aitorfernandez/earthquake-points/quake"
	"github.com/lucasb-eyer/go-colorful"
)

// Tile keeps image and size from a Tile in the map.
type Tile struct {
	Image *image.NRGBA
	Size  int
	X     int
	Y     int
}

// New returns a new initialize Tile struct.
func New(x, y int) *Tile {
	size := 256
	img := image.NewNRGBA(image.Rect(0, 0, size, size))
	return &Tile{
		Image: img,
		Size:  size,
		X:     x,
		Y:     y,
	}
}

// Draw sets colors in Tile.Image using quake values.
func (t *Tile) Draw(q *quake.Quake) {
	mag := int(math.Floor(q.Mag)) + 2
	for y := 0; y < t.Size; y++ {
		coordY := y + (t.Size * t.Y)
		if coordY > q.Loc.Y-mag && coordY < q.Loc.Y+mag {
			for x := 0; x < t.Size; x++ {
				coordX := x + (t.Size * t.X)
				if coordX > q.Loc.X-mag && coordX < q.Loc.X+mag {
					c := hsv(q.Mag)
					r, g, b := c.RGB255()
					a := alpha(q.Depth * q.Mag)
					t.Image.SetNRGBA(x, y, color.NRGBA{r, g, b, a})
				}
			}
		}
	}
}

func hsv(v float64) colorful.Color {
	return colorful.Hsv(12.0, v/(v+1), 1)
}

func alpha(v float64) uint8 {
	return 99 + uint8(255*math.Pow(v, 0.5))
}
