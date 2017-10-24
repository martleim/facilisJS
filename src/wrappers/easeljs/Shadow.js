(function() {

    function Shadow(color, offsetX, offsetY, blur) {
        this.BaseShadow_constructor(color, offsetX, offsetY, blur);
    }
    
    var element = facilis.extend(Shadow, createjs.Shadow);
    
    facilis.Shadow = facilis.promote(Shadow, "BaseShadow");
    
}());