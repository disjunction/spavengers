"use strict";  // Use strict JavaScript mode

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
  , Texture2D = cocos.Texture2D
  , TMXTiledMap = nodes.TMXTiledMap
  , RotateBy = actions.RotateBy
  , NodeFactory      = require('/model/visual/NodeFactory')
  , RoverHud         = require('/model/visual/hud/RoverHud')
  , RoverBodyBuilder = require('/model/movable/RoverBodyBuilder')
  , RoverNodeBuilder = require('/model/movable/RoverNodeBuilder')
  , Rover    = require('/model/movable/Rover')
  , box2d    = require('/libs/box2d')
  , bc       = require('/libs/boxedCocos')
  , jsein    = require('/libs/jsein').registerCtorLocator(require('/model/infra/ctorLocator'));

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Spavengers () {
	// You must always call the super class constructor
    Spavengers.superclass.constructor.call(this);

    var vlayer = new nodes.Node();
    var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);
    
    var jsonSrc = __jah__.resources['/resources/data/stars/sol/earth/liberty/field.json'].data;
    var field = jsein.parse(jsonSrc);
    var sd = field.getChild(0);
    
    var nf = new NodeFactory();
    var nb = new (require('/model/surface/SurfaceNodeBuilder'));
    nb.nodeFactory = nf;
    nb.makeNodes(sd);
    nb.attachNodes(sd, vlayer);
    
    var sbb = new (require('/model/surface/SurfaceBodyBuilder'))(world);
    sbb.makeBodies(sd);
    
    this.addChild(vlayer);
    
    var car = new Rover();
    car.location = ccp(3,3);
    car.size = new geo.Size(2.27, 1.16);
    car.angle = Math.PI / 2;
    
    var rnb = new RoverNodeBuilder(nf);
    this.node = rnb.makeNode(car);
    rnb.attachNode(car, vlayer);

    var rbb = new RoverBodyBuilder(world);
    this.body = rbb.makeBody(car);

    this.npcs = [];
    this.npcBodies = [];
    
    for (var i = 0; i<15; i++) {
    	var npc = new Rover();
    	npc.size = car.size;
    	npc.location = ccp(3 + Math.random() * 10, 3 + Math.random() * 10);
    	npc.angle = Math.random() * Math.PI * 2;
    	rnb.makeNode(npc);
    	rnb.attachNode(npc,vlayer);
    	this.npcs.push(npc);
    	this.npcBodies.push(rbb.makeBody(npc));
    }
    
    
    //var label = new Label({ string:   'Hello World', fontName: 'Arial', fontSize: 20});
    //label.position = new Point(size.width / 2, size.height / 2);
    
    this.isMouseEnabled = true;
    this.isKeyboardEnabled = true;
    this.vlayer = vlayer;
    this.car = car;
    
    this.speed = this.torque = 0;
    
    var me = this;
    this.go = function() {
    	/*
    	me.node.runAction(new actions.MoveBy({duration: 0.07, position: ccp(0, me.speed)}));
    	me.vlayer.runAction(new actions.MoveBy({duration: 0.07, position: ccp(0, -me.speed)}));
    	if (me.speed != 0 && me.speed * me.speed < 225) {
    		me.speed = me.speed * 1.3;
    	}
    	console.log('moved by ' + me.speed);
    	*/
    };
    
    // start BOX2d !!!
    

    
    
    this.crosshair = new Sprite({file: '/resources/sprites/crosshair/yellow_outer.png'});
    this.addChild(this.crosshair);
    this.hud = new RoverHud(this);
    
    this.world = world;
    
    
    
    this.scheduleUpdate();
}

// Inherit from cocos.nodes.Layer
Spavengers.inherit(Layer, 
	{
	update: function(dt) {
		this.car.location = ccp(this.body.GetPosition().x, this.body.GetPosition().y);
		this.car.angle = this.body.GetAngle();

		for (var i = 0; i<this.npcs.length; i++) {
			var npc = this.npcs[i];
			npc.location = bc.pointize(this.npcBodies[i].GetPosition());
			npc.angle = this.npcBodies[i].GetAngle();
		}
		
		this.body.ApplyForce(bc.point2vec(geo.ccpMult(this.car.front, ccp(this.speed,this.speed))), this.car.rearPoint);
		this.body.ApplyTorque(this.torque);
		this.world.Step(dt, 10, 10);
		this.hud.feedSps();
		this.world.ClearForces();
		
		var size = Director.sharedDirector.winSize;
		this.vlayer.position = geo.ccpAdd(geo.ccpNeg(this.node.position), ccp(size.width / 2 ,size.height / 2));
		this.hud.feedFps();
	},
	mouseMoved: function(evt) {
    	this.crosshair.position = ccp(evt.locationInCanvas.x, evt.locationInCanvas.y);
    	},
    mouseDragged: function(evt){
    	//this.vlayer.position = geo.ccpAdd(this.vlayer.position, new geo.Point(evt.deltaX, evt.deltaY));
    } ,
	keyDown: function(evt) {
    		switch(evt.keyCode) {
    			case 68:
    			case 39:
    				this.torque = -15;
    				console.log('left');
    				break;
    			case 65:
    			case 37:
    				this.torque = 15;
    				console.log('right');
    				break;
    			case 87:
    			case 38:
    				this.speed = 50;
    				this.go();
    				this.moverUp = setInterval(this.go, 100);
    				console.log('go up');
    				break;
    			case 83:
    			case 40: 
    				this.speed = -50;
    				this.go();
    				this.moverDown = setInterval(this.go, 100);
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
				this.speed = 0;
				clearInterval(this.moverUp);
				clearInterval(this.moverDown);
				console.log('stop');
				break;
			case 65:
			case 68:
			case 37:
			case 39: 
				this.torque = 0;
				console.log('stop torque');
				break;
		}
	}
});

// Export the class so it can be accessed from outside this file
this.Spavengers = Spavengers;
