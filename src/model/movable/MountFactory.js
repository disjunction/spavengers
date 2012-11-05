var Mount = require('./Mount'),
	jsein = require('../../libs/jsein');

function MountFactory () {
    MountFactory.superclass.constructor.call(this);
    this.defs = {};
    
    this.jsonRepo = new jsein.JsonRepo(),
    	path = '../resources/data/mounts/';
    
    var files = ['hulls', 'towers', 'engines', 'wheels'];
    for (var i in files) {
    	this.jsonRepo.loadFile(path + files[i] + '.json');
    }
}

MountFactory.inherit(Object, {
	makeMount: function(index) {
		var mount = new Mount(),
			def = this.jsonRepo.get(index);
		
		for (var i in def) {
			mount[i] = jsein.clone(def[i]);
		}
		mount.index = index;
		return mount;
	}
});

module.exports = MountFactory;