"use strict";

var box2d = require('../../libs/box2d');

function SurfaceBodyBuilder (world) {
	SurfaceBodyBuilder.superclass.constructor.call(this);
    this.world = world;
};

SurfaceBodyBuilder.inherit(Object, {
	makeBody: function(el) {
	    var fixDef = new box2d.b2FixtureDef;
	    fixDef.density = 1.0;
	    fixDef.friction = 0.8;
	    fixDef.restitution = 0.05;
	    switch (el.shape) {
	    	case 'box':
	    	    fixDef.shape = new box2d.b2PolygonShape;
	    	    fixDef.shape.SetAsBox(el.size.width, Surface.size.height);
	    	    break;
	    	case 'circle':
	    		fixDef.shape = new box2d.b2CircleShape(el.size.width);
	    	    break;
	    }
	    
	    var bodyDef = new box2d.b2BodyDef;
	    bodyDef.type = box2d.b2Body.b2_staticBody;
	    
	    bodyDef.position.Set(el.location.x, el.location.y);
	    
	    var body = this.world.CreateBody(bodyDef);
	    body.CreateFixture(fixDef);
	    return body;
	}
});

module.exports = SurfaceBodyBuilder;