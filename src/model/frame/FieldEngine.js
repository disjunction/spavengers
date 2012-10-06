"use strict";

var
    geo      = require('geometry')
  , Point    = geo.Point
  , ccp      = geo.ccp
  , Rect     = geo.Rect
  , RoverBodyBuilder = require('../movable/RoverBodyBuilder')
  , RoverNodeBuilder = require('../movable/RoverNodeBuilder')
  , Rover    = require('../movable/Rover')
  , box2d    = require('../../libs/box2d')
  , bc       = require('../../libs/boxedCocos')
  , jsein    = require('../../libs/jsein').registerCtorLocator(require('../infra/ctorLocator'));

function FieldEngine() {
    FieldEngine.superclass.constructor.call(this);
}

FieldEngine.inherit(Object, {
	makeWorld: function() {
	    var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);	    
	    var jsonSrc = require('../../resources/data/stars/sol/earth/liberty/field.json');
	    var field = jsein.recover(jsonSrc);
	    var sd = field.getChild(0);
	    	    
	    var sbb = new (require('../surface/SurfaceBodyBuilder'))(world);
	    sbb.makeBodies(sd);
	    
	    var size = new geo.Size(2.27, 1.16);
	    var rbb = new RoverBodyBuilder(world);

	    this.npcs = [];
	    this.npcBodies = [];
	    
	    for (var i = 0; i<20; i++) {
	    	var npc = new Rover();
	    	npc.size = size;
	    	npc.location = ccp(3 + Math.random() * 10, 3 + Math.random() * 10);
	    	npc.angle = Math.random() * Math.PI * 2;
	    	this.npcs.push(npc);
	    	var body = rbb.makeBody(npc);
	    	body.SetLinearVelocity(ccp(2,2));
	    	this.npcBodies.push(body);
	    	field.addChild(npc);
	    }
	    
	    this.cars = [];
	    this.carBodies = [];
	    
	    this.field = field;
	    this.speed = this.torque = 0;
	    this.world = world;
	},
	updateField: function() {
		for (var i = 0; i<this.npcs.length; i++) {
			var o = this.npcs[i];
			o.location = bc.pointize(this.npcBodies[i].GetPosition());
			if (Math.random() > 0.9995) {
				this.npcBodies[i].SetLinearVelocity(ccp(Math.random()*20 - 10,Math.random()*20 - 10));
				this.npcBodies[i].SetAwake(true);
			}
			o.angle = this.npcBodies[i].GetAngle();
			this.field.getChild(o.childId).awake = this.npcBodies[i].IsAwake();
		}
		
		for (var i = 0; i<this.cars.length; i++) {
			var o = this.cars[i];
			o.location = bc.pointize(this.carBodies[i].GetPosition());
			o.angle = this.carBodies[i].GetAngle();
			this.field.getChild(o.childId).awake = this.carBodies[i].IsAwake();
		}
		
		this.field._fullUpdatePack = null;
	},
	stepField: function() {
		if (!this.oldTime) this.oldTime = (new Date()).getTime();
		var newTime = (new Date()).getTime();
				
		for (var i = 0; i < this.cars.length; i++) {
			if (this.cars[i] != null && this.cars[i].torque != null && this.cars[i].torque !=0) {
				this.carBodies[i].ApplyTorque(this.cars[i].torque);
			}
			var thrust = this.cars[i].thrust;
			if (this.cars[i] != null && thrust != null && thrust !=0) {
				this.carBodies[i].ApplyForce(bc.point2vec(geo.ccpMult(this.cars[i].front, ccp(thrust, thrust))), this.cars[i].rearPoint);
			}
		}
		
		this.world.Step((newTime - this.oldTime)/1000, 10, 10);
		this.world.ClearForces();
		
		this.updateField();
		this.oldTime = newTime;
	},
	addCar: function() {
		var car = new Rover();
	    car.location = ccp(3,3);
	    car.size = new geo.Size(2.27, 1.16);
	    car.angle = 0;
	    
	    var rbb = new RoverBodyBuilder(this.world);
	    var carBody = rbb.makeBody(car);
	    this.cars.push(car);
	    this.carBodies.push(carBody);
	    
	    this.field.addChild(car);
	    
	    return car;
	},
	removeCar: function(car) {
		this.field.removeChild(car.childId);
	}
});

module.exports = FieldEngine;