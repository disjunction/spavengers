var Mount = require('./Mount'),
	jsein = require('../../libs/jsein');

function MountFactory () {
    MountFactory.superclass.constructor.call(this);
    this.defs = {};
    var me = this;
    function loadFromJson(fileName) {
    	var o = require('../../resources/data/mounts/' + fileName);
    	var defaults = o._defaults;
    	for (var i in o) {
    		if (i.substr(0, 1) == '_') continue;
    		me.defs[i] = jsein.clone(defaults);
    		for (var j in o[i])
    			me.defs[i][j] = o[i][j];
    	}
    }
    loadFromJson('hulls.json');
    loadFromJson('towers.json');
}

MountFactory.inherit(Object, {
	makeMount: function(name) {
		var mount = new Mount();
		for (var i in this.defs[name]) {
			mount[i] = jsein.clone(this.defs[name][i]);
		}
		mount.name = name;
		return mount;
	}
});

module.exports = MountFactory;