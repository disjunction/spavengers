var Entity = require('./Movable');

function Rover () {
    Rover.superclass.constructor.call(this);
}

Rover.inherit(Entity);

module.exports = Rover;