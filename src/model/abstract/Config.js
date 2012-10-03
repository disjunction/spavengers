function Config() {
}

Config.inherit(Object, {
	// pixels per meter
	ppm: 36,
	
	server: {
		port: 4444,
		socketUrl: 'http://spavengers.local:4444/'
	}
});

module.exports = new Config;