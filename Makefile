PRODUCTION_BASE=/var/www/pluseq/data/projects/spavengers/repo
PRODUCTION_SSH=pluseq@pluseq.com

all: clean build
build:
	cocos make
	cp -r extras/sounds build/
	cp -r extras/music build/
clean:
	rm -rf build
production_rsync:
	rsync -avz -e ssh src/ $(PRODUCTION_SSH):$(PRODUCTION_BASE)/src
production_config:
	scp extras/production_index.html $(PRODUCTION_SSH):$(PRODUCTION_BASE)/public/index.html.template
	scp extras/production_config.js $(PRODUCTION_SSH):$(PRODUCTION_BASE)/src/model/abstract/Config.js
production: clean build production_rsync production_config

	
