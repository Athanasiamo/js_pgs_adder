BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

.PHONY: _all
_add: all

modules := 

include make_lighttpd.mk

all: $(addsuffix _build, $(modules))
	$(MAKE) -f r_pkgs.mk all

.PHONY: download
download: $(addsuffix _download, $(modules))
	$(MAKE) -f r_pkgs.mk download

.PHONY: clean
clean: $(addsuffix _clean, $(modules))
	$(MAKE) -f r_pkgs.mk clean

