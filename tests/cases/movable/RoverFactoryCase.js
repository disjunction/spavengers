var path = require('../../bootstrap.js').projectPath,
	MountFactory = require(path + '/model/movable/MountFactory'),
	RoverFactory = require(path + '/model/movable/RoverFactory');

exports.testMakeRover = function(test) {
	var mf = new MountFactory(),
	    rf = new RoverFactory(mf);
	var car = rf.makeRover({hull: 'car1'});
	test.done();
};
