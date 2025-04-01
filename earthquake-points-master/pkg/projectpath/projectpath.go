package projectpath

import (
	"path/filepath"
	"runtime"
)

// path is the root directory of this package.
var path string

func init() {
	_, currentFile, _, _ := runtime.Caller(0)
	path = filepath.Dir(currentFile)
}

// Base returns the project absolute pat.
func Base() string {
	return filepath.Join(path, "../..")
}
