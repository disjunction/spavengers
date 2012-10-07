var
    geo    = require('geometry'),
    config = require('../abstract/Config'),
    ccp    = geo.ccp;

/**
 * Generates and attaches cocos nodes
 */
function RoverNodeBuilder(mountNodeBuilder) {
	this.mountNodeBuilder = mountNodeBuilder;
}

RoverNodeBuilder.inherit(Object, {
	/**
	 * @param Rover rover
	 */
	makeNode: function(rover) {
		var mnb = this.mountNodeBuilder;
		
		/*
		var nf = this.nodeFactory;
		var carSprite = nf.makeSprite({file: '/resources/sprites/rovers/hull/car1.png'});
	    carSprite.position = ccp(0,0);
	    
	    
	    var cannonSprite = nf.makeSprite({file: '/resources/sprites/rovers/weapon/heavy_cannon.png'});
	    cannonSprite.anchorPoint = ccp(0.5, 0.5); 
	    cannonSprite.position = ccp(0,0);
	    */
	    
	    var node = this.mountNodeBuilder.nodeFactory.makeNode();
	    
	    node.addChild(mnb.makeNode(rover.mounts.hull));
	    
	    if (rover.mounts.primary) {
	    	node.addChild(mnb.makeNode(rover.mounts.primary));
	    }
	    	
	    node.position = geo.ccpMult(rover.location, ccp(config.ppm, config.ppm));
	    node.rotation = geo.radiansToDegrees(-rover.angle);
	    
	    rover.node = node;
	    
	    return node;
	},

	/**
	 * @param Rover rover
	 * @param Layer layer
	 */
	attachNode: function(rover, layer) {
		if (rover.node == null) this.makeNode(rover);
		layer.addChild(rover.node);
		rover.isAttached = true;
	}	
	
});

module.exports = RoverNodeBuilder;