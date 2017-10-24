(function() {

    function Line() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.getStartEnd);
        this.parseFunctions.push(this.getVertexes);
    }
    
    var element = facilis.extend(Line, facilis.parsers.input.ElementParser);
    
    element.startParse=function(){
        this.callParseFunctions();
        return this.parsedModel;
    }


    element.getStartEnd=function() {
        var startid = this.toParseNode.getAttribute("From");
        var endid = this.toParseNode.getAttribute("To");
        if (!startid) {
            startid = this.toParseNode.getAttribute("Source");
        }
        if (!endid) {
            endid = this.toParseNode.getAttribute("Target");
        }
        this.parsedModel.startid= startid;
        this.parsedModel.endid= endid;
    }

    element.getVertexes=function() {
        var ConnectorGraphicsInfo= this.getToParseSubNode("ConnectorGraphicsInfo");
        if(ConnectorGraphicsInfo){
            ConnectorGraphicsInfo= ConnectorGraphicsInfo.cloneNode(true);
            var vertexes=[];
            for(var i=0;i<ConnectorGraphicsInfo.children.length;i++)
                vertexes.push({x:ConnectorGraphicsInfo.children[i].getAttribute("XCoordinate"),y:ConnectorGraphicsInfo.children[i].getAttribute("YCoordinate")});
            
            this.parsedModel.vertexes=vertexes;
        }
    }


    facilis.parsers.input.Line = facilis.promote(Line, "ElementParser");
    
}());
