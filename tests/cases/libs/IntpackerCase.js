var path = require('../../bootstrap.js').projectPath,
	Intpacker = require(path + '/libs/Intpacker');

exports.testPack = function(test) {
	var intpacker = new Intpacker();
	test.equal("H", intpacker.pack(7));
	test.equal("5h+", intpacker.pack(235646));
	test.done();
};

exports.testUnpack = function(test) {
	var intpacker = new Intpacker();
	test.equal(36, intpacker.unpack("k"));
	test.equal(8127881, intpacker.unpack("fAWJ"));
	test.done();
};