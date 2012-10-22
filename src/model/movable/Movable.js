"use strict";

var
	NodeContainer  = require('../visual/NodeContainer'),
    geo    = require('geometry'),
    ccp    = geo.ccp;

function Movable() {
	Movable.superclass.constructor.call(this);
	this.mass = 0.1;
}

Movable.inherit(NodeContainer, {
	size: new geo.Size(1,1),
	
	get front() {if (this.angleChanged) this.resetFront(); return this._f;},
	set front(v) {throw new Error('use resetFront instead of direct setting it');},
	_f: ccp(0, 0),
	
	resetFront: function() {
		var half = this.size.width / 2;
		this._f.x = half * Math.cos(this.angle);
		this._f.y = half * Math.sin(this.angle);
		this.angleChanged = false;
	},
	
	get rear() {return geo.ccpNeg(this.front);},
	get frontPoint() { return geo.ccpAdd(this.location, this.front);},
	get rearPoint() { return geo.ccpAdd(this.location, this.rear);},
	
	get density() {
		return 1;
	}
	
});

module.exports = Movable;