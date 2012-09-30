var
    geo    = require('geometry'),
    ccp    = geo.ccp;

/**
 * Generates and attaches cocos nodes
 */
function RoverNodeBuilder(nodeFactory) {
	this.nodeFactory = nodeFactory;
}

RoverNodeBuilder.inherit(Object, {
	/**
	 * @param RoverDescriptor sd
	 */
	makeNode: function(rover) {
		var nf = this.nodeFactory;
		var carSprite = nf.makeSprite({file: '/resources/sprites/rovers/hull/car1.png'});
	    carSprite.position = ccp(0,0);
	    
	    var cannonSprite = nf.makeSprite({file: '/resources/sprites/rovers/weapon/heavy_cannon.png'});
	    cannonSprite.anchorPoint = ccp(0.5, 0.5); 
	    cannonSprite.position = ccp(0,0);
	    
	    var node = new nf.makeNode();
	    
	    node.addChild(carSprite);
	    node.addChild(cannonSprite);
	    node.position = geo.ccpMult(rover.location, ccp(32, 32));
	    
	    rover.node = node;
	    
	    return node;
	},
	/**
	 * @param Rover rover
	 * @param Layer layer
	 */
	attachNode: function(rover, layer) {
		layer.addChild(rover.node);
		rover.isAttached = true;
	}
});

module.exports = RoverNodeBuilder;