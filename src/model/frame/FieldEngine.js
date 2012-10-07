"use strict";

var
    geo      = require('geometry')
  , Point    = geo.Point
  , ccp      = geo.ccp
  , Rect     = geo.Rect
  , Parent = require('../abstract/Parent')
  , MountFactory = require('../movable/MountFactory')
  , RoverFactory = require('../movable/RoverFactory')
  , RoverBodyBuilder = require('../movable/RoverBodyBuilder')
  , RoverNodeBuilder = require('../movable/RoverNodeBuilder')
  , Rover    = require('../movable/Rover')
  , box2d    = require('../../libs/box2d')
  , bc       = require('../../libs/boxedCocos')
  , jsein    = require('../../libs/jsein').registerCtorLocator(require('../infra/ctorLocator'));

function FieldEngine() {
    FieldEngine.superclass.constructor.call(this);
    this.mountFactory = new MountFactory();
    this.roverFactory = new RoverFactory(this.mountFactory);
}

FieldEngine.inherit(Object, {
	makeWorld: function() {
	    var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);	    
	    var jsonSrc = require('../../resources/data/stars/sol/earth/liberty/field.json');
	    var field = jsein.recover(jsonSrc);
	    var sd = field.getChild("A");
	    	    
	    var sbb = new (require('../surface/SurfaceBodyBuilder'))(world);
	    sbb.makeBodies(sd);
	    
	    var size = new geo.Size(2.27, 1.16);
	    var rbb = new RoverBodyBuilder(world);

	    this.npcs = new Parent();
	    this.npcBodies = new Parent();
	    
	    for (var i = 0; i<20; i++) {
	    	/*
	    	var npc = new Rover();
	    	npc.size = size;
	    	npc.location = ccp(3 + Math.random() * 10, 3 + Math.random() * 10);
	    	npc.angle = Math.random() * Math.PI * 2;
	    	*/
	    	var npc = this.roverFactory.makeRover({hull: 'bobik'});
	    	npc.location = ccp(3 + Math.random() * 10, 3 + Math.random() * 10);
	    	npc.angle = Math.random() * Math.PI * 2;
	    	
	    	// first insert into field, to get a unique childId
	    	field.addChild(npc);
	    	
	    	this.npcs.addChild(npc);
	    	var body = rbb.makeBody(npc);
	    	body.SetLinearVelocity(ccp(2,2));
	    	
	    	// make sure the body has the same childId as the npc in field
	    	body.childId = npc.childId;
	    	
	    	this.npcBodies.addChild(body);
	    }
	    
	    this.cars = new Parent();
	    this.carBodies = new Parent();
	    
	    this.field = field;
	    this.speed = this.torque = 0;
	    this.world = world;
	},
	updateField: function() {
		for (var i in this.npcs.children) {
			var o = this.npcs.getChild(i);
			if (!this.npcBodies.getChild(i)) {
				console.log('empty: ' + i);
			}
			o.location = bc.pointize(this.npcBodies.getChild(i).GetPosition());
			if (Math.random() > 0.9995) {
				this.npcBodies.getChild(i).SetLinearVelocity(ccp(Math.random()*20 - 10,Math.random()*20 - 10));
				this.npcBodies.getChild(i).SetAwake(true);
			}
			o.angle = this.npcBodies.getChild(i).GetAngle();
			this.field.getChild(o.childId).awake = this.npcBodies.getChild(i).IsAwake();
		}
		
		for (var i in this.cars.children) {
			var o = this.cars.getChild(i);
			o.location = bc.pointize(this.carBodies.getChild(i).GetPosition());
			o.angle = this.carBodies.getChild(i).GetAngle();
			this.field.getChild(o.childId).awake = this.carBodies.getChild(i).IsAwake();
		}
		
		this.field._fullUpdatePack = null;
	},
	stepField: function() {
		if (!this.oldTime) this.oldTime = (new Date()).getTime();
		var newTime = (new Date()).getTime();
				
		for (var i in this.cars.children) {
			var car = this.cars.children[i];
			var carBody  = this.carBodies.children[i];
			if (car != null && car.torque != null && car.torque !=0) {
				carBody.ApplyTorque(car.torque);
			}
			var thrust = car.thrust;
			if (car != null && thrust != null && thrust !=0) {
				carBody.ApplyForce(bc.point2vec(geo.ccpMult(car.front, ccp(thrust, thrust))), car.rearPoint);
			}
		}
		
		this.world.Step((newTime - this.oldTime)/1000, 10, 10);
		this.world.ClearForces();
		
		this.updateField();
		this.oldTime = newTime;
	},
	addCar: function() {
		
		var car = this.roverFactory.makeRover({hull: 'car1', primary: 'heavy_cannon'});
	    car.location = ccp(3,3);
	    car.angle = 0;
	    
	    // get the childId
	    this.field.addChild(car);
	    
	    var rbb = new RoverBodyBuilder(this.world);
	    var carBody = rbb.makeBody(car);
	    carBody.childId = car.childId;
	    this.cars.addChild(car);
	    this.carBodies.addChild(carBody);
	    
	    return car;
	},
	removeCar: function(car) {
		this.world.DestroyBody(this.carBodies.getChild(car.childId));
		this.carBodies.removeChildId(car.childId);
		this.cars.removeChildId(car.childId);
		this.field.removeChildId(car.childId);
	}
});

module.exports = FieldEngine;