"use strict";

var path = require('../../bootstrap.js').projectPath,
	geo    = require('geometry'),
	ccp    = geo.ccp,
	Rover = require(path + '/model/movable/Rover'),
	RoverNodeBuilder = require(path + '/model/movable/RoverNodeBuilder'),
	NodeFactoryMock = require('../../mock/NodeFactoryMock'),
	LayerMock = require('../../mock/LayerMock');

exports.testMakeAndAttachRoverNode = function(test) {
	var r = new Rover();
	r.size = ccp(8,3);
	r.location = ccp(10,20);
		
	var nf = new NodeFactoryMock(),
	    l = new LayerMock();
	
	var builder = new RoverNodeBuilder(nf);
	var node = builder.makeNode(r);
	test.ok(node.children.length > 0);
	
	builder.attachNode(r, l);
	test.ok(r.isAttached);
	
	test.done();
};