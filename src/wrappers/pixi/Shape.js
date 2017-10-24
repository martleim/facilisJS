(function() {

    function Shape(graphics) {
        this.BaseShape_constructor();
        this.graphics=(graphics||new facilis.Graphics());
        this.addChild(this.graphics);
        
    }
    
    var element = facilis.extend(Shape, PIXI.Container);
    facilis.EventDispatcher.initialize(element);
    
    facilis.Shape = facilis.promote(Shape, "BaseShape");
    
}());