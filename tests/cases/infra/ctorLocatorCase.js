var path = require('../../bootstrap').projectPath,
	Rover = require(path + '/model/movable/Rover'),
	ctorLocator = require(path + '/model/infra/ctorLocator'),
	jsein = require(path + '/libs/jsein');

exports.testCtorFoundable = function(test) {
	var json = require(path + '/resources/data/stars/sol/earth/liberty/field.json');
	jsein.registerCtorLocator(ctorLocator);
	var field = jsein.recover(json);
	test.notEqual(null, field.children.A.getChild("A"));
	test.done();
};
