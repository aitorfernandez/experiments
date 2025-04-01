package quake

import (
	"math"
)

// Vec2 keeps X and Y locations.
type Vec2 struct {
	X, Y int
}

// Quake keeps quake information from feeds.
type Quake struct {
	Depth float64
	Lat   float64
	Loc   Vec2
	Lon   float64
	Mag   float64
}

func degreesToRadians(deg float64) float64 {
	return deg * (math.Pi / 180.0)
}

func latLonToOffsets(lat, long float64) Vec2 {
	fe := 180
	r := 1024 / (2 * math.Pi)

	latRad := degreesToRadians(lat)
	lonRad := degreesToRadians(long + float64(fe))

	x := int(math.Floor(lonRad * r))

	yLog := r * math.Log(math.Tan(math.Pi/4+latRad/2))
	y := int(math.Floor(1024/2 - yLog))

	return Vec2{X: x, Y: y}
}

// New returns a new Quake.
func New(depth, lat, lon, mag float64) *Quake {
	q := &Quake{
		Depth: depth,
		Lat:   lat,
		Lon:   lon,
		Mag:   mag,
	}
	q.Loc = latLonToOffsets(q.Lat, q.Lon)
	return q
}
