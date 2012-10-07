var path = require('../../bootstrap.js').projectPath,
	SurfaceDescriptor = require(path + '/model/surface/SurfaceDescriptor'),
	SurfaceElement = require(path + '/model/surface/SurfaceElement');

exports.testAddingElements = function(test) {
	var sd = new SurfaceDescriptor();
	var el = new SurfaceElement();
	sd.addChild(el);
	test.equals(1, sd.childIds.length);
	test.done();
};
