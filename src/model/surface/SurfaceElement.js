var
    geo    = require('geometry'),
    ccp    = geo.ccp,
    NodeContainer = require('../visual/NodeContainer');

function SurfaceElement() {
	SurfaceElement.superclass.constructor.call(this);
	
	// how "high" is the element physically
	this.level = 0;
	
	// how "high" is the element visually
	this.zIndex = 0;
	
	// how hard it is to ride on this element
	this.passability = 0;
	
	// geo.Size of the element, used to detect whether it is in the screen
	this.size = null;
	
	// used to resolve the sprite image
	this.file = 'dummy';
	
	// another possibility is "map"
	this.type = 'sprite';
	
	this.shape = "box";
}

SurfaceElement.inherit(NodeContainer);

module.exports = SurfaceElement;