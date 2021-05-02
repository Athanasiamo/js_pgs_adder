BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

include config_default.txt
-include config.txt

websrcs := \
	www/css/bootstrap.min.css \
	www/css/bootstrap.min.css.map \
	www/js/bootstrap.bundle.min.js \
	www/js/bootstrap.bundle.min.js.map \
	www/js/fontawesome.min.js \
	www/js/jquery.min.js \
	www/js/fuse-6.4.6.js \
	www/js/popper.min.js

# ------------------------------------------------------------------------------

# build

PHONY: prepare_offline
prepare_offline:
	make -C 3rdparty download

# ------------------------------------------------------------------------------

# run

.PHONY: run_webui
run_webui: 
	PORT=${WEBSERVERPORT} \
	DOCROOT=$(BASEDIR)/www \
	BASEDIR=$(BASEDIR) \
	DATADIR=${DATADIR} \
	R_LIBS_USER=$(BASEDIR)/3rdparty/r_packages \
	3rdparty/lighttpd/sbin/lighttpd -D -f lighttpd.conf

# ------------------------------------------------------------------------------

# clean

.PHONY: distclean
distclean: clean
	$(MAKE) -C 3rdparty clean

# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------

# internal

www/%: 3rdparty/%.gz
	echo $*.gz $@
	zcat < 3rdparty/$*.gz > $@ 

.PHONY: 3rdparty
3rdparty: $(websrcs)
	$(MAKE) -C 3rdparty

