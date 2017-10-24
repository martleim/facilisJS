(function() {

    function EventDispatcher() {
        //this.BaseEventDispatcher_constructor();
    }
    
    EventDispatcher.initialize=function(el){
        /*facilis.extend(el, PIXI.EventTarget);
        facilis.promote(el, "EventTarget");
        el.EventTarget_constructor();*/
        var et=new PIXI.EventTarget();
        for(var i in et)
            el[i]=et[i];
        
        /*el.addEventListener=el.on;
        el.removeEventListener=el.off;*/
    }
    
    //var element = facilis.extend(EventDispatcher, facilis.EventDispatcher);
    
    facilis.EventDispatcher = EventDispatcher;//facilis.promote(EventDispatcher, "BaseEventDispatcher");
    facilis.EventDispatcher=createjs.EventDispatcher;
    
}());