var
	geo = require('geometry'),
	container = {
		Field: require('../frame/Field'),
		SurfaceDescriptor: require('../surface/SurfaceDescriptor'),
		SurfaceElement: require('../surface/SurfaceElement'),
		Movable: require('../movable/Movable'),
		Rover: require('../movable/Rover'),
		Point: geo.Point,
		Size: geo.Size
	};

function ctorLocator(name) {
	if (container[name]) {
		return container[name];
	}
	return false;
}

module.exports = ctorLocator;