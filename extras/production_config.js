function Config() {
}

Config.inherit(Object, {
	// pixels per meter
	ppm: 36,
	
	server: {
		port: 9600,
		socketUrl: 'http://spavengers.pluseq.com:4444/'
	}
});

module.exports = new Config;