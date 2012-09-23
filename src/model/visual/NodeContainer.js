var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function NodeContainer() {
	this.location = null;
	this.node = null;
	this.isAttached = false;
}

NodeContainer.inherit(Object);

exports.NodeContainer = NodeContainer;