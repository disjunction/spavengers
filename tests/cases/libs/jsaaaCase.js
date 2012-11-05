var path = require('../../bootstrap.js').projectPath,
	jsaaa = require(path + '/libs/jsaaa'),
	audioMocks = require('../../mock/audioMocks');


exports.testAudioFactoryMock = function(test) {
	var factory = new audioMocks.AudioFactoryMock(),
		audio = factory.makeAudio('test');
	
	test.done();
};

exports.testSoundPlayer = function(test) {
	var factory = new audioMocks.AudioFactoryMock(),
		sp = new jsaaa.SoundPlayer(factory);
	
	sp.createSound({id: '1', url: 'bla'});
	sp.play('1');
	
	test.done();
};
