GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium`
endif

all: jshint test-ci

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/collective/collective.mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install

jshint:
	$(GRUNT) jshint

test: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:dev --force

test-ci: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:ci --force
