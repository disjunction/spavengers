// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

process.title = 'spavengers';

require('cocos2d/src/js_extensions');

var

geo      = require('geometry')
, Point    = geo.Point
, ccp      = geo.ccp
, Rect     = geo.Rect
, config   = require('./model/abstract/Config')
, FieldEngine = require('./model/frame/FieldEngine')
, box2d    = require('./libs/box2d')
, bc       = require('./libs/boxedCocos')
, jsein    = require('./libs/jsein').registerCtorLocator(require('./model/infra/ctorLocator'));

/**
 * just a wrapper around node http stuff, to avoid anon function in require
 */
function main() {
	var fieldEngine = new FieldEngine();
	fieldEngine.makeWorld();

	// Port where we'll run the socket.io server
	var io = require('socket.io').listen(config.server.port);
	
	/**
	 * guarantees that every user is unique in a given node process
	 */
	var clientCounter = 0; 
	
	/**
	 *  "assoc array" of client
	 */
	var clients = {};
	var me = this;
	
	setInterval(function(){
		fieldEngine.stepField();
	}, 20);
	
	io.set('log level', 1);
	
	var broadcastEventProxy = function(event) {
		 var e = jsein.clone(event),
		 	  type = e.type;
		 delete e.type;
		 io.sockets.emit(type, e);
	};
	fieldEngine.events.addListener('update', broadcastEventProxy);
	
	io.sockets.on('connection', function (socket) {
		 console.log((new Date()) + ' Connection !');
		 socket.emit('helo');
		 socket.emit('field', {fieldStr: jsein.stringify(fieldEngine.field)});
		 var car = fieldEngine.addCar();
		 console.log(car);
		 io.sockets.emit('addCar', {carStr: jsein.stringify(car)});
		 socket.emit('carInfo', {childId: car.childId});

		 var index = '' + clientCounter++;
		 console.log((new Date()) + ' index ' + index);
		 console.log((new Date()) + " new size of clients: " + Object.keys(clients).length);
		
		 var sentTime;
		 setInterval(function() {
			 if (fieldEngine.oldTime != sentTime) {
				 sentTime = fieldEngine.oldTime;
				 socket.emit('updatePack', {updatePack: fieldEngine.field.fullUpdatePack});
			 }
		 }, 20);

		 socket.on('turn', function (data) {
			 if (car.mounts.rearCarrier) {
				 car.mounts.rearCarrier.angle = data * car.mounts.rearCarrier.angleFactor;
			 }
			 if (car.mounts.frontCarrier) {
				 car.mounts.frontCarrier.angle = data * car.mounts.frontCarrier.angleFactor;
			 }
		 });
		 
		 socket.on('towerRotor', function (data) {
			 fieldEngine.applyTowerRotor(car, data);
		 });
		 
		 // data: {mountName: ..., _l: ..., _a: ...}
		 socket.on('shootMount', function (data) {
			 fieldEngine.shootMount(car, data);
		 });
		 
		 socket.on('thrust', function (data) {
			 car.thrust = data;
		 });
		 
		 socket.on('disconnect', function() {
			console.log('disconnect for car: ' + car.childId);
			fieldEngine.removeCar(car);
			io.sockets.emit('removeChild', {childId: car.childId});
		 });
	
	});
}

new main();