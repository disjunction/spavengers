//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License

Reyode.EventDispatcher = function() {
	this.listeners = {};
};
Reyode.EventDispatcher.prototype = {
	constructor: Reyode.EventDispatcher,
	addListener: function (type, listener, context) {
		listener.context = context;
		if (typeof this.listeners[type] == "undefined"){
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
	},
	fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }
        if (!event.type){  //false
            throw new Error("Event object missing 'type' property.");
        }
        
        if (typeof this.listeners[event.type] != 'undefined'){
            var listeners = this.listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                var context = listeners[i].context == null? this : listeners[i].context;
            	listeners[i].call(context, event);
            }
        }
    },
    removeListener: function(type, listener, context){
    	listener.context = context;
        if (this._listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};
