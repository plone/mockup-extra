GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium-browser`
endif

all: jshint test-ci

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup-extra.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install
	cd bower_components/plone-mockup/ && make bootstrap

jshint:
	$(GRUNT) jshint

test: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:dev --force

test-ci: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:ci --force

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

	if test -f $(BOWER); then $(BOWER) cache-clean; fi

.PHONY: bootstrap jshint test test-ci clean
