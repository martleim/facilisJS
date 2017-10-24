(function() {

    function SpriteSheet(data) {
        this.BaseSpriteSheet_constructor(data);
    }
    
    var element = facilis.extend(SpriteSheet, createjs.SpriteSheet);
    
    facilis.SpriteSheet = facilis.promote(SpriteSheet, "BaseSpriteSheet");
    
}());