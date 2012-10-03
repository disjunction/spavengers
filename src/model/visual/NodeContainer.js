var
    geo    = require('geometry'),
    config = require('../abstract/Config'),
    ccp    = geo.ccp;

function NodeContainer() {
	NodeContainer.superclass.constructor.call(this);
	this._location = ccp(0,0);
	this._angle = 0;
}

NodeContainer.inherit(Object, {
	// if the node is attached to the visible layer
	isAttached: false,
	node: null,
	
	angleChanged: true,
	
	get location() {return this._location;},
	set location(v) {
		this._location = v;
		if (this.node != null) this.node.position = geo.ccpMult(v, ccp(config.ppm, config.ppm)); 
	},
	_location: ccp(0,0),
	
	get angle() {return this._angle;},
	set angle(v) {
		this._angle = v;
		this.angleChanged = true;
		if (this.node != null) this.node.rotation = geo.radiansToDegrees(-v);
	},
	_angle: 0,
	
});

module.exports = NodeContainer;