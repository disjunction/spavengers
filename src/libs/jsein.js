/**
 * "class-aware"2 JSON serializer-deserializer for node.js
 */
"use strict";

var jsein = function(){};
jsein.ctorLocators = [];

/**
 * converts the data object into an object of className
 * @param string className
 * @param Object data
 * @returns Object
 */
jsein.convertObject = function (className, data) {
    var obj = eval('new ' + className);
    for (var key in data) {
            eval('obj.' + key + '=data["' + key + '"]');
    }
    return obj;
};

/**
 * plain boring clone
 * @param obj
 * @param bool onlyContent - should the functions be skipped? 
 * @returns Object
 */
jsein.clone = function(obj, onlyContent) {
	var clone = {};
    for (var i in obj) {
        if (typeof obj[i] =="object")
            clone[i] = jsein.clone(obj[i], onlyContent);
        else {
        	if (onlyContent && typeof obj[i] == "function") continue;
            clone[i] = obj[i];
        }
    }
    return clone;
};

jsein.getClass = function(obj) {
	if (typeof obj != "object" || obj === null) throw new Error('calling getClass on non-object');
	var exp = /(\w+)\(/;
	return exp.exec(obj.constructor.toString())[1];
};

/**
 * clone and populate object with _t field recursively
 * _t contains the constructor name used when recovering the obj 
 *
 * @param Object obj
 */
jsein.cloneWithTypes = function(obj) {
	var clone = {},
		type = jsein.getClass(obj);
	for (var i in obj) {
		clone[i] = typeof obj[i] =="object"? jsein.cloneWithTypes(obj[i]) : obj[i]; 
    }
	
	if (type != 'Object') {
		clone._t = type;
	}
	return clone;
};


jsein.create = function(className) {
	try {
		var ctor = eval(className);
		if (typeof ctor == 'function') return new ctor();
	} catch (e) {
		if (!e instanceof ReferenceError) {
			throw e;
		} 
	};
	for (var i in jsein.ctorLocators) {
		ctor = jsein.ctorLocators[i](className);
		if (typeof ctor == 'function') return new ctor();
	}
	throw new Error('cannot find ctor for ' + className);
};

/**
 * registers global function used to find constructor by className
 * you can register multiple Ctors
 * @param Function locator
 */
jsein.registerCtorLocator = function(locator) {
	jsein.ctorLocators.push(locator);
};

/**
 * clone and recover classes for obj hierarchy based on _t property
 * @param obj
 */
jsein.recover = function(obj) {
	var clone = obj._t? jsein.create(obj._t) : {};
	for (var i in obj)
		if (i != '_t') 
			clone[i] = typeof obj[i] =="object"? jsein.recover(obj[i]) : obj[i];
    return clone;
};

jsein.parse = function(str) {
    return jsein.recover(JSON.parse(str));
};


jsein.stringify = function(obj, reviver) {
	return JSON.stringify(jsein.cloneWithTypes(obj), reviver);
};

module.exports = jsein;