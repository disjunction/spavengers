var
	cocos2d = require('cocos2d'),
	nodes = cocos2d.nodes,
    geo    = require('geometry'),
    config = require('../abstract/Config'),
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
		return this.applyOpts(new nodes.Sprite(opts), opts);
	},
	makeMap: function(opts) {
		return new nodes.TMXTiledMap(opts);
	},
	
	/// PRIVATE PART
	
	/**
	 * applies opts not supported natively in cocos2d contructors
	 * @param Node node
	 * @param assoc opts
	 * @return Node
	 */
	applyOpts: function(node, opts) {
		for (var i in opts) {
			switch (i) {
			case 'rotation':
				node.rotation = opts[i];
				break;
			case 'position':
				node.position = opts[i];
				break;
			case '_a':
				node.rotation = geo.radiansToDegrees(opts[i]);
				break;
			case '_l':
				node.position = ccp(opts[i].x * config.ppm, opts[i].y * config.ppm);
				break;
			case 'opacity':
				node.opacity = opts[i];
				break;
			case 'scale':
				node.scale = opts[i];
				break;
			}
		}
		return node;
	}
	
});

module.exports = NodeFactory;