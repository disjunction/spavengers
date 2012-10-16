var config = require('../abstract/Config'),
	geo = require('geometry'),
	Mount = require('./Mount');

function MountNodeBuilder(nodeFactory) {
	MountNodeBuilder.superclass.constructor.call(this);
    this.nodeFactory = nodeFactory;
}

MountNodeBuilder.inherit(Object, {
	makeNode: function(mount) {
		var node = this.nodeFactory.makeSprite({file: mount.spriteFile});
		if (mount.anchorPoint) {
			node.anchorPoint = mount.anchorPoint;
		}
	    node.position = geo.ccpMult(mount.location, geo.ccp(config.ppm, config.ppm));
	    node.rotation = geo.radiansToDegrees(-mount.angle);
	    
	    mount.node = node;
	    mount.isAttached = true;
	    
	    return node;
	}
});

module.exports = MountNodeBuilder;