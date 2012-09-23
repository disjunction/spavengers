var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function NodeFactoryMock() {
}

NodeFactoryMock.inherit(Object, {
	makeSprite: function(opts) {
		return new Object();
	},
	makeMap: function(opts) {
		return new Object();
	},
});

exports.NodeFactoryMock = NodeFactoryMock;