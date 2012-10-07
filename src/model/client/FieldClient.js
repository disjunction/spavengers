var
    geo    = require('geometry'),
    config = require('../abstract/Config'),
    MountNodeBuilder = require('../movable/MountNodeBuilder'),
    SurfaceNodeBuilder = require('../surface/SurfaceNodeBuilder'),
    RoverNodeBuilder = require('../movable/RoverNodeBuilder'),
    ccp    = geo.ccp;

function FieldClient(field, nodeFactory) {
	FieldClient.superclass.constructor.call(this);
	this.field = field;
	this.nodeFactory = nodeFactory;
	this.mountNodeBuilder = new MountNodeBuilder(nodeFactory);
	this.roverNodeBuilder = new RoverNodeBuilder(this.mountNodeBuilder);
	this.surfaceNodeBuilder = new SurfaceNodeBuilder(nodeFactory);
	
	this.rovers = [];
	this.surfaces = [];
}

FieldClient.inherit(Object, {
	attachNodes: function(layer) {
		var snb = this.surfaceNodeBuilder,
			rnb = this.roverNodeBuilder;
		
		this.rovers = [];
		this.surfaces = [];
				
		for (var i in this.field.children) {
			var el = this.field.getChild(i);
			if (el.frontPoint) {
				this.rovers[i] = el;
				rnb.attachNode(el, layer);
			} else {
				this.surfaces[i] = el;
				snb.makeNodes(el);
				snb.attachNodes(el, layer);
			}
		}
		
		this.layer = layer;
	},
	update: function() {
		if (this.updated) {
			for (var i in this.updatePack.movable) {
	    		var el = this.updatePack.movable[i];
	    		if (el != null) {
	    			if (this.field.getChild(i)) {
			    		this.field.getChild(i).location = el.l;
			    		this.field.getChild(i).angle = el.a;
	    			}
	    		}
	    	}
			this.updated = false;
		}
	},
	addCar: function(car) {
		this.field.addChild(car);
		this.rovers.push(car);
		this.roverNodeBuilder.attachNode(car, this.layer);
	},
	removeChildId: function(childId) {
		console.log(this.field.getChild(childId).node);
		this.layer.removeChild(this.field.getChild(childId).node);
		this.field.removeChildId(childId);
	}
});

module.exports = FieldClient;