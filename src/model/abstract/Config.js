function Config() {
}

Config.inherit(Object, {
	// pixels per meter
	ppm: 36,
	resources: {
		baseUrl: 'http://spavengers.local'
	},
	server: {
		port: 9600,
		socketUrl: 'http://spavengers.local:9600/'
	}
});

module.exports = new Config;