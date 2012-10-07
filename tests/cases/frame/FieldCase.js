var path = require('../../bootstrap.js').projectPath,
	Field = require(path + '/model/frame/Field'),
	jsein = require(path + '/libs/jsein');

exports.testFieldChildrenOperations = function(test) {
	var field = new Field();
	var o = new Object();
	field.addChild(o);
	test.equal("A", o.childId);
	
	o = new Object();
	o.prop = 'aaa';
	field.addChild(o);
	test.equal("B", o.childId);
	
	// if childId is assigned, then it's used
	o = new Object();
	o.childId = "abc";
	field.addChild(o);
	test.equal('aaa', field.getChild("B").prop);
	test.equal(null, field.getChild("C"));
	test.notEqual(null, field.getChild("abc"));
	
	// removal removes ;)
	test.ok(field.getChild("abc"));
	test.equal(3, field.childIds.length);
	field.removeChild(o);
	test.equal(null, field.getChild("abc"));
	test.equal(2, field.childIds.length);
	
	// inconsistent counter doesn't break the logic
	o = new Object();
	o.z = 'some';
	field.counter = 0;
	field.addChild(o);
	test.equal('some', field.getChild("C").z);
	
	test.done();
};

exports.testGetClass = function(test) {
	var field = new Field();
	test.equals('Field', jsein.getClass(field));
	test.done();
};