var
    geo    = require('geometry'),
    ccp    = geo.ccp,
    Parent = require('../abstract/Parent');

function Field() {
    Field.superclass.constructor.call(this);
	this.size = ccp(100, 100);
	this.children = Array();
}

Field.inherit(Parent, {
});

Field.fromObject = function(o) {
	
};

module.exports = Field;