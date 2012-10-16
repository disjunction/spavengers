var path = require('../../bootstrap.js').projectPath,
	MountFactory = require(path + '/model/movable/MountFactory'),
	MountNodeBuilder = require(path + '/model/movable/MountNodeBuilder'),
	NodeFactory = require('../../mock/NodeFactoryMock');

exports.testMakeMount = function(test) {
	var f = new MountFactory();
	var mount = f.makeMount('car1');
	test.ok(mount.isBody);
	
	var nf = new NodeFactory(),
	    mnb = new MountNodeBuilder(nf);
	
	var node = mnb.makeNode(mount);
	test.ok(node.position != null);
	
	test.done();
};
