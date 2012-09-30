var
    geo    = require('geometry'),
    ccp    = geo.ccp;

/**
 * Generates and attaches cocos nodes
 */
function SurfaceNodeBuilder() {
	this.nodeFactory = null;
	this.isAttached = false;
}

SurfaceNodeBuilder.inherit(Object, {
	/**
	 * @param SurfaceDescriptor sd
	 */
	makeNodes: function(sd) {
		for (var i = 0; i < sd.children.length; i++) {
			var el = sd.children[i];
			if (null == el.node) {
				switch (el.type) {
					case 'sprite':
						var opts = {
							file: '/resources/sprites/surface/' + el.file + '.png'
						};
						el.node  = this.nodeFactory.makeSprite(opts);
						break;
					case 'map':
						var opts = {
							file: '/resources/data/' + el.file + '.tmx'
						};
						el.node = this.nodeFactory.makeMap(opts);
						el.position = ccp(0,0);
						break;
				}
			}
		};
	},
	/**
	 * @param SurfaceDescriptor sd
	 * @param Layer layer
	 */
	attachNodes: function(sd, layer) {
		for (var i = 0; i < sd.children.length; i++) {
			var el = sd.children[i];
			if (null != el.node && !el.isAttached) {
				layer.addChild(el.node);
				el.isAttached = true;
			}
		};
	},
});

module.exports = SurfaceNodeBuilder;