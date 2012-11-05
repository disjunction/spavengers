var path = require('../../bootstrap.js').projectPath,
	geo = require(path + '/libs/pointExtension');

function fuzzyEqual(v1, v2) {
	return Math.abs(v1 - v2) < 0.0001;
}

exports.testDistance = function(test) {
	var d = geo.ccpDistance({x: 1, y: 2}, {x: 5, y: 5});
	test.ok(d < 5.1 && d > 4.9);
	
	test.done();
};

exports.testFloorAngle = function(test) {
	var pi = Math.PI;
	
	test.ok(fuzzyEqual(-pi/2, geo.floorAngle(pi/2*3)));
	test.ok(fuzzyEqual(0.1, geo.floorAngle(2*pi + 0.1)));
	
	test.ok(fuzzyEqual(-pi/2, geo.floorAngle(pi/2*3)));
	test.ok(fuzzyEqual(pi/6, geo.floorAngle(-pi*11/6)));
	
	test.ok(fuzzyEqual(-pi/4*3, geo.floorAngle(-pi/4*3 + pi*2*76)));
	test.ok(fuzzyEqual(-pi/4*3, geo.floorAngle(-pi/4*3 - pi*2*76)));
	
	test.ok(fuzzyEqual(pi/1.5, geo.floorAngle(pi/1.5)));
	
	test.done();
};

exports.testRotateByAngle = function(test) {
	var pi = Math.PI;
	
	var point = geo.ccp(2,2),
		rotated = geo.ccpRotateByAngle(point, geo.PointZero(), pi/4);
	
	test.ok(fuzzyEqual(0, rotated.x));
	test.ok(fuzzyEqual(2.82843, rotated.y));
	
	test.done();
};

exports.testCcpMult = function(test) {
	var point = geo.ccp(3,-5),
		second = geo.ccpMult(point, 4);
	
	test.equal(12, second.x);
	test.equal(-20, second.y);
	
	test.done();
};