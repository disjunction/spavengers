var
    geo      = require('geometry'),
    cocos    = require('cocos2d'),
    nodes    = cocos.nodes,
    Director = cocos.Director,
    ccp      = geo.ccp;

function RoverHud(layer) {
	this.node = new nodes.Node;
	
	var bgSprite = new nodes.Sprite({file: '/resources/sprites/hud/bg.png'});
	bgSprite.position = ccp(0,0);
	bgSprite.anchorPoint = ccp(0,0);
	this.node.addChild(bgSprite);
	
	var size = Director.sharedDirector.winSize;
	this.node.position = ccp(size.width - 200,0);
	this.node.anchorPoint = ccp(0,0);
	
	this.fpsLabel = new nodes.Label({ string: '...', fontName: 'Arial', fontSize: 10});
	this.fpsLabel.anchorPoint = ccp(0,0);
	this.fpsLabel.position = ccp(10, 80);
    this.node.addChild(this.fpsLabel);
    
    this.spsLabel = new nodes.Label({ string: '...', fontName: 'Arial', fontSize: 10});
	this.spsLabel.anchorPoint = ccp(0,0);
	this.spsLabel.position = ccp(10, 60);
    this.node.addChild(this.spsLabel);
	
    this.messageLabel = new nodes.Label({ string: '', fontName: 'Arial', fontSize: 10, fontColor: 'yellow'});
    this.messageLabel.anchorPoint = ccp(0,0);
	this.messageLabel.position = ccp(10, 40);
    this.node.addChild(this.messageLabel);
    
	layer.addChild(this.node);
	
	var me = this;
	setInterval(function(){
		if (me.oldTime > 0) {
			me.fpsLabel.string = 'FPS: ' + Math.round(10000 / (me.newTime - me.oldTime)) / 10;
		}
	}, 1000);
	setInterval(function(){
		if (me.box2dOldTime > 0) {
			me.spsLabel.string = 'SPS: ' + Math.round(10000 / (me.box2dNewTime - me.box2dOldTime)) / 10;
		}
	}, 1000);

}

RoverHud.inherit(Object, {
	feedFps: function() {
		this.oldTime = this.newTime+ 0;
		this.newTime = (new Date()).getTime();
	},
	feedSps: function() {
		this.box2dOldTime = this.box2dNewTime+ 0;
		this.box2dNewTime = (new Date()).getTime();
	},
	showMessage: function(string) {
		this.messageLabel.string = string;
	}

});


module.exports = RoverHud;