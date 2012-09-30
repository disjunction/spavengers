"use strict";

var path = require('../../bootstrap.js').projectPath,
	geo    = require('geometry'),
	ccp    = geo.ccp,
	Rover = require(path + '/model/movable/Rover'),
	RoverBodyBuilder = require(path + '/model/movable/RoverBodyBuilder'),
	box2d = require(path + '/libs/box2d');

exports.testSimplyMakeRoverBody = function(test) {
	var r = new Rover();
	r.size = ccp(8,3);
	r.location = ccp(10,20);
	
	var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            true //allow sleep
        );
	
	var builder = new RoverBodyBuilder(world);
	var body = builder.makeBody(r);
	
	test.equal(10, body.GetPosition().x);
	test.done();
};
