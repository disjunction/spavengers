var path = require('../../bootstrap.js').projectPath,
	jsaaa = require(path + '/libs/jsaaa');

var AudioMock = function(url) {
	this.volume = 100;
	this.currentTime = 5;
	this.src = url;
	this.duration = 30;
	
	this.play = function(){};
	this.pause = function(){};
};

var AudioFactoryMock = function(){};
AudioFactoryMock.prototype.makeAudio = function(url) {
	return new AudioMock(url);
};

exports.testAudioFactoryMock = function(test) {
	var factory = new AudioFactoryMock(),
		audio = factory.makeAudio('test');
	
	test.done();
};

exports.testSoundPlayer = function(test) {
	var factory = new AudioFactoryMock(),
		sp = new jsaaa.SoundPlayer(factory);
	
	sp.createSound({id: '1', url: 'bla'});
	sp.play('1');
	
	test.done();
};
