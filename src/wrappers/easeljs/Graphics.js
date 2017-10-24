(function() {

    function Graphics() {
        this.BaseGraphics_constructor();
    }
    
    var element = facilis.extend(Graphics, createjs.Graphics);
    
    element.lineStyle = function( lineWidth, color, alpha ){
        this.setStrokeStyle(lineWidth);
        color=this.hexToRgbA(color,((alpha==null)?1:alpha))
        this.beginStroke(color);
    }
    
    element.hexToRgbA=function(hex,alpha) {
        if(hex && hex.indexOf("#")>=0){
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return "rgba("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+","+alpha+")";
        }
        return hex;
    }
    
    facilis.Graphics = facilis.promote(Graphics, "BaseGraphics");
    
}());