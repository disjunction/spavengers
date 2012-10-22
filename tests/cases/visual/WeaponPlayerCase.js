"use strict";

var path = require('../../bootstrap.js').projectPath,
	WeaponPlayer = require(path + '/model/visual/WeaponPlayer');

exports.testBasicUsage = function(test) {
	var wp = new WeaponPlayer();
	test.done();
}