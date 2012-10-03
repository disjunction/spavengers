"use strict";

var box2d = require('../../libs/box2d');

function RoverBodyBuilder (world) {
	RoverBodyBuilder.superclass.constructor.call(this);
    this.world = world;
};

RoverBodyBuilder.inherit(Object, {
	makeBody: function(rover) {
	    var fixDef = new box2d.b2FixtureDef;
	    fixDef.density = 2.0;
	    fixDef.friction = 0.95;
	    fixDef.restitution = 0.5;
	    fixDef.shape = new box2d.b2PolygonShape;
	    fixDef.shape.SetAsBox(rover.size.width / 2, rover.size.height / 2);
	    
	    var bodyDef = new box2d.b2BodyDef;
	    bodyDef.type = box2d.b2Body.b2_dynamicBody;
	    
	    bodyDef.position.Set(rover.location.x, rover.location.y);
	    bodyDef.linearDamping = 0.6;
	    bodyDef.angularDamping = 0.95;
	    
	    var body = this.world.CreateBody(bodyDef);
	    body.SetAngle(rover.angle); 
	    body.CreateFixture(fixDef);
	    return body;
	}
});

module.exports = RoverBodyBuilder;