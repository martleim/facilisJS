(function() {

    function Association() {
        this.Line_constructor();
        this.parseFunctions.push(this.getDirection);
    }
    
    //static public//
    
    
    var element = facilis.extend(Association, facilis.parsers.input.Line);
    
    element.getDirection=function() {
        var AssociationDirection=this.toParseNode.getAttribute("AssociationDirection");
        if (AssociationDirection == "To") {
            this.toParseNode.attributes.AssociationDirection= "From";
            var startid = this.parsedModel.getAttribute("startid");
            var endid = this.parsedModel.getAttribute("endid");
            this.parsedModel.startid= endid;
            this.parsedModel.endid= startid;
        }
    }


    facilis.parsers.input.Association = facilis.promote(Association, "Line");
    
}());