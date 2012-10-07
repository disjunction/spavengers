var
    geo    = require('geometry'),
    config = require('../abstract/Config'),
    ccp    = geo.ccp;

function NodeContainer() {
	NodeContainer.superclass.constructor.call(this);
	this._l = ccp(0,0);
	this._a = 0;
}

NodeContainer.inherit(Object, {
	// if the node is attached to the visible layer
	isAttached: false,
	node: null,
	
	angleChanged: true,
	
	get location() {return this._l;},
	set location(v) {
		this._l = v;
		if (this.node != null) this.node.position = geo.ccpMult(v, ccp(config.ppm, config.ppm)); 
	},
	_l: ccp(0,0),
	
	get angle() {return this._a;},
	set angle(v) {
		this._a = v;
		this.angleChanged = true;
		if (this.node != null) this.node.rotation = geo.radiansToDegrees(-v);
	},
	_a: 0,
	
});

module.exports = NodeContainer;