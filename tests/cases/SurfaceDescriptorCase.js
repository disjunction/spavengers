var path = require('../bootstrap.js').projectPath,
	SurfaceDescriptor = require(path + '/model/surface/SurfaceDescriptor').SurfaceDescriptor,
	SurfaceElement = require(path + '/model/surface/SurfaceElement').SurfaceElement;

exports.testArrayProperties = function(test) {
	var sd = new SurfaceDescriptor();
	var o = new Object();
	sd.push(o);
	test.equals(1, sd.length);
	
	test.done();
};

exports.testAddingElements = function(test) {
	var sd = new SurfaceDescriptor();
	var el = new SurfaceElement();
	sd.push(el);
	test.equals(1, sd.length);
	
	test.done();
};
