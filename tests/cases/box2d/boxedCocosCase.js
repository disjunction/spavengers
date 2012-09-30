var  path = require('../../bootstrap').projectPath,
     box2d = require(path + '/libs/box2d'),
     geo = require('geometry'),
     bc = require(path + '/libs/boxedCocos');

exports.testVecTranslations = function(test) {
	var vec = bc.point2vec(geo.ccp(5,7));
	test.equal(5, vec.x);
	test.equal(7, vec.y);
	test.done();
};