var
    geo    = require('geometry'),
    config = require('../abstract/Config'),
    SurfaceNodeBuilder = require('../surface/SurfaceNodeBuilder'),
    RoverNodeBuilder = require('../movable/RoverNodeBuilder'),
    ccp    = geo.ccp;

function FieldClient(field, nodeFactory) {
	FieldClient.superclass.constructor.call(this);
	this.field = field;
	this.nodeFactory = nodeFactory;
	this.rovers = [];
	this.surfaces = [];
}

FieldClient.inherit(Object, {
	attachNodes: function(layer) {
		var snb = new SurfaceNodeBuilder(this.nodeFactory),
			rnb = new RoverNodeBuilder(this.nodeFactory);
		
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
	},
	update: function() {
		if (this.updated) {
			for (var i in this.updatePack.movable) {
	    		var el = this.updatePack.movable[i];
	    		if (el != null) {
		    		this.field.getChild(i).location = el.l;
		    		this.field.getChild(i).angle = el.a;
	    		}
	    	}
			this.updated = false;
		}
	}
});

module.exports = FieldClient;