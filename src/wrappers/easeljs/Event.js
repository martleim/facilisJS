(function() {

    function Event(type, bubbles, cancelable) {
        this.BaseEvent_constructor(type, bubbles, cancelable);
    }
    
    var element = facilis.extend(Event, createjs.Event);
    
    facilis.Event = facilis.promote(Event, "BaseEvent");
    
}());