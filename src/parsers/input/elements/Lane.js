(function() {

    function Lane() {
        this.ElementParser_constructor();
        
    }
    
    var element = facilis.extend(Lane, facilis.parsers.input.ElementParser);

    facilis.parsers.input.Lane = facilis.promote(Lane, "ElementParser");
    
}());