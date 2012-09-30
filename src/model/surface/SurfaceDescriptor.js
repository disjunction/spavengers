var
    geo    = require('geometry'),
    ccp    = geo.ccp,
    Parent = require('../abstract/Parent');

function SurfaceDescriptor() {
	SurfaceDescriptor.superclass.constructor.call(this);
	this.location = null;
}

SurfaceDescriptor.inherit(Parent);

module.exports = SurfaceDescriptor;