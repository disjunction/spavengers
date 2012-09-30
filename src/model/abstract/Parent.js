function Parent() {
}

Parent.inherit(Object, {
	children: [],
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

module.exports = Parent;