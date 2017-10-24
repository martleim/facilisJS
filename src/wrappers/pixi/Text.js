(function() {

    function Text(text,font,color) {
        this.BaseText_constructor(text,font,color);
    }
    
    var element = facilis.extend(Text, PIXI.Text);
    facilis.EventDispatcher.initialize(element);
    
    facilis.Text = facilis.promote(Text, "BaseText");
    
}());