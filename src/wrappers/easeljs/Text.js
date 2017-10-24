(function() {

    function Text(text,font,color) {
        this.BaseText_constructor(text,font,color);
    }
    
    var element = facilis.extend(Text, createjs.Text);
    
    facilis.Text = facilis.promote(Text, "BaseText");
    
}());