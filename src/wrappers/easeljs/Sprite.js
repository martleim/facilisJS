(function() {

    function Sprite(spriteSheet, frameOrAnimation) {
        this.BaseSprite_constructor(spriteSheet, frameOrAnimation);
    }
    
    var element = facilis.extend(Sprite, createjs.Sprite);
    
    facilis.Sprite = facilis.promote(Sprite, "BaseSprite");
    
}());