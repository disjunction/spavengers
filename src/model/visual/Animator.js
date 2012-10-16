var
	cocos2d = require('cocos2d'),
	nodes = cocos2d.nodes,
	actions = cocos2d.actions,
    geo    = require('geometry'),
    ccp    = geo.ccp,
    actions = cocos2d.actions;

/**
 * The goal of this factory is to make it mockable,
 * so that full with the nodes and scenes can be tested in console
 * @param Layer layer
 * @param NodeFactory nodeFactory
 */
function Animator(layer, nodeFactory) {
	this.layer = layer;
	this.nodeFactory = nodeFactory;
}

Animator.prototype.showSpriteAndFadeOut = function(spriteOpts, dur1, dur2) {
	var sprite = this.nodeFactory.makeSprite(spriteOpts);
	this.layer.addChild(sprite);
	var sequence = new actions.Sequence({actions: [
	    new actions.DelayTime({duration: dur1}),
		new actions.FadeTo({duration: dur2, toOpacity: 0})
	]});
	
	sprite.runAction(sequence);
	setTimeout(function remove() {
		this.layer.removeChild(sprite);
	}.bind(this), (dur1+dur2) * 1000);
};

module.exports = Animator;