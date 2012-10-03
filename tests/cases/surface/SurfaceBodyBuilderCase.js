"use strict";

var path = require('../../bootstrap.js').projectPath,
	geo    = require('geometry'),
	ccp    = geo.ccp,
	bc = require(path + '/libs/boxedCocos'),
	SurfaceElement = require(path + '/model/surface/SurfaceElement'),
	SurfaceBodyBuilder = require(path + '/model/surface/SurfaceBodyBuilder'),
	SurfaceDescriptor = require(path + '/model/surface/SurfaceDescriptor'),
	box2d = require(path + '/libs/box2d');

exports.testMakeBoxSurfaceBody = function(test) {
	var el = new SurfaceElement();
	el.size = ccp(6,5);
	el.location = ccp(10,20);
	
	var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true);
	
	var builder = new SurfaceBodyBuilder(world);
	var body = builder.makeBody(el);
	
	test.equal(10, body.GetPosition().x);
	test.done();
};

exports.testMakeCircleSurfaceBody = function(test) {
	var el = new SurfaceElement();
	el.size = ccp(6,6);
	el.location = ccp(15,20);
	el.shape = 'circle';
	
	var world = new box2d.b2World(new box2d.b2Vec2(0, 0), true),
		builder = new SurfaceBodyBuilder(world),
		body = builder.makeBody(el);
	
	test.equal(15, body.GetPosition().x);
	test.done();
};

exports.testMakeBatchBodies = function(test) {
	var sd = new SurfaceDescriptor(),
		world = new box2d.b2World(new box2d.b2Vec2(0, 0), true),
		builder = new SurfaceBodyBuilder(world),
		el1 = new SurfaceElement(),
		el2 = new SurfaceElement(),
		el3 = new SurfaceElement();
	
	el1.level = 1;
	el1.location = ccp(5, 6);
	el1.size = new geo.Size(3, 2);
	sd.addChild(el1);
    
	el2.level = 0;
	el2.location = ccp(7,7);
	el2.size = new geo.Size(3, 3);
	sd.addChild(el2);
    
	el3.level = 1;
	el3.location = ccp(10,8);
	el3.size = new geo.Size(2, 8);
	sd.addChild(el3);
	
    builder.makeBodies(sd, 1);

    var i = 0;
    for (var b = world.GetBodyList(); b; b = b.GetNext())
    {
    	if (b.GetFixtureList() != null) {
    		i++;
    	}
    }

    // the last one is parasite body
    test.equal(2, i);
    
    var self = this, testVec;
    var bodyLocator = function(fixture) {
    	if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), testVec)) {
    		self.selectedBody = fixture.GetBody();
    		return false;
    	}
        return true;
    };
    
    var getBodyAt = function(point) {
    	self.selectedBody = null;
        var aabb = new box2d.b2AABB();
        testVec = bc.point2vec(point);
        aabb.lowerBound.Set(point.x - 0.001, point.y - 0.001);
        aabb.upperBound.Set(point.x + 0.001, point.y + 0.001);
        world.QueryAABB(bodyLocator, aabb);
        return self.selectedBody;
    };

    test.ok(getBodyAt(ccp(6, 6)) != null);
    test.ok(getBodyAt(ccp(6.5, 7)) != null);
    test.ok(getBodyAt(ccp(6.6, 7)) == null);
    test.ok(getBodyAt(ccp(7, 7)) == null);
    test.ok(getBodyAt(ccp(9, 7)) != null);
    test.ok(getBodyAt(ccp(11, 7)) != null);
    test.ok(getBodyAt(ccp(11, 4)) != null);
    test.ok(getBodyAt(ccp(11, 3.9)) == null);
    test.ok(getBodyAt(ccp(11.5, 7)) == null);
    
	test.done();
};