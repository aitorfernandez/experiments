package feed

import (
	"bufio"
	"encoding/csv"
	"image"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"sync"

	"github.com/aitorfernandez/earthquake-points/pkg/projectpath"
	"github.com/aitorfernandez/earthquake-points/quake"
	"github.com/aitorfernandez/earthquake-points/tile"
)

// Feed structs manage a group of Quakes.
type Feed struct {
	Quakes []*quake.Quake
}

var ins = &Feed{}
var once sync.Once

func parseFloat(s string) float64 {
	v, _ := strconv.ParseFloat(s, 64)
	return v
}

// Setup setups the Quake array inside Feed instance from a CSV file.
func Setup() {
	file, err := os.Open(filepath.Join(projectpath.Base(), "feed", "all_month.csv"))
	if err != nil {
		log.Fatal(err)
	}
	reader := csv.NewReader(bufio.NewReader(file))

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		depth := parseFloat(record[3])
		lat := parseFloat(record[1])
		lon := parseFloat(record[2])
		mag := parseFloat(record[4])
		if depth == 0 && lat == 0 && lon == 0 && mag == 0 {
			continue
		}

		q := quake.New(depth, lat, lon, mag)
		ins.Quakes = append(ins.Quakes, q)
	}

	if err := file.Close(); err != nil {
		log.Fatal(err)
	}
}

// New returns the Feed instance.
func New() *Feed {
	once.Do(func() {
		Setup()
	})
	return ins
}

// Draw iterates over the array of Quakes creating a Tile for x, y.
func (f Feed) Draw(x, y int) image.Image {
	t := tile.New(x, y)
	for _, q := range f.Quakes {
		t.Draw(q)
	}
	return t.Image
}
