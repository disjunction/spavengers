var AudioMock = function(url) {
	this.volume = 100;
	this.currentTime = 5;
	this.src = url;
	this.duration = 30;
	
	this.play = function(){};
	this.pause = function(){};
	this.load = function(){};
};

var AudioFactoryMock = function(){};
AudioFactoryMock.prototype.makeAudio = function(url) {
	return new AudioMock(url);
};

exports.AudioMock = AudioMock;
exports.AudioFactoryMock = AudioFactoryMock;