(function() {

    function Rectangle(x, y, width, height) {
        this.BaseRectangle_constructor(x, y, width, height);
    }
    
    var element = facilis.extend(Rectangle, createjs.Rectangle);
	
	element.contains = function(point){
		return ( point.x>=this.x && point.x<=(this.x+this.width) && point.y>=this.y && point.y<=(this.y+this.height)  );
	}
    
    facilis.Rectangle = facilis.promote(Rectangle, "BaseRectangle");
    
}());