var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function NodeMock() {
	this.children = [];
}

NodeMock.inherit(Object, {
	addChild: function(o) {
		this.children.push(o);
	},
	
});

exports.NodeMock = NodeMock;