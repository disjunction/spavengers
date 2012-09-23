var path = require('../bootstrap.js').projectPath,
    NodeFactoryMock = require('../mock/NodeFactoryMock').NodeFactoryMock,
    LayerMock = require('../mock/LayerMock').LayerMock,
	SurfaceDescriptor = require(path + '/model/surface/SurfaceDescriptor').SurfaceDescriptor,
	SurfaceElement = require(path + '/model/surface/SurfaceElement').SurfaceElement,
	SurfaceNodeBuilder = require(path + '/model/surface/SurfaceNodeBuilder').SurfaceNodeBuilder;

exports.testMakeNodesAndAttach = function(test) {
	var sd = new SurfaceDescriptor(),
	    el = new SurfaceElement(),
	    nf = new NodeFactoryMock(),
	    nb = new SurfaceNodeBuilder(),
	    l = new LayerMock();
	
	sd.push(el);
	nb.nodeFactory = nf;
	
	test.equal(null, el.node);
	nb.makeNodes(sd);
	test.notEqual(null, el.node);

	test.ok(!el.isAttached);
	nb.attachNodes(sd, l);
	test.ok(el.isAttached);
	
	test.done();
};
