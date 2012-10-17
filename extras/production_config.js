function Config() {
}

Config.inherit(Object, {
	// pixels per meter
	ppm: 36,
	resources: {
		baseUrl: 'http://spavengers.pluseq.com'
	},
	server: {
		port: 9600,
		socketUrl: 'http://spavengers.pluseq.com:9600/'
	}
});

module.exports = new Config;