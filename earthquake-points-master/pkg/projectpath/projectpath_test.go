package projectpath_test

import (
	"strings"
	"testing"

	"github.com/aitorfernandez/earthquake-points/pkg/projectpath"
)

func TestBase(t *testing.T) {
	project := "earthquake-points/pkg"
	if got := projectpath.Base(); strings.Index(got, project) < 1 {
		t.Errorf("wrong project path %v", got)
	}
}
