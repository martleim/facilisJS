(function() {

    function Sprite(spriteSheet, frameOrAnimation) {
        this.spriteSheet=spriteSheet;
        if(frameOrAnimation)
            element.gotoAndStop(frameOrAnimation);        
    }
    
    var element = facilis.extend(Sprite, PIXI.Sprite);
    facilis.EventDispatcher.initialize(element);
    
    element.gotoAndStop=function(where){
        this.BaseSprite_constructor(this.spriteSheet[where]);
    }
    
    facilis.Sprite = facilis.promote(Sprite, "BaseSprite");
    
}());