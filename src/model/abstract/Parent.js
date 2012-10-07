var intpacker = new (require('../../libs/Intpacker'))();

function Parent() {
	this.children = {};
	this.counter = 0;
}

Parent.inherit(Object, {
	children: {},
	counter: 0,
	get childIds() {
		var keys = [];
		for (var i in this.children) keys.push(i);
		return keys;
	},
	addChild: function(child) {
		if (child.childId == null || child.childId.length == 0) {
			while (child.childId == null || this.children[child.childId] != null)
				child.childId = intpacker.pack(this.counter++);
		}
		this.children[child.childId] = child;
	},
	getChild: function(childId) {
		return this.children[childId];
	},
	removeChildId: function(childId) {
		delete this.children[childId];
	},
	removeChild: function(child) {
		this.removeChildId(child.childId);
	}
});

module.exports = Parent;