var path = require('../../bootstrap.js').projectPath,
	geo    = require('geometry'),
	ccp    = geo.ccp,
	Movable = require(path + '/model/movable/Movable');

exports.testAngleChanges = function(test) {
	var m = new Movable();
	m.size = new geo.Size(2,1);
	
	test.equal(0, m.angle);
	test.equal(2, m.size.width);
	
	var vec = m.front;
	test.equal(1, vec.x);
	test.equal(0, vec.y);
	
	m.angle = Math.PI / 6;
	vec = m.front;
	test.equal(0.5, Math.round(vec.y*10)/10);
	
	test.done();
};

exports.testFrontRearPoints = function(test) {
	var m = new Movable();
	m.size = new geo.Size(6,4);
	m.location = ccp(10,20);
	
	test.equal(13, Math.round(m.frontPoint.x));
	
	m.angle = Math.PI / 2;
		
	test.equal(10, Math.round(m.frontPoint.x));
	test.equal(23, Math.round(m.frontPoint.y));

	test.equal(10, Math.round(m.rearPoint.x));
	test.equal(17, Math.round(m.rearPoint.y));

	
	test.done();
};

