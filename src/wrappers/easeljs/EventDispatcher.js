(function() {

    /*function EventDispatcher() {
        this.BaseEventDispatcher_constructor();
    }
    
    var element = facilis.extend(EventDispatcher, facilis.EventDispatcher);*/
	
	createjs.EventDispatcher._initialize=createjs.EventDispatcher.initialize;
	
	createjs.EventDispatcher.initialize=function(element){
		
		createjs.EventDispatcher._initialize(element);
		element.listeners = {};
		element.__addEventListener=element.addEventListener;
		element.__removeEventListener=element.removeEventListener;

		element.addListener=function(type, func, useCapture) {
			var listener=this.__addEventListener(type, func, useCapture);
			var list = this.listeners[type];
			if (!list) {
				list = [];
				this.listeners[type] = list;
			}
			list.push({listener:listener,func:func});
		}

		element.removeListener=function(type, ref) {
			var list = this.listeners[type];
			if (list) {
				for (var i = 0; i < list.length; i++ ) {
					if (list[i].listener==ref || list[i].func==ref) {
						this.__removeEventListener(type, list[i].listener);
						list.splice(i, 1);
					}
				}
				if (list.length==0) {
					delete this.listeners[type];
				}
			}
		}


		element.addEventListener=function(type, listener, useCapture) {
			this.addListener(type, listener);
		}

		element.removeEventListener=function(type, listener, useCapture) {
			this.removeListener(type, listener);
		}

	
	}
    
    facilis.EventDispatcher = createjs.EventDispatcher;//facilis.promote(EventDispatcher, "BaseEventDispatcher");
    
}());