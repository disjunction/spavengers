var
    geo    = require('geometry'),
    NodeMock = require('./NodeMock'),
    ccp    = geo.ccp;

function NodeFactoryMock() {
}

NodeFactoryMock.inherit(Object, {
	makeNode: function(opts) {
		return new NodeMock();
	},
	makeSprite: function(opts) {
		return new NodeMock();
	},
	makeMap: function(opts) {
		return new NodeMock();
	},
});

module.exports = NodeFactoryMock;