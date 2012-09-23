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
  , NodeFactory      = require('/model/visual/NodeFactory').NodeFactory  
  ;

/**
 * @class Initial application layer
 * @extends cocos.nodes.Layer
 */
function Spavengers () {
	// You must always call the super class constructor
    Spavengers.superclass.constructor.call(this);

    // Get size of canvas
    var size = Director.sharedDirector.winSize;

    var vlayer = new nodes.Node();

    var sd = new (require('/model/surface/SurfaceDescriptor').SurfaceDescriptor);
    var el = new (require('/model/surface/SurfaceElement').SurfaceElement);
    el.file = 'stars/sol/earth/liberty/map';
    el.type = 'map';
    sd.push(el);
    
    var nf = new (require('/model/visual/NodeFactory').NodeFactory);
    var nb = new (require('/model/surface/SurfaceNodeBuilder').SurfaceNodeBuilder);
    nb.nodeFactory = nf;
    nb.makeNodes(sd);
    nb.attachNodes(sd, vlayer);
    this.addChild(vlayer);
    
    /*
    var map = new TMXTiledMap({ file: '/resources/data/stars/sol/earth/liberty/map.tmx'});
    map.position = ccp(0,0);
    this.addChild(map);
    */
    
    var carSprite = nf.makeSprite({texture: new Texture2D({file: '/resources/sprites/rovers/hull/car1.png'}),
    	//rect: geo.rectMake(0,0,200,200)
    });
    carSprite.position = ccp(0,0);
    
    var cannonSprite = new Sprite({file: '/resources/sprites/rovers/weapon/heavy_cannon.png'});
    cannonSprite.anchorPoint = ccp(0.5, 0.8); 
    cannonSprite.position = ccp(0,0);
    
    var node = new nodes.Node();
    
    node.addChild(carSprite);
    node.addChild(cannonSprite);
    node.position = ccp(100,100);
    vlayer.addChild(node);
        
    this.crosshair = new Sprite({file: '/resources/sprites/crosshair/yellow_outer.png'});
    this.addChild(this.crosshair);
    
    //var label = new Label({ string:   'Hello World', fontName: 'Arial', fontSize: 20});
    //label.position = new Point(size.width / 2, size.height / 2);
    
    this.isMouseEnabled = true;
    this.isKeyboardEnabled = true;
    this.node = node;
    this.vlayer = vlayer;
    
    var me = this;
    this.go = function() {
    	me.node.runAction(new actions.MoveBy({duration: 0.07, position: ccp(0, me.speed)}));
    	me.vlayer.runAction(new actions.MoveBy({duration: 0.07, position: ccp(0, -me.speed)}));
    	if (me.speed != 0 && me.speed * me.speed < 225) {
    		me.speed = me.speed * 1.3;
    	}
    	console.log('moved by ' + me.speed);
    };
}

// Inherit from cocos.nodes.Layer
Spavengers.inherit(Layer, 
	{
	mouseMoved: function(evt) {
    	this.crosshair.position = ccp(evt.locationInCanvas.x, evt.locationInCanvas.y);
    	},
    mouseDragged: function(evt){
    	this.vlayer.position = geo.ccpAdd(this.vlayer.position, new geo.Point(evt.deltaX, evt.deltaY));
    } ,
	keyDown: function(evt) {
    		switch(evt.keyCode) {
    			case 38: 
    				this.speed = 1;
    				this.go();
    				this.moverUp = setInterval(this.go, 100);
    				console.log('go up');
    				break;
    			case 40: 
    				this.speed = -1;
    				this.go();
    				this.moverDown = setInterval(this.go, 100);
    				console.log('go down');
    				break;
    		}
    	},
	keyUp: function(evt) {
		switch(evt.keyCode) {
			case 40:
			case 38: 
				this.speed = 0;
				clearInterval(this.moverUp);
				clearInterval(this.moverDown);
				console.log('stop');
				break;
		}
	}
});

// Export the class so it can be accessed from outside this file
this.Spavengers = Spavengers;
