var path = require('../../bootstrap.js').projectPath,
	geo = require(path + '/libs/pointExtension');

exports.testDistance = function(test) {
	var d = geo.ccpDistance({x: 1, y: 2}, {x: 5, y: 5});
	test.ok(d < 5.1 && d > 4.9);
	
	test.done();
};

exports.testFloorAngle = function(test) {
	function fuzzyEqual(v1, v2) {
		return Math.abs(v1 - v2) < 0.0001;
	}
	
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
