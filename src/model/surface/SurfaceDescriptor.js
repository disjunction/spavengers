var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function SurfaceDescriptor() {
	this.location = null;
}

SurfaceDescriptor.inherit(Array);

exports.SurfaceDescriptor = SurfaceDescriptor;