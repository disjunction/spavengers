var
	cocos2d = require('cocos2d'),
	nodes = cocos2d.nodes,
    geo    = require('geometry'),
    ccp    = geo.ccp;

/**
 * The goal of this factory is to make it mockable,
 * so that full with the nodes and scenes can be tested in console
 */
function NodeFactory() {
}

NodeFactory.inherit(Object, {
	makeNode: function(opts) {
		if (null == opts) {
			opts = {};
		}
		return new nodes.Node(opts);
	},
	makeSprite: function(opts) {
		return new nodes.Sprite(opts);
	},
	makeMap: function(opts) {
		return new nodes.TMXTiledMap(opts);
	},
});

module.exports = NodeFactory;