//"use strict";  // Use strict JavaScript mode

// Import in the modules we're going to use
var cocos            = require('cocos2d')
  , nodes            = cocos.nodes
  , geo              = require('./libs/pointExtension')
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
  , Animator         = require('/model/visual/Animator')
  , RoverHud         = require('/model/visual/hud/RoverHud')
  , RoverBodyBuilder = require('/model/movable/RoverBodyBuilder')
  , FieldClient = require('/model/client/FieldClient')
  , FieldUpdater = require('/model/client/FieldUpdater')
  , Rover    = require('/model/movable/Rover')
  , box2d    = require('/libs/box2d')
  , bc       = require('/libs/boxedCocos')
  , jsein    = require('/libs/jsein').registerCtorLocator(require('/model/infra/ctorLocator'))
  , jsaaa    = require('/libs/jsaaa')
  , config   = require('/model/abstract/Config')
  ;

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Spavengers () {
	// You must always call the super class constructor
    Spavengers.superclass.constructor.call(this);

    this.winSize = Director.sharedDirector.winSize;
    
    var vlayer = new nodes.Node();
    this.addChild(vlayer);
    
    this.isMouseEnabled = true;
    this.isKeyboardEnabled = true;
    this.vlayer = vlayer;

    
    this.speed = this.torque = 0;
    this.towerOmega = {primary: 0, secondary: 0};
    
    this.hud = new RoverHud(this);
    this.hud.showMessage("connecting...");
    
    this.mouseMode = 'crosshair';
    
    this.crosshair = new Sprite({file: '/resources/sprites/crosshair/yellow_outer.png'});
    //this.vlayer.runAction(new actions.ScaleBy({duration: 5, scale: 0.2}));
    this.addChild(this.crosshair);
    
    var me = this;
    
    var io = window.parent.io;
    if (!io) {
    	me.hud.showMessage("connection failed :(");
    	return;
    }
    
    this.socket = io.connect(config.server.socketUrl, {
        reconnect: false
    });
    this.socket.on('carInfo', function (data) {
    	me.car = me.fc.field.getChild(data.childId);
    });
    this.socket.on('addCar', function (data) {
    	me.fc.addCar(jsein.parse(data.carStr));
    });
    this.socket.on('removeChild', function (data) {
    	me.fc.removeChildId(data.childId);
    });
    this.socket.on('field', function (data) {
    	me.field = jsein.parse(data.fieldStr);
    	var player = new jsaaa.SoundPlayer(),
    		nf = new NodeFactory(),
    	    animator = new Animator(vlayer, nf);
    	me.fc = new FieldClient(me.field, nf, animator, player);
    	me.fieldUpdater = new FieldUpdater(me.fc);
    	me.fc.attachNodes(vlayer);
    });
    this.socket.on('updatePack', function (data) {
    	me.hud.showMessage("");
    	me.fc.updatePack = data.updatePack;
    	me.fc.updated = true;
    	me.hud.feedSps();
    });
    this.socket.on('helo', function (data) {
        me.scheduleUpdate();
    	me.hud.showMessage("initializing...");
    });
    this.socket.on('update', function (data) {
    	console.log(data);
    	me.fieldUpdater.update(data);
    });
    this.socket.on('disconnect', function (data) {
    	me.hud.showMessage("server disconnected, please reload");
    	me.unscheduleUpdate();
    });
    
}

// Inherit from cocos.nodes.Layer
Spavengers.inherit(Layer, {
	mouseEventToLocation: function(mouseEvent) {
		var mx = (this.car.node.position.x + mouseEvent.locationInCanvas.x - this.winSize.width/2) / config.ppm,
		my = (this.car.node.position.y + mouseEvent.locationInCanvas.y - this.winSize.height/2) / config.ppm;
		return ccp(mx, my);
	},
	update: function(dt) {
		if (this.fc) {
			this.fc.update();
		}

		this.hud.feedFps();

		if (this.car) {
			this.vlayer.position = geo.ccpAdd(geo.ccpNeg(this.car.node.position), ccp(this.winSize.width / 2 ,this.winSize.height / 2));
		}
		
    	if (this.mouseEvent) {
	    	var lastOmega = jsein.clone(this.towerOmega);
	    	
	    	this.towerOmega = this.fc.getTowerOmega(this.mouseEventToLocation(this.mouseEvent), this.car);
	    	
	    	if (this.towerOmega.primary != lastOmega.primary || this.towerOmega.secondary != lastOmega.secondary) {
	    		this.socket.emit('towerOmega', this.towerOmega);
	    	}
		}
	},
	mouseMoved: function(evt) {
		this.mouseEvent = evt;
    	this.crosshair.position = ccp(evt.locationInCanvas.x, evt.locationInCanvas.y);
    },
    mouseDown: function(evt){
    	if (this.mouseMode == 'crosshair') {
    		this.socket.emit('shootMount', 
    				{mountName: 'primary', 
    			     _l: this.car.mounts.primary.getAbsLocation(this.car), 
    			     _a: this.car.angle + this.car.mounts.primary.angle
    		});
    	}
    },
    mouseDragged: function(evt){
    	//this.vlayer.position = geo.ccpAdd(this.vlayer.position, new geo.Point(evt.deltaX, evt.deltaY));
    } ,
	keyDown: function(evt) {
    		switch(evt.keyCode) {
    			case 68:
    			case 39:
    				this.socket.emit('turn', -15);
    				break;
    			case 65:
    			case 37:
    				this.socket.emit('turn', 15);
    				this.torque = 15;
    				break;
    			case 87:
    			case 38:
    				this.socket.emit('thrust', 50);
    				break;
    			case 83:
    			case 40: 
    				this.socket.emit('thrust', -50);
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
				break;
			case 65:
			case 68:
			case 37:
			case 39: 
				this.socket.emit('turn', 0);
				this.torque = 0;
				break;
		}
	}
});

// Export the class so it can be accessed from outside this file
this.Spavengers = Spavengers;
