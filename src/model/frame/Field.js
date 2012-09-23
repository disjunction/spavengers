var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function Field() {
	this.size = ccp(100, 100);
	this.children = Array();
}

Field.inherit(Object, {
	
	
	
	
	
	///// CHILDREN
	
	addChild: function(child) {
		if (child.childId == null || !(child.childId >= 0)) {
			child.childId = this.children.length;
		}
		this.children[child.childId] = child;
	},
	getChild: function(childId) {
		return this.children[childId];
	},
	removeChild: function(child) {
		delete this.children[child.childId];
	}
});

Field.fromObject = function(o) {
	
};

exports.Field = Field;