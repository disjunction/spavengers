var path = require('../../bootstrap.js').projectPath,
	geo = require('geometry'),
	MountFactory = require(path + '/model/movable/MountFactory'),
	RoverFactory = require(path + '/model/movable/RoverFactory'),
	RoverEngine = require(path + '/model/movable/RoverEngine'),
	RoverBodyBuilder = require(path + '/model/movable/RoverBodyBuilder'),
	box2d = require(path + '/libs/box2d');

/**
 * this test is too big :(
 * @param test
 */
exports.testBasicUsage = function(test) {
	var mf = new MountFactory(),
	    rf = new RoverFactory(mf),
	    field = {},
	    roverEngine = new RoverEngine(field);
	
	var car = rf.makeRover({hull: 'car1', rearEngine: 'electro1', rearCarrier: 'wheel'});
	
	
	var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            true //allow sleep
        );
	
	var builder = new RoverBodyBuilder(world);
	var roverBody = builder.makeBody(car);
	
	// force is applied
	test.equal(0, roverBody.m_force.x);
	roverEngine.applyThrust(roverBody, car);
	test.notEqual(0, roverBody.m_force.x);
	
	var force = roverBody.m_force,
		force_x = force.x;
	
	// force decreases because of air resistance
	roverBody.SetLinearVelocity(geo.ccp(2, 2));
	roverEngine.applyAirResistence(roverBody, car);
	test.ok(roverBody.m_force.x < force_x);
	
	test.done();
};