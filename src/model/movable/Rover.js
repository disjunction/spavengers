var Movable = require('./Movable');

function Rover () {
    Rover.superclass.constructor.call(this);
    this.mounts = {};
}

Rover.inherit(Movable, {
	mounts: {}
});

module.exports = Rover;