"use strict";

var path = require('../../bootstrap.js').projectPath,
	WeaponPlayer = require(path + '/model/visual/WeaponPlayer'),
	jsaaa = require(path + '/libs/jsaaa'),
	audioMocks = require('../../mock/audioMocks');

exports.testBasicUsage = function(test) {
	var field = {},
		animator = {},
		player = new jsaaa.SoundPlayer(new audioMocks.AudioFactoryMock()),
		ego = {};
	
	var wp = new WeaponPlayer(field, animator, player, ego);
	test.done();
};