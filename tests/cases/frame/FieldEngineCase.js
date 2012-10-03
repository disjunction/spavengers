var path = require('../../bootstrap.js').projectPath,
	FieldEngine = require(path + '/model/frame/FieldEngine'),
	jsein = require(path + '/libs/jsein');

exports.testMakeWorld = function(test) {
	var e = new FieldEngine();
	e.makeWorld();
	
	test.done();
};
