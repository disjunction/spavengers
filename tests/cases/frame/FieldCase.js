var path = require('../../bootstrap.js').projectPath,
	Field = require(path + '/model/frame/Field'),
	jsein = require(path + '/libs/jsein');

exports.testFieldChildrenOperations = function(test) {
	var field = new Field();
	var o = new Object();
	field.addChild(o);
	test.ok(field.children.length > 0);
	
	test.equal(0, o.childId);
	
	o = new Object();
	o.prop = 'aaa';
	field.addChild(o);
	test.equal(1, o.childId);
	
	o = new Object();
	o.childId = 3;
	field.addChild(o);
	test.equals('aaa', field.getChild(1).prop);
	
	field.removeChild(o);
	
	test.done();
};

exports.testGetClass = function(test) {
	var field = new Field();
	test.equals('Field', jsein.getClass(field));
	test.done();
};