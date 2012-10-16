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
  
  , SurfaceDescriptor    = require('../surface/SurfaceDescriptor')
  , SurfaceElement    = require('../surface/SurfaceElement')
  
  , box2d    = require('../../libs/box2d')
  , bc       = require('../../libs/boxedCocos')
  , jsein    = require('../../libs/jsein').registerCtorLocator(require('../infra/ctorLocator'))
  , RayCaster = require('../../libs/RayCaster')
  , EventDispatcher  = require('../../libs/EventDispatcher');

function FieldEngine() {
    FieldEngine.superclass.constructor.call(this);
    this.mountFactory = new MountFactory();
    this.roverFactory = new RoverFactory(this.mountFactory);
    
    this.events = new EventDispatcher();
}

function round3(x) {
	return Math.round(x*1000)/1000;
}

FieldEngine.inherit(Object, {
	makeWorld: function() {
	    var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);	    
	    var jsonSrc = require('../../resources/data/stars/sol/earth/liberty/field.json');
	    var field = jsein.recover(jsonSrc);
	    
	    var sd = field.getChild("A");
	    
	    var sbb = new (require('../surface/SurfaceBodyBuilder'))(world);
	    sbb.makeBodies(sd);
	    
    	function makeEl() {
    		var el = new SurfaceElement();
	    	el.type = "sprite";
	    	el.file = "city/house1";
	    	el.size = geo.sizeMake(10,6);
	    	el.angle = 0;
	    	el.level = 1;
    		return el;
    	}
	    
	    // random houses
	    var sd = new SurfaceDescriptor();
	    for (var i = 0; i < 50; i++) {
	    	var el = makeEl();
	    	el.location = ccp(20 + Math.random() * 100, 20 + Math.random() * 100);
	    	el.angle = Math.random() * Math.PI * 2;
	    	sd.addChild(el);
	    }
	    field.addChild(sd);
	    sbb.makeBodies(sd);
	    
	    // margin houses
	    var sd = new SurfaceDescriptor();
	    
	    for (var i = -1; i < 28; i++) {	    	
	    	var el;
	    	
	    	el = makeEl();
	    	el.location = ccp(i * 10 + 5, 280-3);
	    	sd.addChild(el);
	    	
	    	el = makeEl();
	    	el.location = ccp(i * 10 + 5, -3);
	    	sd.addChild(el);
	    	
	    	el = makeEl();
	    	el.angle = Math.PI/2;
	    	el.location = ccp(-3, i * 10 + 5);
	    	sd.addChild(el);
	    	
	    	el = makeEl();
	    	el.angle = Math.PI/2;
	    	el.location = ccp(280-3, i * 10 + 5);
	    	sd.addChild(el);
	    }
	    field.addChild(sd);
	    sbb.makeBodies(sd);
	    
	    // random rovers
	    var rbb = new RoverBodyBuilder(world);

	    this.npcs = new Parent();
	    this.npcBodies = new Parent();
	    
	    this.bodies = new Parent();
	    
	    for (var i = 0; i<30; i++) {
	    	var npc = this.roverFactory.makeRover({hull: 'bobik'});
	    	npc.location = ccp(3 + Math.random() * 30, 3 + Math.random() * 30);
	    	npc.angle = Math.random() * Math.PI * 2;
	    	
	    	// first insert into field, to get a unique childId
	    	field.addChild(npc);
	    	
	    	this.npcs.addChild(npc);
	    	var body = rbb.makeBody(npc);
	    	body.SetLinearVelocity(ccp(2,2));
	    	
	    	this.npcBodies.addChild(body);
	    	this.bodies.addChild(body);
	    }
	    
	    this.cars = new Parent();
	    this.carBodies = new Parent();
	    
	    this.field = field;
	    this.speed = this.torque = 0;
	    this.world = world;
	    this.rayCaster = new RayCaster(world);
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
				carBody.ApplyForce(geo.ccpMult(car.front, ccp(thrust, thrust)), car.rearPoint);
			}
			if (car.towerOmega) {
				for (var j in car.towerOmega) {
					if (car.mounts[j] && car.towerOmega[j] != 0) {
						car.mounts[j].angle += car.towerOmega[j] * (newTime - this.oldTime) / 1000;
						carBody.SetAwake(true);
					}
				}
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
	    this.bodies.addChild(carBody);
	    
	    return car;
	},
	removeCar: function(car) {
		this.world.DestroyBody(this.carBodies.getChild(car.childId));
		this.carBodies.removeChildId(car.childId);
		this.cars.removeChildId(car.childId);
		this.bodies.removeChildId(car.childId);
		this.field.removeChildId(car.childId);
	},
	
	/**
	 * @param object opts {mountName: ..., _l: location, _a: angle} 
	 */
	shootMount: function(car, data) {
		var d = 7;
		
		var forceUnit = ccp(Math.cos(data._a), Math.sin(data._a));
		this.bodies.getChild(car.childId).ApplyForce(geo.ccpMult(forceUnit, ccp(-100,-100)), data._l);
		
		var cast = this.rayCaster.RayCastOneAngular(data._l, d, data._a, [car]);
		if (cast) {
			var hit = ccp(data._l.x + d * Math.cos(data._a) * cast.fraction,
					      data._l.y + d * Math.sin(data._a) * cast.fraction);
			
			var damage = 10;
			
			if (cast.body.childId) {
				var el = this.field.getChild(cast.body.childId);
				
				damage = 50 * (1 - cast.fraction);
				
				
				// if it's a dynamic hitable element
				if (el && el.mounts) {
					cast.body.ApplyForce(geo.ccpMult(forceUnit, ccp(damage,damage)), hit);
				}
			}
			
			this.events.fire({type: 'update', 
				actions: [{_t: 'hit', 
						   _l: hit,
						   _a: Math.random() * Math.PI * 2,
						   damage: damage},
						 ]});
		} else {
			this.events.fire({type: 'update', 
				actions: [{_t: 'hitSound', 
						   _l: data._l}
						 ]});
		}
	}
});

module.exports = FieldEngine;