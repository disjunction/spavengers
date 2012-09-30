/** 
 * cocos2d and box2d helper functions
 */
"use strict";

var geo = require('geometry'),
	box2d = require('./box2d');

exports.point2vec = function(point) {
	return new (box2d.b2Vec2)(point.x, point.y);
};

exports.pointize = function(vec) {
	return geo.ccp(vec.x, vec.y);
};
