/**
 * additions to cocos2d-js geometry.js in accordance with iphone version:
 * https://github.com/cocos2d/cocos2d-iphone/blob/master-v2/cocos2d/Support/CGPointExtension.m
 */

// include geo from cocos2d
var geo = require('geometry');

geo.ccpLengthSQ = function(v) {
	return v.x * v.x + v.y * v.y;
};

geo.ccpLength = function(v) {
	return Math.sqrt(geo.ccpLengthSQ(v));
};


geo.ccpDistance = function(v1, v2) {
	return geo.ccpLength(geo.ccpSub(v1, v2));
};

geo.ccpRotateByAngle = function(v, pivot, angle) {
	var r = geo.ccpSub(v, pivot),
		cosa = Math.cos(angle),
		sina = Math.sin(angle),
		t = r.x;
	
	r.x = t*cosa - r.y*sina + pivot.x;
	r.y = t*sina + r.y*cosa + pivot.y;
	return r;
};

/////// ADDITIONAL (non-cocos2d extensions)

geo.ccp2Angle = function(point) {
	return Math.atan2(point.y, point.x);
}

/**
 * converts any angle to [-pi; pi]
 * @param Float a
 * @returns Float
 */
geo.floorAngle = function(a) {
	var pi = Math.PI;
	if (a > pi || a < -pi) {
		a -= Math.floor(a / 2 / pi) * 2 * pi;
		if (a > pi) a -= 2 * pi;
		if (a < -pi) a += 2 * pi;
	}
	return a;
};

module.exports = geo;