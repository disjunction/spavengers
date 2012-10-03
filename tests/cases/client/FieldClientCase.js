var path = require('../../bootstrap.js').projectPath,
	FieldClient = require(path + '/model/client/FieldClient')
	Field = require(path + '/model/frame/Field'),
    NodeFactoryMock = require('../../mock/NodeFactoryMock'),
    LayerMock = require('../../mock/LayerMock'),
	SurfaceDescriptor = require(path + '/model/surface/SurfaceDescriptor'),
	SurfaceElement = require(path + '/model/surface/SurfaceElement'),
	Rover = require(path + '/model/movable/Rover');

exports.testFieldChildrenOperations = function(test) {
	var f = new Field(),
	    sd = new SurfaceDescriptor(),
	    sel = new SurfaceElement(),
	    r1 = new Rover(),
	    r2 = new Rover(),
	    nf = new NodeFactoryMock(),
	    l = new LayerMock();
	
	sd.addChild(sel);
	f.addChild(sd);
	f.addChild(r1);
	f.addChild(r2);

	fc = new FieldClient(f, nf);
	fc.attachNodes(l);
	
	test.equal(3, fc.rovers.length);
	test.equal(1, fc.surfaces.length);
	
	test.done();
};