var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function LayerMock() {
	LayerMock.superclass.constructor.call(this);
}

LayerMock.inherit(require('./NodeMock').NodeMock);

exports.LayerMock = LayerMock;