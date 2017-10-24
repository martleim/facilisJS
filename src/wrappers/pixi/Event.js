(function() {

    
   /* PIXI.Event = function(target, name, data) {
        //for duck typing in the ".on()" function
        this.__isEventObject = true;

        this.stopped = false;

        this.stoppedImmediate = false;

        this.target = target;

        this.type = name;

        this.data = data;

        this.content = data;

        this.timeStamp = Date.now();
    };

    PIXI.Event.prototype.stopPropagation = function stopPropagation() {
        this.stopped = true;
    };

    PIXI.Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
        this.stoppedImmediate = true;
    };
    
    
    function Event(type, bubbles, cancelable) {
        this.BaseEvent_constructor(this, type, cancelable);
    }
    
    var element = facilis.extend(Event, PIXI.Event);
    
    facilis.Event = facilis.promote(Event, "BaseEvent");*/
    facilis.Event = createjs.Event;
}());