(function() {

    function Shape(graphics) {
        this.BaseShape_constructor(graphics);
    }
    
    var element = facilis.extend(Shape, createjs.Shape);
    
    facilis.Shape = facilis.promote(Shape, "BaseShape");
    
}());