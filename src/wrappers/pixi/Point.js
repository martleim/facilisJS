(function() {

    function Point(x,y) {
        this.BasePoint_constructor(x,y);
    }
    
    var element = facilis.extend(Point, PIXI.Point);
    
    facilis.Point = facilis.promote(Point, "BasePoint");
    
}());