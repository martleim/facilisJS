(function() {

    function WorkflowProcess() {
        this.Activity_constructor();
    }
     
    
    var element = facilis.extend(WorkflowProcess, facilis.parsers.input.Activity);

    
    element.startParse=function(){  
        this.getWorkflowProcess();
        this.getDocumentation();
        this.getProcesClasses();
    }
        
    element.getWorkflowProcess=function() {
        var toParseXML = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "processref");
        if(toParseXML){
            var name = facilis.parsers.ParseInUtils.setSubNodeValue(toParseXML, "name", this.toParseNode.getAttribute("Name"));
            var performers = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "performers");
            var properties = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "properties");
            var assignments = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "assignments");

            var Performers = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "Performers");
            var Properties = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "Properties");
            var Assignments = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "Assignments");

            this.parsePerformersNode(this.Performers,this.performers);
            this.parsePropertiesNode(this.Properties,this.properties);
            this.parseAssignmentsNode(this.Assignments, this.assignments);

        }
        var Participants = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "Participants");
        this.parseParticipants(Participants);

    }

    element.parseParticipants=function(Participants) {
        if (Participants) {
            for (var i = 0; i < Participants.children.length; i++ ) {
                var Participant=Participants.children[i]
                facilis.parsers.ParserIn.addParticipant(Participant.attributes.Id.value, Participant.attributes.Name.value);
            }
        }

    }

    element.getProcesClasses=function() {
        var proEvents = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "ApiaProEvents");
        if (proEvents && this.parsedModel.bussinessclasses!=null) {
            this.parsedModel.bussinessclasses=this.parseEvents(proEvents);
        }
    }

    element.parseLaneEvents=function(proEvents) {
        if (proEvents && this.parsedModel.bussinessclasses!=null) {
            this.parsedModel.bussinessclasses=this.parseEvents(proEvents);
        }
    }

    facilis.parsers.input.WorkflowProcess = facilis.promote(WorkflowProcess, "Activity");
    
}());

