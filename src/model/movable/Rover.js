var Movable = require('./Movable');

function Rover () {
    Rover.superclass.constructor.call(this);
}

Rover.inherit(Movable);

module.exports = Rover;