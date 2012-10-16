"use strict";

var path = require('../../bootstrap.js').projectPath,
	EventDispatcher = require(path + '/libs/EventDispatcher');

exports.testBasicUsage = function(test) {
	var dispatcher = new EventDispatcher(),
		marker = 1;
	
	function incMarker() {
		marker++;
	}
	
	// bind twice, so it will be fired twice
	dispatcher.addListener('marker', incMarker);
	dispatcher.addListener('marker', incMarker);
	
	dispatcher.fire({type: 'marker'});
	dispatcher.fire('marker');
	
	test.equal(5, marker);
	
	test.done();
};

exports.testBinding = function(test) {
	function MarkerHolder() {
		this.marker = 1;
		this.inc = function() {
			this.marker++;
		};
	}
	
	var dispatcher = new EventDispatcher(),
		holder = new MarkerHolder();
		
	dispatcher.addListener('marker', holder.inc.bind(holder));
	dispatcher.fire('marker');
	
	test.equal(2, holder.marker);
	
	test.done();
};

exports.testRemoval = function(test) {
	var dispatcher = new EventDispatcher(),
	marker = 1;

	function incMarker() {
		marker++;
	}
	
	dispatcher.addListener('marker', incMarker);
	dispatcher.fire('marker');
	dispatcher.removeListener('marker', incMarker);
	dispatcher.fire('marker');
	
	test.equal(2, marker);
	
	test.done();
};