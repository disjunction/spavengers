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
	if (obj === null) return 'Object';
	
	if (typeof obj != "object") throw new Error('calling getClass on ' + typeof obj);
	var exp = /(\w+)\(/,
		res = exp.exec(obj.constructor.toString());
	if (!res || res.length < 2) {
		return 'Object';
	}
	return res[1];
};

/**
 * clone and populate object with _t field recursively
 * _t contains the constructor name used when recovering the obj 
 *
 * @param Object obj
 */
jsein.cloneWithTypes = function(obj, predefinedType) {
	if (obj === null) return null;
	var clone = Array.isArray(obj)? [] : {};
	var type = predefinedType? predefinedType : jsein.getClass(obj);

	for (var i in obj) {
		if (obj.__lookupGetter__(i) || obj.__lookupSetter__(i)) continue;
		if (typeof obj[i] =="object") {
			
			var lowType = jsein.getClass(obj[i]);
			
			clone[i] = jsein.cloneWithTypes(obj[i], lowType);
		} else {
			clone[i] = obj[i]; 
		}
    }
	
	if (type != 'Object' && !Array.isArray(obj)) {
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
	return jsein;
};

/**
 * clone and recover classes for obj hierarchy based on _t property
 * @param obj
 */
jsein.recover = function(obj) {
	if (obj === null) {
		return null;
	}
	var clone = obj._t? jsein.create(obj._t) : (Array.isArray(obj)? [] : {});
	for (var i in obj) {
	
		// VERY EVIL HACK ]:-)
		if (i == 'angleDeg') {
			clone.angle = obj[i] / 180 * Math.PI;
			continue;
		}
		
		if (i != '_t') 
			clone[i] = (typeof obj[i] == "object")? jsein.recover(obj[i]) : obj[i];
	}
    return clone;
};

jsein.parse = function(str) {
    return jsein.recover(JSON.parse(str));
};


jsein.stringify = function(obj, reviver) {
	return JSON.stringify(jsein.cloneWithTypes(obj), reviver);
};

module.exports = jsein;