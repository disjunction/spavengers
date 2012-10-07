var path = require('../../bootstrap.js').projectPath,
	FieldEngine = require(path + '/model/frame/FieldEngine'),
	jsein = require(path + '/libs/jsein');

exports.testFullCase = function(test) {
	var e = new FieldEngine();
	e.makeWorld();
	e.stepField();
	e.updateField();
	test.done();
};

