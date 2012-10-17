PRODUCTION_BASE=/var/www/pluseq/data/projects/spavengers/repo
PRODUCTION_SSH=pluseq@pluseq.com

all: clean build
build:
	cocos make
	cp -r extras/sounds build/
	cp -r extras/music build/
clean:
	rm -rf build
production_prepare:
	cp extras/production_index.html public/index.html.template
	cp extras/production_config.js src/model/abstract/Config.js
production: production_prepare clean build
production_rsync:
	rsync -avz -e ssh src/ $(PRODUCTION_SSH):$(PRODUCTION_BASE)/src
	rsync -avz -e ssh extras/ $(PRODUCTION_SSH):$(PRODUCTION_BASE)/extras
production_config:
	scp extras/production_index.html $(PRODUCTION_SSH):$(PRODUCTION_BASE)/public/index.html.template
	scp extras/production_config.js $(PRODUCTION_SSH):$(PRODUCTION_BASE)/src/model/abstract/Config.js

	
