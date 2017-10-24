(function() {

    function Pool() {
        this.Activity_constructor();
        this.parseFunctions.push(this.getProcess);
			this.parseFunctions.push(this.getBoundary);
			this.parseFunctions.push(this.getLanes);
			this.parseFunctions.push(this.parseParticipant);
    }
    
    var element = facilis.extend(Pool, facilis.parsers.input.Activity);
    
    element.getLanes=function() {
        if(this.toParseNode.attributes.BoundaryVisible!="false"){
            for (var i = 0; i < this.toParseNode.children.length; i++ ) {
                if (this.toParseNode.children[i].localName=="Lanes") {
                    this.parseLanes(this.toParseNode.children[i]);
                }
            }
        }
    }

    element.getProcess=function() {
        var process = this.toParseNode.getAttribute("Process");
        if (process != null) {
            this.parsedModel.process= process;
        }
    }

    element.getBoundary=function() {
        var BoundaryVisible = this.toParseNode.getAttribute("BoundaryVisible")=="true";
        this.parsedModel.visible = BoundaryVisible;
        this.parsedModel.boundaryvisible=BoundaryVisible;
        
    }

    element.parseLanes=function(Lanes ) {
        var pin = new facilis.parsers.ParserIn();
        
        for (var i=0; i < Lanes.children.length;i++ ) {
            var p = pin.getElementParser("swimlane");
            p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel("swimlane"));
            var lane = p.parse(Lanes.children[i]);
            this.getSubElements().push(lane);
        }
    }


    element.parseParticipant=function() {
        var participantref = this.getToParseSubNode("participantref");
        if (participantref && this.toParseNode.attributes.Participant) {
            var p=new facilis.model.Performer();
			p.name=this.toParseNode.getAttribute("Participant");
            participantref.appendChild(values);
            participantref.attributes.value = this.toParseNode.attributes.Participant;
        }
    }

    
    facilis.parsers.input.Pool = facilis.promote(Pool, "Activity");
    
}());

