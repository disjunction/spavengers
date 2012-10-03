"use strict";

var box2d = require('../../libs/box2d');

function SurfaceBodyBuilder (world) {
	SurfaceBodyBuilder.superclass.constructor.call(this);
    this.world = world;
};

SurfaceBodyBuilder.inherit(Object, {
	/**
	 * @param SurfaceElement el
	 * @return box2d.b2Body
	 */
	makeBody: function(el) {
	    var fixDef = new box2d.b2FixtureDef;
	    fixDef.density = 1.0;
	    fixDef.friction = 0.8;
	    fixDef.restitution = 0.05;
	    switch (el.shape) {
	    	case 'box':
	    	    fixDef.shape = new box2d.b2PolygonShape;
	    	    fixDef.shape.SetAsBox(el.size.width / 2, el.size.height / 2);
	    	    break;
	    	case 'circle':
	    		fixDef.shape = new box2d.b2CircleShape(el.size.width / 2);
	    	    break;
	    }
	    
	    var bodyDef = new box2d.b2BodyDef;
	    bodyDef.type = box2d.b2Body.b2_staticBody;
	    bodyDef.position.Set(el.location.x, el.location.y);
	    
	    var body = this.world.CreateBody(bodyDef);
	    body.CreateFixture(fixDef);
	    body.SetAngle(el.angle);
	    return body;
	},

	/**
	 * @param SurfaceDescriptor sd
	 * @param int level - create bodies only for this level
	 * @return void
	 */
	makeBodies: function(sd, level) {
		if (null == level) level = 1;
		
		for (var i = 0; i < sd.children.length; i++) {
			var el = sd.children[i];
			if (el.level == level) {
				this.makeBody(el);
			}
		};
	}
});

module.exports = SurfaceBodyBuilder;