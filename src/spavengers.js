//"use strict";  // Use strict JavaScript mode

// Import in the modules we're going to use
var cocos            = require('cocos2d')
  , nodes            = cocos.nodes
  , geo              = require('geometry')
  , actions          = cocos.actions
  ;

// Convenient access to some constructors
var Director = cocos.Director
  , Label    = nodes.Label
  , Layer    = nodes.Layer
  , Sprite   = nodes.Sprite
  , Point    = geo.Point
  , ccp      = geo.ccp
  , Rect     = geo.Rect
  , NodeFactory      = require('/model/visual/NodeFactory')
  , RoverHud         = require('/model/visual/hud/RoverHud')
  , RoverBodyBuilder = require('/model/movable/RoverBodyBuilder')
  , FieldClient = require('/model/client/FieldClient')
  , Rover    = require('/model/movable/Rover')
  , box2d    = require('/libs/box2d')
  , bc       = require('/libs/boxedCocos')
  , jsein    = require('/libs/jsein').registerCtorLocator(require('/model/infra/ctorLocator'))
  , config   = require('/model/abstract/Config')
  ;

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Spavengers () {
	// You must always call the super class constructor
    Spavengers.superclass.constructor.call(this);

    var vlayer = new nodes.Node();
    this.addChild(vlayer);
    
    this.isMouseEnabled = true;
    this.isKeyboardEnabled = true;
    this.vlayer = vlayer;
    
    this.speed = this.torque = 0;
    
    this.hud = new RoverHud(this);
    
    this.crosshair = new Sprite({file: '/resources/sprites/crosshair/yellow_outer.png'});
    this.addChild(this.crosshair);
    
    var me = this;
    
    var io = window.parent.io;
    
    this.socket = io.connect(config.server.socketUrl);
    this.socket.on('carInfo', function (data) {
    	me.car = me.fc.field.getChild(data.childId);
    });
    this.socket.on('field', function (data) {
    	me.field = jsein.parse(data.fieldStr);
    	var nf = new NodeFactory();
    	me.fc = new FieldClient(me.field, nf);
    	me.fc.attachNodes(vlayer);
    });
    this.socket.on('updatePack', function (data) {
    	me.fc.updatePack = data.updatePack;
    	me.fc.updated = true;
    	me.hud.feedSps();
    });
    
    
    this.scheduleUpdate();
}

// Inherit from cocos.nodes.Layer
Spavengers.inherit(Layer, 
	{
	update: function(dt) {
		if (this.fc) {
			this.fc.update();
		}

		this.hud.feedFps();

		if (this.car) {
			var size = Director.sharedDirector.winSize;
			this.vlayer.position = geo.ccpAdd(geo.ccpNeg(this.car.node.position), ccp(size.width / 2 ,size.height / 2));
		}
	},
	mouseMoved: function(evt) {
    	this.crosshair.position = ccp(evt.locationInCanvas.x, evt.locationInCanvas.y);
    	},
    mouseDragged: function(evt){
    	this.vlayer.position = geo.ccpAdd(this.vlayer.position, new geo.Point(evt.deltaX, evt.deltaY));
    } ,
	keyDown: function(evt) {
    		switch(evt.keyCode) {
    			case 68:
    			case 39:
    				this.socket.emit('turn', -15);
    				console.log('left');
    				break;
    			case 65:
    			case 37:
    				this.socket.emit('turn', 15);
    				this.torque = 15;
    				console.log('right');
    				break;
    			case 87:
    			case 38:
    				this.socket.emit('thrust', 50);
    				console.log('go up');
    				break;
    			case 83:
    			case 40: 
    				this.socket.emit('thrust', -50);
    				console.log('go down');
    				break;
    			default:
    				console.log('key: ' + evt.keyCode);
    		}
    	},
	keyUp: function(evt) {
		switch(evt.keyCode) {
			case 83:
			case 87:				
			case 40:
			case 38: 
				this.socket.emit('thrust', 0);
				this.speed = 0;
				console.log('stop');
				break;
			case 65:
			case 68:
			case 37:
			case 39: 
				this.socket.emit('turn', 0);
				this.torque = 0;
				console.log('stop torque');
				break;
		}
	}
});

// Export the class so it can be accessed from outside this file
this.Spavengers = Spavengers;
