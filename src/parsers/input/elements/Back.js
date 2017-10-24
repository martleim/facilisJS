(function() {

    function Back() {
        this.Activity_constructor();
        this.parseFunctions.push(this.getProcess);
        this.parseFunctions.push(this.getBoundary);
        this.parseFunctions.push(this.getLanes);
        this.parseFunctions.push(this.parseBack);
        this.parseFunctions.push(this.getProcesClasses);
    }
    
    var element = facilis.extend(Back, facilis.parsers.input.Activity);

    element.getLanes=function() {
        for (var i = 0; i < this.toParseNode.children.length; i++ ) {
            if (this.toParseNode.children[i].nodeName=="Lanes") {
                this.parseLanes(this.toParseNode.children[i]);
            }
        }
    }

    element.getProcess=function() {
        var process = this.toParseNode.getAttribute("Process");
        if (process != null) {
            this.parsedModel.process=process;
        }
    }

    element.getBoundary=function() {
        var BoundaryVisible = this.toParseNode.attributes.BoundaryVisible;
        if (BoundaryVisible != null) {
            this.parsedModel.boundaryvisible=BoundaryVisible;
        }else {
            this.parsedModel.boundaryvisible=true;
        }
    }

    element.parseLanes=function(Lanes ) {
        var pin = new facilis.parsers.ParserIn();
        
        for (var i=0; i < Lanes.children.length;i++ ) {
            var p = pin.getElementParser("swimlane");
            p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel("swimlane"));
            var lane = p.parse(Lanes.children[i]);
            this.getSubElements().appendChild(lane);
        }
    }

    element.parseBack=function() {
        if(this.toParseNode && this.toParseNode.parentNode && this.toParseNode.parentNode.parentNode){
            var toParseXML = this.toParseNode.parentNode.parentNode;
            var bpd = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "bpd");
            if (bpd) {
                facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "id", toParseXML.attributes.Id.value);
                facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "name",toParseXML.attributes.Name.value);
                facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "language", toParseXML.attributes.Language.value);

                var RedefinableHeader = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "RedefinableHeader");
                if (RedefinableHeader) {
                    facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "version", RedefinableHeader.attributes.Version.value);
                    facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "author", RedefinableHeader.attributes.Author.value);
                }

                //facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "querylanguage",querylanguage);
                //facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "documentation",documentation);

                var Created = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "Created");
                if (Created) {
                    facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "creationdate",Created.attributes.CreationDate.value);
                }
                var ModificationDate = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "ModificationDate");
                if (ModificationDate) {
                    facilis.parsers.ParseInUtils.setSubNodeValue(bpd, "modificationdate",ModificationDate.attributes.Date.value);
                }
            }
            var process = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "process");
            if (process) {
                var processtype = facilis.parsers.ParseInUtils.getSubNodeValue(process, "processtype");
                var properties = facilis.parsers.ParseInUtils.getSubNode(process, "properties");

                facilis.parsers.ParseInUtils.setSubNodeValue(process, "processtype", toParseXML.attributes.ProcessType.value);

                var Performers = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "Performers");
                if (Performers) {
                    this.parsePerformers(Performers);
                }
                var Properties = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "Properties");
                if (Properties) {
                    parsePropertiesNode(Properties, properties);
                }

            }
        }
    }


    element.parsePerformers=function(Performers) {
        if (Performers) {
            for (var i = 0; i < Performers.children.length; i++ ) {
                var performer = new facilis.model.Perfomer();
                performer.id = Performer.attributes.PerfId;
                performer.name = Performer.attributes.PerfName;
                if (performer.condition) {
                    performer.condition =  Performer.getAttribute("ProElePerfEvalCond");
                }
				if(this.parsedModel.performers!=null)
					this.parsedModel.performers.push(performer);
            }
        }
    }


    element.getProcesClasses=function() {
        var proEvents = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "ApiaProEvents");
        if (proEvents && this.parsedModel.bussinessclasses!=null) {
            this.parsedModel.bussinessclasses=this.parseEvents(proEvents);
        }
    }
    
    facilis.parsers.input.Back = facilis.promote(Back, "Activity");
    
}());
