(function() {

    function ParserIn() {
        //private//

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(ParserIn, {});
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        this.parsedModel=null;
        this.toParseXML=null;

        this.workflowProcessName=null;
        this.mainWorkflowProcessId=null;

        this.workflowProcessObj=null;
        this.processAction = "";
    };
    
	ParserIn.performers = [];
	ParserIn.artifacts = [];
	ParserIn.datastores = [];
    
    element.parse=function(node) {
		
		ParserIn.performers = [];
		ParserIn.artifacts = [];
		ParserIn.datastores = [];

        this.workflowProcessName = "";
        toParseXML = node;
        if (!node.firstElementChild) {
            return null;
        }
        node = node.firstElementChild;
        this.associations=[];
        this.messageFlows=[];
        var i;
		
		//Levantamos los datastores
		for (i = 0; i < node.children.length; i++ ) {
			if (node.children[i].localName == "DataStores") {
				ParserIn.datastores=this.parseDataStores(node.children[i]);
				break;
			}
		}
		
        for (i = 0; i < node.children.length; i++ ) {
            if (node.children[i].localName == "Pools") {
                this.parsePools(node.children[i]);
            }
            if (node.children[i].localName=="Artifacts") {
                ParserIn.artifacts = this.parseArtifacts(node.children[i]);
            }
            if (node.children[i].localName=="Associations") {
                this.associations = this.parseAssociations(node.children[i]);
            }
            if (node.children[i].localName == "MessageFlows") {
                this.messageFlows = this.parseMessageFlows(node.children[i]);
            }
            if (node.children[i].localName == "Participants") {
                var Participants = node.children[i];
                for (var p = 0; p < Participants.children.length; p++ ) {
                    var Participant=Participants.children[p]
                    ParserIn.addParticipant(Participant.getAttribute("Id"), Participant.getAttribute("Name"));
                }
            }
        }

        if(ParserIn.artifacts){
            i = 0;
            for (i = 0; i < ParserIn.artifacts.length; i++ ) {
                if (facilis.View.importDisconnectedArtifacts || (!facilis.View.importDisconnectedArtifacts && this.artifactHasValidAssociation(ParserIn.artifacts[i], this.associations))) {
                    this.parsedModel.subElements.push(ParserIn.artifacts[i]);
                }
            }
        }
        if (this.associations) {
            i = 0;
            for (i = 0; i < this.associations.length; i++ ) {
                this.parsedModel.subElements.push(this.associations[i]);
            }
        }
        if (this.messageFlows) {
            i = 0;
            for (i = 0; i < this.messageFlows.length; i++ ) {
                this.parsedModel.subElements.push(this.messageFlows[i]);
            }
        }
        return this.parsedModel;
    }

    element.artifactHasValidAssociation=function(artifact, associations) {
        if(associations && facilis.getClassName(artifact).toLowerCase()=="dataobject"){
            for (var i = 0; i < associations.length; i++ ) {
                var association = associations[i];
                if (association.startid == artifact.id || association.endid == artifact.id) {
                    return true;
                }
            }
        }else if (facilis.getClassName(artifact).toLowerCase() != "dataobject") {
            return true;
        }
        return false;
    }

    element.parsePools=function(poolsXML) {
        var pools = new Array();
        var mainPool;
        var i;
        //if (View.getInstance().offline) {
        //if(false){
            var noMainPool = true;
            var mainPoolNode;

            var newPools=facilis.parsers.ParseInUtils.getParsedNode("<Pools></Pools>");
            var backPool;
            var fakePool;

            for (i = 0; i < poolsXML.children.length; i++ ) {
                mainPool = poolsXML.children[i].getAttribute("MainPool");
                //var BoundaryVisible = poolsXML.children[i].getAttribute("BoundaryVisible");
                if (mainPool == "true") {
                    mainPoolNode = poolsXML.children[i];
                    noMainPool = false;
                }
            }
            
            if (!noMainPool) {
                if (mainPoolNode.getAttribute("BoundaryVisible") == "true") {
                    backPool = facilis.parsers.ParseInUtils.getParsedNode("<Pool></Pool>");
                    fakePool = mainPoolNode.cloneNode(true);
                    backPool.setAttribute("MainPool", "true");
                    mainPoolNode.setAttribute("MainPool","false");
                    fakePool.setAttribute("Process", "");
                    newPools.appendChild(backPool);
                    newPools.appendChild(fakePool);
                    poolsXML = newPools;
                }else{
                    var wfprocesses = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "WorkflowProcesses");
                    var poolsToId = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "Pools");
                    var poolIds = new Object();
                    for (var po = 0; po < poolsToId.children.length; po++ ) {
                        poolIds[poolsToId.children[po].getAttribute("Process")]=true;
                    }
                    var auxName = "";
                    for (var w = 0; w < wfprocesses.children.length; w++ ) {
                        if ((wfprocesses.children[w].getAttribute("Id") == mainPoolNode.getAttribute("Process")) && wfprocesses.children[w].getAttribute("Name")) {
                            mainPoolNode.setAttribute("Name", wfprocesses.children[w].getAttribute("Name"));
                        }
                        var obj;
                        var o;
                        if (wfprocesses.children[w].getAttribute("Name") && facilis.parsers.ParseInUtils.getSubNode(wfprocesses.children[w], "Activities") ) {
                            this.workflowProcessName = wfprocesses.children[w].getAttribute("Name");
                            obj = null;
                            o = 0;
                            for (o = 0; o < wfprocesses.children[w].children.length; o++ ) {
                                if (wfprocesses.children[w].children[o].localName == "Object") {
                                    //obj = wfprocesses.children[w].children[o];
                                    obj = wfprocesses.children[w];
                                    break;
                                }
                            }
                            if (obj) {
                                //workflowProcessObj = obj.cloneNode(true);
                                //obj.removeNode();
                                this.workflowProcessObj = obj;
                            }
                        }
                        if (this.workflowProcessName != "") {
                            break;
                        }
                        if (wfprocesses.children[w].getAttribute("Name") && poolIds[wfprocesses.children[w].getAttribute("Name")]) {
                            auxName = wfprocesses.children[w].getAttribute("Name");
                            if(!obj){
                                for (o = 0; o < wfprocesses.children[w].children.length; o++ ) {
                                    if (wfprocesses.children[w].children[o].localName == "Object") {
                                        //obj = wfprocesses.children[w].children[o];
                                        obj = wfprocesses.children[w];
                                        break;
                                    }
                                }
                            }
                            if (obj) {
                                //workflowProcessObj = obj.cloneNode(true);
                                //obj.removeNode();
                                this.workflowProcessObj = obj;
                            }
                        }
                        if (wfprocesses.children[w].getAttribute("ProAction")) {
                            this.processAction = wfprocesses.children[w].getAttribute("ProAction");
                        }
                    }
                    if (this.workflowProcessName == "" && auxName!="") {
                        this.workflowProcessName = auxName;
                    }
                    if (!mainPoolNode.getAttribute("Name")) {
                        mainPoolNode.setAttribute("Name", this.workflowProcessName);
                    }
                    if (this.workflowProcessObj) {
                        //mainPoolNode.appendChild(workflowProcessObj);
                        var toAdd = this.removeWFNodes(this.workflowProcessObj);
                        //for (var t = 0; t < toAdd.length; t++ ) {
                        var counter = 0;
                        //while (counter < 5 || toAdd.length > 0) {
                        while (toAdd.length > 0) {
                            //mainPoolNode.appendChild(toAdd[t]);
                            mainPoolNode.appendChild(toAdd[0]);
                            toAdd.splice(0, 1);
                            counter++;
                        }
                    }
                }
            }else{
                i = 0;
                for (i = 0; i < poolsXML.children.length; i++ ) {
                    var BoundaryVisible = poolsXML.children[i].getAttribute("BoundaryVisible");
                    if (BoundaryVisible == "false") {
                        mainPoolNode = poolsXML.children[i];
                        break;
                    }
                }
                if (!mainPoolNode) {
                    mainPoolNode = poolsXML.children[0];
                }
                mainPoolNode.setAttribute("MainPool", "true");
                noMainPool = false;
            }

        //}
        mainPool = "false";

        for (i = 0; i < poolsXML.children.length; i++ ) {
            var p;
            if(mainPool=="false"){
                mainPool = poolsXML.children[i].getAttribute("MainPool")+"";
                if(mainPool!="true"){
                    mainPool = (poolsXML.children[i].getAttribute("BoundaryVisible") == "false").toString();
                }
            }
            if (mainPool == "true") {
                p = this.getElementParser("back");
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel("back"));
            }else {
                p = this.getElementParser("pool");
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel("pool"));
            }
            var pool = p.parse(poolsXML.children[i]);
            //var visible = poolsXML.children[i].getAttribute("BoundaryVisible");
            if (mainPool=="true") {
                this.parsedModel = pool;
                mainPool = "ready";
            }else {
                pools.push(pool);
            }
            
        }
        i = 0;
        for (i = 0; i < pools.length; i++ ) {
            this.parsedModel.subElements.push(pools[i]);
            this.parseWorkflow(pools[i]);
        }
        if(pools.length == 0) {
            //Parseo normal del workflow
            this.parseWorkflow(this.parsedModel);
        } else {
            //Fuerzo a parsear al workflow principal				
            this.parseWorkflowProEvents(this.parsedModel);				
            this.parseWorkflowProForms(this.parsedModel);
        }
        if(this.parsedModel){
            if(this.workflowProcessName) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel.firstElementChild, "name",this.workflowProcessName);
            }
            if (this.processAction) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel.firstElementChild, "protype",this.processAction);
            }
        }
    }

    element.removeWFNodes=function(node) {
        var toRemove = new Array();
        var toReturn = new Array();
        var removable = { };
        removable["ApiaProEvents"] = true;
        removable["Object"] = true;
        var i = 0;
        for (i = 0; i < node.children.length; i++ ) {
            if (removable[node.children[i].localName]) {
                toRemove.push(node.children[i]);
            }
        }
        i = 0;
        for (i = 0; i < toRemove.length; i++ ) {
            toReturn.push(toRemove[i].cloneNode(true));
            toRemove[i].parentNode.removeChild(toRemove[i]);
        }
        return toReturn;
    }

    element.parseWorkflow=function(pool) {
        var workflows = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "WorkflowProcesses");
        var workflow;
        //var activitySets = .ownerDocument.createElement("activitySets");

        for (var i = 0; i < workflows.children.length; i++) {
            //var id = workflows.children[i].getAttribute("ProId");

            var id = workflows.children[i].getAttribute("Id");
            if (id == pool.process) {
                workflow = workflows.children[i];
                break;
            }/* else {
                //Recabar informacion de Activities y Transitions de este workflowprocess
            }*/
        }
            
        if (workflow) {
            var p = new facilis.parsers.input.WorkflowProcess();
            p.setParsedModel(pool);
            p.parse(workflow);
            this.parseSubElements(workflow, pool);
        }


    }

    element.parseWorkflowProForms=function(pool) {
        //trace("parseWorkflowProForms: " + pool);
        

        var workflows = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "WorkflowProcesses");

        var apiaProForms = null;

        for (var i = 0; i < workflows.children.length && apiaProForms == null; i++) {
            //var wf = workflows.children[i];
            var p = new facilis.parsers.input.WorkflowProcess();
            p.setParsedModel(pool);
            p.toParseNode = workflows.children[i];
            //trace("pool seteado");
            p.getDocumentation();

            //trace("documentacion parseada");
            
        }

    }

    element.parseWorkflowProEvents=function(pool) {
        var workflows = facilis.parsers.ParseInUtils.getSubNode(toParseXML, "WorkflowProcesses");
        var workflow;
        //var activitySets = .ownerDocument.createElement("activitySets");			
        var apiaProEvents = null;
        for (var i = 0; i < workflows.children.length && apiaProEvents == null; i++) {
            var wf = workflows.children[i];
            for (var j = 0; j < wf.children.length && apiaProEvents == null; j++) {
                //trace("wf.children[j].localName: " + wf.children[j].localName);
                if(wf.children[j].localName == "ApiaProEvents") {
                    apiaProEvents = wf.children[j];
                }
            }
        }
        if (apiaProEvents) {
            //trace("Voy a invocar a workflow.parseEvents con pool: " + pool);
            var p = new WorkflowProcess();
            p.setParsedModel(pool);
            p.parseLaneEvents(apiaProEvents);
            //parseSubElements(workflow, pool);
        }
    }

    element.parseSubElements=function(xml, element) {
        if(xml && element){
            element.activitySets=[];
            var i = 0;
            for (i = 0; i < xml.children.length; i++ ) {
                if (xml.children[i].localName=="Activities") {
                    element.subElements=element.subElements.concat(this.parseActivities(xml.children[i]));
                }
                if (xml.children[i].localName=="Transitions") {
                    element.subElements=element.subElements.concat(this.parseTransitions(xml.children[i]));
                }
                if (xml.children[i].localName == "ActivitySets") {
                    element.activitySets=element.activitySets.concat(this.parseActivitySets( xml.children[i]));
                }
				if (xml.children[i].localName=="DataInputOutputs") {
					ParserIn.artifacts=ParserIn.artifacts.concat(this.parseDataInputOutputs(xml.children[i]));
				}
				if (xml.children[i].localName=="DataStoreReferences") {
					ParserIn.artifacts=ParserIn.artifacts.concat(this.parseDataStoreReferences(xml.children[i]));
				}

            }
            i = 0;
            for (i = element.activitySets.length-1; i >= 0; i-- ) {
                var id = element.activitySets[i].id;
                for (var u = 0; u < element.subElements.length; u++ ) {
                    if (element.subElements[u].id == id) {
                        if (element.activitySets[i]) {
                            element.subElements[u].subElements.push(element.activitySets[i]);
                            break;
                        }
                    }
                }
            }
        }
    }

    element.parseActivities=function(activities) {
		var ret=[];
        for (var i = 0; i < activities.children.length;i++ ) {
            if (activities.children[i]) {
                var type = this.getElementType(activities.children[i]);
                var p = this.getElementParser(type);
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
                ret.push(p.parse(activities.children[i]));
            }
        }
		return ret;
    }

    element.parseTransitions=function(transitions) {
		var ret=[];
        for (var i = 0; i < transitions.children.length;i++ ) {
            if (transitions.children[i]) {
                var type = this.getElementType(transitions.children[i]);
                var p = this.getElementParser(type);
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
                ret.push(p.parse(transitions.children[i]));
            }
        }
		return ret;
    }

    element.parseActivitySets=function(activitySets){
		var ret=[];
        for (var i = 0; i < activitySets.children.length;i++ ) {
            if (activitySets.children[i]) {
				ret.push( this.parseActivitySet( activitySets.children[i].getAttribute("Id") , activitySets.children[i]) );
            }
        }
		return ret;
    }

    element.parseActivitySet=function(id,activitySet) {
		var retEl={id:id, subElements:[]};
        this.parseSubElements(activitySet,retEl);
		return retEl;
    }
	
	element.parseDataStores=function(datas) {
		var datas_array=[];
		for (var i = 0; i < datas.children.length; i++ ) {
			var datas_XML = datas.children[i];
			if (datas_XML) {
				var type = this.getElementType(datas_XML);
				var p = this.getElementParser(type);
				p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
				var datastoreModel = p.parse(datas_XML);
				datas_array.push(datastoreModel);
			}
		}
		return datas_array;
	}

    element.parseArtifacts=function(artifacts) {
        var arts = new Array();
        for (var i = 0; i < artifacts.children.length;i++ ) {
            if (artifacts.children[i]) {
                var type = this.getElementType(artifacts.children[i]);
                var p = this.getElementParser(type);
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
                var artifactXML = p.parse(artifacts.children[i]);
                arts.push(artifactXML);
            }
        }
        return arts;
    }

	element.parseDataInputOutputs=function(datainout) {
		var arts = new Array();
		for (var i = 0; i < datainout.children.length;i++ ) {
			if (datainout.children[i]) {
				var type = this.getElementType(datainout.children[i]);
				var p = this.getElementParser(type);
				p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
				var artifactXML = p.parse(datainout.children[i]);
				arts.push(artifactXML);
			}
		}
		return arts;
	}

	/**
	 * TODO: Donde van los datastores en el xml de memoria???? son hijos de artifacts?
	 * @param	datastore
	 * @param	dstores
	 */
	element.parseDataStoreReferences=function(datastore) {
		//var arts = new Array();
		var dstores=[];
		for (var i = 0; i < datastore.children.length;i++ ) {
			if (datastore.children[i]) {
				var type = this.getElementType(datastore.children[i]);
				var p = this.getElementParser(type);
				p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
				var datastoreModel = p.parse(datastore.children[i]);

				var datastoreref = datastore.children[i].getAttribute("DataStoreRef");
				var state = datastore.children[i].getAttribute("State");
				if(datastoreModel.state!=null)
					datastoreModel.state=state;
				
				
				for (j = 0; j < ParserIn.datastores.length; j++ ) {
					if (ParserIn.datastores[j].id == "datastoreref") {
						var refDS=ParserIn.datastores[j];
						datastoreModel.name=refDS.name;
						datastoreModel.documentation=refDS.documentation;
						datastoreModel.capacity=refDS.capacity;
						datastoreModel.isUnlimited=refDS.isUnlimited;
						break;
					}
				}

				dstores.push(datastoreModel);
			}
		}
		return dstores;
	}
	
    element.parseAssociations=function(associations) {
        var ass = new Array();
        var type = "association";
        for (var i = 0; i < associations.children.length;i++ ) {
            if (associations.children[i]) {
                var p = this.getElementParser(type);
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
                var associationXML = p.parse(associations.children[i]);
                ass.push(associationXML);
            }
        }
        return ass;
    }

    element.parseMessageFlows=function(mFlows) {
        var flows = new Array();
        var type = "mflow";
        for (var i = 0; i < mFlows.children.length;i++ ) {
            if (mFlows.children[i]) {
                var p = this.getElementParser(type);
                p.setParsedModel(facilis.ElementAttributeController.getInstance().getElementModel(type));
                var flowXML = p.parse(mFlows.children[i]);
                flows.push(flowXML);
            }
        }
        return flows;
    }

    element.getElementParser=function(type) {
        var className = "";
        var inPackage= "facilis.parsers.input."
        switch (type){
            case "task":
            className = "Task";
            break;
            case "csubflow":
            className = "Subflow";
            break;
            case "esubflow":
            className = "Subflow";
            break;
            case "startevent":
            className = "Event";
            break;
            case "middleevent":
            className = "Event";
            break;
            case "endevent":
            className = "Event";
            break;
            case "gateway":
            className = "Gateway";
            break;
            case "pool":
            className = "Pool";
            break;
            case "group":
            className = "Artifact";
            break;
            case "swimlane":
            className = "Lane";
            break;
            case "textannotation":
            className = "Artifact";
            break;
            case "dataobject":
			case "datainput":
			case "dataoutput":
            className = "Artifact";
            break;
			case "datastore":
			className = "Artifact";
			break;
            case "back":
            className = "Back";
            break;
            case "association":
            className = "Association";
            break;
            case "mflow":
            className = "Transition";
            break;
            case "sflow":
            className = "Transition";
            break;
            case "activityset":
            className = "ActivitySet";
            break;
        }

        //return (LibraryManager.getInstance().getInstancedObject(outPackage+className) );
        return eval("new "+inPackage+className+"()")
    }

    element.getElementType=function(node) {
        if (facilis.parsers.ParseInUtils.getSubNode(node,"Task")) {
            return "task";
        }else if (facilis.parsers.ParseInUtils.getSubNode(node, "BPMNEvent") || facilis.parsers.ParseInUtils.getSubNode(node, "Event")) {
            var event=(facilis.parsers.ParseInUtils.getSubNode(node, "BPMNEvent"))?(facilis.parsers.ParseInUtils.getSubNode(node, "BPMNEvent")):(facilis.parsers.ParseInUtils.getSubNode(node, "Event"))
            var type = event.firstElementChild.localName;
            return ((type == "StartEvent")?"startevent": (type == "IntermediateEvent")? "middleevent" : "endevent"  );
        }else if (facilis.parsers.ParseInUtils.getSubNode(node,"Route") || facilis.parsers.ParseInUtils.getSubNode(node,"Gateway")) {
            return "gateway";
        }else if (facilis.parsers.ParseInUtils.getSubNode(node, "BlockActivity") || facilis.parsers.ParseInUtils.getSubNode(node, "SubFlow")) {
            var NodeGraphicsInfo = facilis.parsers.ParseInUtils.getSubNode(node, "NodeGraphicsInfo");
            if (NodeGraphicsInfo.getAttribute("Expanded") == "true") {
                return "esubflow";
            }else{
                return "csubflow";
            }
        }else if ( node.localName=="Transition") {
            return "sflow";
		} else if ( node.localName == "DataInput") {
			return "datainput"
		} else if ( node.localName == "DataOutput") {
			return "dataoutput"
		//} else if ( node.localName == "DataInput" || node.localName == "DataOutput") {
		//	return "dataobject"
		} else if ( node.localName == "DataStore") {				
			return "datastore";
		} else if ( node.localName == "DataStoreReferences" || node.localName == "DataStoreReference" || node.localName == "DataStores" || node.localName == "DataStore") {
			return "datastore";
		}else if (node.getAttribute("ArtifactType")) {
            var artifactType=node.getAttribute("ArtifactType");
			
			if (artifactType == "DataObject")
				return "dataobject";
			else if (artifactType == "Group")
				return "group";
			else
				return "textannotation";
            //return (artifactType == "DataObject")?"dataobject":((artifactType == "Group")?"group":"textannotation");
        }else if (facilis.parsers.ParseInUtils.getSubNode(node,"Implementation"))  {
            facilis.parsers.ParseInUtils.getSubNode(node, "Implementation").firstElementChild.localName == "No";
            return "task";
        }else if ( node.localName=="Lane") {
            return "swimlane";
        }
    }


    ParserIn.addParticipant=function(id,name) {
        for (var i = 0; i < ParserIn.performers.length; i++ ) {
            if (ParserIn.performers[i].id == id) {
                return;
            }
        }
        if (name == null || name == "") {
            name = id;
            //id = null;
        }
        ParserIn.performers.push( { id:id, name:name } );
    }

    ParserIn.getParticipantByName=function(name) {
        for (var i = 0; i < ParserIn.performers.length; i++ ) {
            if (ParserIn.performers[i].name==name) {
                return ParserIn.performers[i];
            }
        }
        return null;
    }

    ParserIn.getParticipantById=function(id) {
        for (var i = 0; i < ParserIn.performers.length; i++ ) {
            if (ParserIn.performers[i].id==id) {
                return ParserIn.performers[i];
            }
        }
        return null;
    }

    ParserIn.getParticipantByIdOrName=function(id) {
        for (var i = 0; i < ParserIn.performers.length; i++ ) {
            if (ParserIn.performers[i].id==id) {
                return ParserIn.performers[i];
            }
            if (ParserIn.performers[i].name==id) {
                return ParserIn.performers[i];
            }
        }
        return null;
    }
    


    facilis.parsers.ParserIn = facilis.promote(ParserIn, "Object");
    
    
    facilis.parsers.ParseInUtils={};
    
    facilis.parsers.ParseInUtils.getParsedNode=function(xmlStr) {
        
        //var xmlString = (new XMLSerializer()).serializeToString(xmlStr);
         var doc=   ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        return doc.firstElementChild;
    }

    facilis.parsers.ParseInUtils.getSubNodeValue=function(n,name) {
        var node = getSubNode(n, name);
        if (node && node.setAttribute("value", "" && node.getAttribute("value")) != undefined && node.getAttribute("value") != "undefined") {
            return node.getAttribute("value");
        }
        return null;
    }

    facilis.parsers.ParseInUtils.setSubNodeValue=function(n, name, value) {
        if(value){
            var node = facilis.parsers.ParseInUtils.getSubNode(n, name);
            if (node) {
                node.setAttribute("value",value);
            }
        }
    }

    facilis.parsers.ParseInUtils.getSubNode=function(n, name) {
        name=(name||"");
        if(n && n.children){
            for (var i = 0; i < n.children.length; i++ ) {
                if (((n.children[i]).getAttribute("name")||"").toLowerCase()==name.toLowerCase() ||
                    ((n.children[i]).nodeName||"").toLowerCase()==name.toLowerCase() ||
                    ((n.children[i]).localName||"").toLowerCase()==name.toLowerCase()) {
                    return (n.children[i]);
                }
            }
            i = 0;
            for (i = 0; i < n.children.length; i++ ) {
                var subNode = facilis.parsers.ParseInUtils.getSubNode((n.children[i]), name);
                if (subNode) {
                    return subNode;
                }
            }
        }
        return null;
    }
    
    
}());

(function() {

    function ElementParser() {
        this.parsedModel=null;
		this.toParseNode=null;
        
        this.parseFunctions = [];
        this.parseFunctions.push(this.getId);
        this.parseFunctions.push(this.getName);
        this.parseFunctions.push(this.getDocumentation);
        this.parseFunctions.push(this.parseCategories);
        this.parseFunctions.push(this.parseDataFields);
        //this.parseFunctions.push(this.parseProperties);
        this.parseFunctions.push(this.parseUserAttributes);
        this.parseFunctions.push(this.getNodeGraphicsInfo);
    }
    
    //static public//
    
    
    var element = facilis.extend(ElementParser, {});

    element.getNodeGraphicsInfo=function() {
        var NodeGraphicsInfos = this.getToParseSubNode("NodeGraphicsInfos");
        var NodeGraphicsInfo;
        if (NodeGraphicsInfos && NodeGraphicsInfos.firstElementChild) {
            NodeGraphicsInfo = NodeGraphicsInfos.firstElementChild;
            this.parseNodeGraphicsInfo(NodeGraphicsInfo);
        }else {
            NodeGraphicsInfo = this.getToParseSubNode("NodeGraphicsInfo");
            if(NodeGraphicsInfo){
                this.parseNodeGraphicsInfo(NodeGraphicsInfo);
            }
        }
    }

    element.parseNodeGraphicsInfo=function(NodeGraphicsInfo) {
        var width = NodeGraphicsInfo.getAttribute("Width");
        var height = NodeGraphicsInfo.getAttribute("Height");
        var x = 0;
        var y = 0;
        if (NodeGraphicsInfo.firstElementChild) {
            x = NodeGraphicsInfo.firstElementChild.getAttribute("XCoordinate");
            y = NodeGraphicsInfo.firstElementChild.getAttribute("YCoordinate");
        }
        this.parsedModel.x= (x?x:"0");
        this.parsedModel.y= (y?y:"0");
        this.parsedModel.width= (width?width:"0");
        this.parsedModel.height= (height?height:"0");
        var shape = NodeGraphicsInfo.getAttribute("Shape");
        if (shape) {
            this.parsedModel.shape= shape;
        }
        this.getColor(NodeGraphicsInfo);
    }

    element.getColor=function(NodeGraphicsInfo) {
        var fillColor = NodeGraphicsInfo.getAttribute("FillColor");
        if(fillColor && this.parsedModel.colorFill){
        	this.parsedModel.colorFill= fillColor;
        }
    }

    element.getName=function() {
        var name = this.toParseNode.getAttribute("Name")||"";
        if(this.parsedModel && name!=null){
			if(this.parsedModel.nameChooser!=null)
				this.parsedModel.nameChooser=name
				
			if(this.parsedModel.name!=null)
				this.parsedModel.name=name

        }
    }

    element.getId=function() {
        var id = this.toParseNode.getAttribute("Id");
        if (id != null) {
            this.parsedModel.id= id;
        }
    }

    element.parse=function(node) {
        this.toParseNode = node;
        return this.startParse();
    }

    element.setParsedModel=function(node) {
        this.parsedModel = node;
    }

    element.getToParseSubNode=function(name,fromNode){
        return facilis.parsers.ParseInUtils.getSubNode((fromNode||this.toParseNode), name);
    }

    element.getParsedSubNode=function(name){
		console.log("FIX getParsedSubNode ATTRIBUTE "+name)
        return facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, name);
    }
	
	element.setParsedModelValue=function(name, value){
		if(this.parsedModel[name] && value)
			this.parsedModel[name]=value;
    }

    element.getToParseSubNodeValue=function(name){
        return facilis.parsers.ParseInUtils.getSubNodeValue(this.toParseNode, name);
    }

    element.getParsedSubNodeValue=function(name){
		console.log("FIX getParsedSubNodeValue ATTRIBUTE "+name)
        return facilis.parsers.ParseInUtils.getSubNodeValue(this.parsedModel, name);
    }

    element.callParseFunctions=function() {
        for (var i = 0; i < this.parseFunctions.length;i++ ) {
            this.parseFunctions[i].apply(this);
            //(this.parseFunctions[i])();
        }
    }

    element.startParse=function() { 
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getParsedNode=function(xmlStr) {
        return facilis.parsers.ParseInUtils.getParsedNode(xmlStr);
    }

    element.getData=function(node){
        return facilis.parsers.ParseInUtils.getSubNode(node, "data");
    }

    element.getDocumentation=function() {
        var ObjectTag;
        for (var i = 0; i < this.toParseNode.children.length; i++ ) {				
            if (this.toParseNode.children[i].localName == "Object") {
                ObjectTag = this.toParseNode.children[i];
            }
        }
        var Documentation;
        if(ObjectTag){
            Documentation = facilis.parsers.ParseInUtils.getSubNode(ObjectTag, "Documentation");
        }
        if (!Documentation) {
            i = 0;
            for (i = 0; i < this.toParseNode.children.length; i++ ) {
                if (this.toParseNode.children[i].localName=="Documentation") {
                    Documentation = this.toParseNode.children[i];
                    break;
                }
            }
        }
        var documentation = null;
        var forms = null;
        var events = null;
        var title = null;
        
        if (Documentation) {
            if (this.parsedModel.forms!=null || this.parsedModel.events!=null || this.parsedModel.title!=null) {
                this.parseAdvancedDocumentation(Documentation);
            }else {
                this.parseDocumentationNode(Documentation);
            }
        }
    }

    element.parseDocumentationNode=function(Documentation) {
        if (this.parsedModel.documentation!=null && Documentation && Documentation.firstChild) {
            var first = Documentation.firstChild.textContent;
            if ( (first.indexOf("&lt;forms") >= 0 || first.indexOf("&lt;events") >= 0 || first.indexOf("&lt;documentation") >= 0 || first.indexOf("&lt;title") >= 0) ||
                (first.indexOf("<forms") >= 0 || first.indexOf("<events") >= 0 || first.indexOf("<documentation") >= 0 || first.indexOf("<title") >= 0)
               ) {
                var parsedXML = "<aux>" + first + "</aux>";
                var auxNode = facilis.parsers.ParseInUtils.getParsedNode(parsedXML);
                for (var x = 0; x < auxNode.children.length; x++ ) {
                    var cloned = auxNode.children[x].cloneNode(true);
                    if (cloned.nodeName == "documentation") {
                        this.parsedModel.documentation=cloned.textContent;
                        break;
                    }
                }
            }else if(Documentation.firstChild && Documentation.textContent){
                var description= Documentation.firstChild.textContent;
                //description = description.split("\n").join("");
                if (description) {
					this.parsedModel.documentation=description;
                }
            }
        }
    }

    element.parseAdvancedDocumentation=function(Documentation) {
		console.log("ARREGLAR LOS FORMS EVENTS ETC")
        if (!Documentation.firstChild) {
            return;
        }

        var first = (Documentation.firstChild.wholeText ||  Documentation.firstChild.textContent);
        var doc;
        var forms;
        var events;
        var title; 
		var quote_unescaped = false;
        if (first.indexOf("&amp;lt;")>=0) {
            first = first.split("&amp;lt;").join("&lt;");
            first = first.split("&amp;gt;").join("&gt;");
            first = first.split("&amp;quot;").join("&quot;");
			first = first.split("&amp;amp;").join("&amp;");
            first = first.split(" = ").join("=");
            //Documentation.firstElementChild.removeNode();
            Documentation.firstChild.nodeValue = first;
			quote_unescaped = true;
        }

        if (first.indexOf("&lt;forms")>=0 || first.indexOf("&lt;events")>=0 || first.indexOf("&lt;documentation")>=0 || first.indexOf("&lt;title")>=0) {
            //var parsedXML = "<aux>" + Documentation.firstElementChild.outerHTML + "</aux>";

            /*first = first.split("&lt;").join("<");
            first = first.split("&gt;").join(">");
            first = first.split("&quot;").join("\"");*/

            first = first.split("&lt;events&gt;").join("<events>");
            first = first.split("&lt;forms&gt;").join("<forms>");
            first = first.split("&lt;documentation&gt;").join("<documentation>");
            first = first.split("&lt;title&gt;").join("<title>");

            //Elementos de forms y events
            first = first.split("&lt;event").join("<event");
            first = first.split("&lt;form").join("<form");

            //Atributos de forms
            first = first.split("&lt;attribute").join("<attribute");
			
			if (first.indexOf("<documentation>") >= 0) {
					
				var documentation_split = first.split("<documentation>");
				var documentation_split2;

				var first_aux;
				if (documentation_split.length > 1) {
					//habia algo adelante, lo escapeo
					documentation_split[0] = documentation_split[0].split("&quot;").join("\"");
					documentation_split[0] = documentation_split[0].split("&amp;").join("&");

					documentation_split2 = documentation_split[1].split("</documentation>");
					first_aux = documentation_split[0];
				} else {
					documentation_split2 = documentation_split[0].split("</documentation>");
				}

				if (!quote_unescaped)
					first_aux += "<documentation>" + documentation_split2[0].split("&amp;quot;").join("&quot;").split("&amp;gt;").join("&gt;");
				else 
					first_aux += "<documentation>" + documentation_split2[0];

				first_aux += "</documentation>";

				if (documentation_split2.length > 1) {
					//habia algo despues, lo escapeo
					documentation_split2[1] = documentation_split2[1].split("&quot;").join("\"");
					documentation_split2[1] = documentation_split2[1].split("&amp;").join("&");

					first_aux += documentation_split2[1];
				}

				first = first_aux;

			} else {
				first = first.split("&quot;").join("\"");
				first = first.split("&amp;").join("&");
			}
			

            first = first.split("&lt;/events&gt;").join("</events>");
            first = first.split("&lt;/forms&gt;").join("</forms>");
            first = first.split("&lt;/documentation&gt;").join("</documentation>");
            first = first.split("&lt;/title&gt;").join("</title>");

            //Elements de forms y events
            first = first.split("&lt;/event").join("</event");
            first = first.split("&lt;/form").join("</form");

            //Atributos de forms
            first = first.split("&lt;/attribute").join("</attribute");

            first = first.split("&gt;").join(">");

            first = first.split("&quot;").join("\"");

        }
        
        var parsedXMLStr = "<aux>" + first + "</aux>";

        var auxNode = facilis.parsers.ParseInUtils.getParsedNode(parsedXMLStr);
        for (var x = 0; x < auxNode.children.length; x++ ) {
            var cloned = auxNode.children[x].cloneNode(true);
            if (cloned.nodeName == "documentation") {
                doc = cloned;
            }
            if (cloned.nodeName == "forms") {
                forms = cloned;
            }
            if (cloned.nodeName == "events") {
                events = cloned;
            }
            if (cloned.nodeName == "title") {
                title = cloned;
            }
        }

        var values;
        var value;
        var i = 0;
        var docStr;

        if (doc && doc.firstChild && doc.firstChild.textContent) {
            docStr = doc.firstChild.textContent;
            //docStr = docStr.split("\n").join("");
        }else if (!doc) {
            if(Documentation.firstElementChild && Documentation.firstElementChild.nodeName!="forms" && Documentation.firstElementChild.nodeName!="events" && Documentation.firstElementChild.nodeName!="title"){
                //this.parsedModel.documentation = doc.outerHTML;
				console.log("CHEQUEAR DOCUMENTACION");
				docStr =  doc.outerHTML;
                //docStr = description.split("\n").join("");
            }
        }

        if (docStr && this.parsedModel.documentation!=null) {
            this.parsedModel.documentation =docStr;
        }

        if (forms && this.parsedModel.forms!=null) {

            values = this.getFormValues(forms);
            if (this.parsedModel instanceof facilis.model.Back) {
                for (var f = 0; f < values.length; f++ ) {
                    var id = parseInt(values[f].formId);
                    facilis.controller.FormResources.getInstance().addResource(values[f], id);
                }
            }else{
                this.parsedModel.forms=values;
            }
        }
		this.parsedModel.events=[];
        if (events) {
            this.parsedModel.events=this.parseEventElements(events);
        }
        if (title) {
			this.parsedModel.title=title.getAttribute("value");
        }
    }

    element.getFormValues=function(forms) {
        //var fDoc= facilis.parsers.ParseInUtils.getSubNode(formsData, "doc");
        //var stepData= facilis.parsers.ParseInUtils.getSubNode(fDoc, "data");
		
		console.log("VER EL PARSER DE STEPS");
        //if (!this.parsedModel.step) {
		if (facilis.getClassName(this.parsedModel).toLowerCase()=="back") {
            return this.getProcessForms(forms);
        }

        var stepValues = [];

        var stepsObj = {};
        var step = {order:0,pforms:new Array(),eforms:[]};
        stepsObj["1"] = step;
        var i;

        if (forms.firstElementChild && !forms.firstElementChild.nodeName) {
            forms = facilis.parsers.ParseInUtils.getParsedNode("<forms>"+forms.firstElementChild.outerHTML+"</forms>");
        }

        for (i = 0; i < forms.children.length; i++ ) {
            var form = forms.children[i];
            if (!form.nodeName) {
                form=facilis.parsers.ParseInUtils.getParsedNode(form);
            }
            if (form.frmStepId) {
                if (stepsObj[formfrmStepId]) {
                    step = stepsObj[form.frmStepId];
                }else {
                    step = { order:parseInt(form.frmStepId),pforms:[],eforms:[] };
                    stepsObj[form.frmStepId]=step;
                }
            }
            var frmOrder = i;
            if (form.frmOrder) {
                frmOrder = parseInt(form.frmOrder);
            }
            var frmType = form.frmType;
            if(frmType=="P"){
                step.pforms.push( { order:frmOrder, form:form } );
            }else {
                step.eforms.push( { order:frmOrder, form:form } );
            }
        }

        var stepArray = [];
        for (var stepNum in stepsObj) {
            stepArray.push(stepsObj[stepNum]);
        }

        stepArray.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
        
        i = 0;

        for (i = 0; i < stepArray.length; i++ ) {
            var stepEFormsValues = [];
            var stepPFormsValues = [];

			
			
			var formsArr = stepArray[i].eforms;
            formsArr.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
            var f = 0;
            var frmValue;
            for (f = 0; f < formsArr.length; f++ ) {
                frmValue = this.getFormValue(formsArr[f].form);
                if (frmValue) {
                    stepEFormsValues.push(frmValue);
                }
            }
            formsArr = stepArray[i].pforms;
            formsArr.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
            f = 0;
            for (f = 0; f < formsArr.length; f++ ) {
                frmValue = this.getFormValue(formsArr[f].form);
                if (frmValue) {
                    stepPFormsValues.push(frmValue);
                }
            }
			
			console.log("FIX STEP FORMS PARSER GET STEP REQUIRED");
			var stepValue={};
			
			//if (stepValue.stepformse!=null){
				stepValue.stepformse=stepEFormsValues;
				console.log("stepformse en ElementParser.as");
			/*} 
			if(stepValue.entityforms!=null) {*/
				stepValue.entityforms=stepEFormsValues;
				console.log("entityforms en ElementParser.as");
			/*} 
			if (stepValue.stepformsp!=null){
				stepValue.stepformsp=stepPFormsValues;*/
				console.log("stepformsp en ElementParser.as");
			/*} 
			if(stepValue.stepformsp!=null) {*/
				stepValue.stepformsp=stepPFormsValues;
				console.log("stepformsp en ElementParser.as");
			//}
			stepValues.push(stepValue);
        }
        return stepValues;
    }

    element.getProcessForms=function(forms, formsData) {

        var values = [];
        for (var i = 0; i < forms.children.length; i++ ) {
            values.push(this.getFormValue(forms.children[i]));
        }
        return values;
    }

    element.getFormValue=function(form,addNoExist) {
        if(!(form.getAttribute("name")=="undefined" && form.getAttribute("description")=="undefined") /*|| forms.children.length!=3*/){
            var formEl = new facilis.model.Form();
            formEl.formId = (((form.getAttribute("frmId") + "") != "undefined")?form.getAttribute("frmId"):"");
            formEl.formName = (((form.getAttribute("frmName") + "") != "undefined")?form.getAttribute("frmName"):"");
            formEl.formDesc = (((form.getAttribute("frmTitle") + "") != "undefined")?form.getAttribute("frmTitle"):"");
            if (formEl.formName=="" && form.getAttribute("name")) {
                formEl.formName = (((form.getAttribute("name") + "") != "undefined")?form.getAttribute("name"):"");
            }
            if (formEl.formDesc=="" && form.attributes.description) {
                formEl.formDesc = (((form.attributes.description + "") != "undefined")?form.attributes.description:"");
            }
            
			var evts=facilis.parsers.ParseInUtils.getSubNode(form, "events");
			if(formEl.frmEvents!=null){
				formEl.frmEvents=[];
            	if (evts) {
                    frmEvents=this.parseEventElements(evts);
                }
            }
            
            if(formEl.doc!=null){
                formEl.doc=[];
				for (var d = 0; d < form.children.length; d++ ) {
                    if(form.children[d].nodeName=="attribute" || form.children[d].nodeName=="documentation"){
						var dValue={};

						if (!form.children[d].getAttribute("attName") && form.children[d].getAttribute("name")) {
							form.children[d].setAttribute("attName", form.children[d].getAttribute("name"));
						}
						if (!form.children[d].getAttribute("attLabel") && form.children[d].getAttribute("description")) {
							form.children[d].setAttribute("attLabel", form.children[d].getAttribute("description"));
						}
						if (!form.children[d].getAttribute("regExp") && form.children[d].getAttribute("rules")) {
							form.children[d].setAttribute("regExp", form.children[d].getAttribute("rules"));
						}

						dValue.fname=form.children[d].getAttribute("attName");
						dValue.description=form.children[d].getAttribute("attLabel");
						dValue.tooltip=form.children[d].getAttribute("attTooltip");
						dValue.datatype=form.children[d].getAttribute("datatype");
						dValue.fieldtype=this.getFieldType(form.children[d].getAttribute("fieldtype"));
						dValue.rules=form.children[d].getAttribute("regExp");
						dValue.grid=form.children[d].getAttribute("grid");
						formEl.doc.push(dValue);
                    }
                }
            }
            if(formEl.formId=="" && addNoExist){
                var frmAdded = this.addFormResource(form);
                formEl.formId=frmAdded.resourceId;
            }
            return formEl;
        }
        return null;
    }

    element.addFormResource=function(form){
        var mainXML = facilis.View.getInstance().getMainProcessData();
        mainXML.forms;
        var parsedForm = form;
        if (parsedForm.formName) {
            if (!facilis.controller.FormResources.getInstance().checkExists(parsedForm.formName)) {
                parsedForm = facilis.controller.FormResources.getInstance().addResource(form);					
            } else {
                parsedForm.resourceId= facilis.controller.FormResources.getInstance().getExistingId(parsedForm.formName);
            }
        } else {				
            parsedForm = facilis.controller.FormResources.getInstance().addResource(parsedForm);
        }
        return parsedForm;
    }

    element.getFieldType=function(type) {
        var t = "";
        switch (type){
            case "Radio":
            t = "Radio Button";
            break;
            case "TextArea":
            t = "Text Area";
            break;
            case "FileInput":
            t = "File Input";
            break;
            case "Listbox":
            t = "ListBox";
            break;
            case "Checkbox":
            t = "CheckBox";
            break;
            case "Combobox":
            t = "ComboBox";
            break;
            default:
            t = type;
            break;
        }
        if (t == "Input" || t == "ComboBox" || t == "ListBox" || t == "CheckBox" || t == "Radio Button" || t == "Text Area" || t == "File Input" || t == "Editor" || t == "Password") {
            //return t;
        }else{
            t="Input";
        }
        return t;
    }

    element.parseEventElements=function(events) {
        var parsedEvents=[];
        
		if (events.firstElementChild && !events.firstElementChild.nodeName) {
            events = facilis.parsers.ParseInUtils.getParsedNode("<events>"+events.firstElementChild.outerHTML+"</events>");
        }
        for (var i=0; i < events.children.length; i++ ) {
            var event = events.children[i];
            if(!(event.getAttribute("name")=="undefined" && event.getAttribute("description")=="undefined")){
                var value = new facilis.model.Event();
                if (!event.getAttribute("busClaName") && event.getAttribute("action")) {
                    event.setAttribute("busClaName", event.getAttribute("action"));
                }
                if (!event.getAttribute("evtName") && event.getAttribute("name")) {
                    event.setAttribute("evtName", event.getAttribute("name"));
                }
                value.evtName=((event.getAttribute("evtName")!="undefined")?event.getAttribute("evtName"):"");
                value.clsName= ((event.getAttribute("busClaName")!= "undefined")?event.getAttribute("busClaName"):"");
                value.clsDesc=((event.getAttribute("busClaDesc")!= "undefined")?event.getAttribute("busClaDesc"):"");
                parsedEvents.push(value);
            }
        }
		return parsedEvents;
    }

    element.parseCategories=function() {
		var ObjectTag = this.getToParseSubNode("Object");
		var Categories = facilis.parsers.ParseInUtils.getSubNode(ObjectTag, "Categories");
		if(Categories && this.parsedModel.categories){
			this.parsedModel.categories=this.parseCategoriesNode(Categories);
		}
    }

    element.parseCategoriesNode=function(Categories) {
        this.parseSubCategories(Categories, values);
    }

    element.parseSubCategories=function(Categories) {
		var ret=[];
        for (var i = 0; i < Categories.children.length;i++ ) {
            var category = this.getCategoryNode(Categories.children[i]);
            if (category) {
                ret.push(category);
            }
        }
		return ret;
    }

    element.getCategoryNode=function(Category) {
        var level = {};
        level.id=Category.getAttribute("CategoryId");
        level.value=Category.getAttribute("Name");
        level.type="label";
        if(Category.children.length>0){
            level.subCategories=this.parseSubCategories(Category);
        }
        return level;
    }

    element.parseProperties=function() {
        var Properties = this.getToParseSubNode("Properties");
        if(this.parsedModel.properties!=null)
			this.parsedModel.properties=this.parsePropertiesNode(Properties);
    }

    element.parsePropertiesNode=function(Properties) {
        var properties=[];
		if (Properties) {
            for (var i = 0; i < Properties.children.length; i++ ) {
                var Property = Properties.children[i];
                var value= {};
				value.name=Property.getAttribute("Name");
				value.id=Property.getAttribute("PropertyId");
				value.propertytype= Property.getAttribute("PropertyType");
				value.value=Property.getAttribute("Type");
				value.type=Property.getAttribute("Value");
				value.correlation=Property.getAttribute("Correlation");
				value.uk=Property.getAttribute("UK");
				value.multivalued=Property.getAttribute("Multivalued");
				value.index=Property.getAttribute("Index");
                properties.push(value);
            }
        }
		return properties;
    }


    element.parseDataFields=function() {
        var DataFields= this.getToParseSubNode("DataFields");
        if(this.parsedModel.properties!=null)
        	this.parsedModel.properties=this.parseDataFieldsNode(DataFields);
    }

    element.parseDataFieldsNode=function(DataFields) {
		
		var properties=[];
		if (DataFields) {
            for (var i = 0; i < DataFields.children.length; i++ ) {
                var Property = DataFields.children[i];
                var value= {};
				value.name=Property.getAttribute("Name");
				value.value=Property.getAttribute("Type");
				value.type=Property.getAttribute("Value");
				value.correlation=Property.getAttribute("Correlation");
				value.uk=Property.getAttribute("UK");
				value.multivalued=Property.getAttribute("Multivalued");
				value.index=Property.getAttribute("Index");
                properties.push(value);
            }
        }
		return properties;
    }

    element.parseUserAttributes=function() {
        var ExtendedAttributes= this.getToParseSubNode("ExtendedAttributes");
        if(ExtendedAttributes){
            if (this.parsedModel.userproperties!=null) {
				for (var i = 0; i < ExtendedAttributes.children.length;i++ ) {
					var value= {};
					value.name= ExtendedAttributes.children[i].getAttribute("Name");
					value.value= ExtendedAttributes.children[i].getAttribute("Value");
					value.type= ExtendedAttributes.children[i].getAttribute("Type");
					parsedModel.userproperties.push(value);
				}
            }
        }
    }

    element.getSubElements=function() {
		console.log("called element.getSubElements");
        return this.parsedModel.subElements;
    }

    


    facilis.parsers.input.ElementParser = facilis.promote(ElementParser, "Object");
    
}());


/*TODO sin terminar*/
(function() {

    function Activity() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.getElementType);
        this.parseFunctions.push(this.parseAssignments);
        this.parseFunctions.push(this.parsePerformers);
        this.parseFunctions.push(this.parseProEleId);
        
    }
    
    var element = facilis.extend(Activity, facilis.parsers.input.ElementParser);

    element.startParse=function() {
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getElementType=function() {
        var type = this.toParseNode.getAttribute("name");
        if (type=="gateway") {
            this.parsedModel.ElementType="G";
        }else if (type=="task") {
            this.parsedModel.ElementType="T";
        }else if (type=="csubflow" || type=="esubflow") {
            this.parsedModel.ElementType="S";
        }else if (type=="startevent" || type=="middleevent" || type == "endevent") {
            this.parsedModel.ElementType="E";
        }
    }


    element.parseAssignments=function() {
        var Assignments = this.getToParseSubNode("Assignments");
        if(this.parsedModel.assignments!=null)
        	this.parsedModel.assignments=this.parseAssignmentsNode(Assignments);
    }

    element.parseAssignmentsNode=function(Assignments) {
		var ret=[];
        if(Assignments){
            for (var i = 0; i < Assignments.children.length; i++ ) {
                ret.push(this.getAssignment(Assignments.children[i]));
            }
        }
		return ret;
    }

    element.getAssignment=function(Assignment ) {
		console.log("FIX element.getAssignment");
		var assignment={};
        var from = facilis.parsers.ParseInUtils.getSubNode(assignment, "from");
        var to = facilis.parsers.ParseInUtils.getSubNode(assignment, "to");

        var Expression = facilis.parsers.ParseInUtils.getSubNode(Assignment, "Expression");
        var Target = facilis.parsers.ParseInUtils.getSubNode(Assignment, "Target");

        var value = to.values;
		value.name= Target.getAttribute("Name");
		value.type= Target.getAttribute("Type");
		value.value= Target.getAttribute("Value");
		value.correlation= Target.getAttribute("Correlation");
		value.targettype= Target.getAttribute("TargetType");
		value.index= Target.getAttribute("Index");

        if(Expression.firstElementChild){
            facilis.parsers.ParseInUtils.setSubNodeValue(from, "expressionbody", Expression.firstElementChild.nodeValue);
        }

        facilis.parsers.ParseInUtils.setSubNodeValue(assignment, "assigntime", Assignment.getAttribute("AssignTime"));
		return assignment;
    }

    element.parsePerformers=function() {
        var Performers = this.getToParseSubNode("Performers");
        if (!Performers) {
            var Performer = this.getToParseSubNode("Performer");
            if (Performer) {
                Performers = this.parsedModel.ownerDocument.createElement( "Performers");
                Performers.appendChild(Performer);
            }
        }
		if(this.parsedModel.performers!=null)
        	this.parsedModel.performers=this.parsePerformersNode(Performers);

    }

    element.parsePerformersNode=function(Performers, performers) {
        if (this.parsedModel.performers && !(this.parsedModel.performers instanceof Array) ){
            if(Performers && Performers.firstElementChild && Performers.firstElementChild.firstElementChild) {
               return Performers.firstElementChild.firstElementChild.nodeValue;
            }
        }else if (Performers) {
			var performers=[];
            for (var i = 0; i < Performers.children.length; i++ ) {
                var Performer = Performers.children[i];
                var perfName = Performer.getAttribute("PerfName");
                var perfId = Performer.getAttribute("PerfId");

                if (!perfId && Performer.firstChild) {
                    perfId = Performer.firstChild.nodeValue;
                    var participant = facilis.parsers.ParserIn.getParticipantByIdOrName(perfId);
                    if (participant) {
                        perfId = participant.id;
                    }
                }
                if (!perfName) {
                    var p=facilis.parsers.ParserIn.getParticipantById(perfId);
                    if (p) {
                        perfName = p.name;
                    }
                }
				
				var parsedPerformer=new facilis.model.Performer();
                parsedPerformer.id= perfId;
                parsedPerformer.name=perfName;
				var Documentation = facilis.parsers.ParseInUtils.getSubNode(Performer,"Documentation");
                
				if (Documentation && parsedPerformer.documentation) {
                    parsedPerformer.documentation=this.parseDocumentationNode(Documentation);
                }
				
				if (parsedPerformer.condition && Performer.getAttribute("ProElePerfEvalCond")) {
                    parsedPerformer.condition=Performer.getAttribute("ProElePerfEvalCond");
                }
                if (parsedPerformer.conditionDoc && Performer.getAttribute("ConditionDoc")) {
                    parsedPerformer.conditionDoc = Performer.getAttribute("ConditionDoc");
                }
                if (perfName!="busClass") {
                    performers.push(parsedPerformer);
                }
            }
            return performers;
        }
    }

    element.parseWebServiceCatchNode=function(WebServiceCatchNode,messagecatch) {
        this.parseCatchWs(WebServiceCatchNode,messagecatch);
    }

    element.parseCatchWs=function(WebServiceMapping, messagecatch) {
        if(WebServiceMapping.firstElementChild){
            this.parseWs(WebServiceMapping.firstElementChild, messagecatch);
        }
    }

    element.parseWs=function(webservice, messagecatch) {
        //var value = data.cloneNode(true);
        var value = messagecatch.firstElementChild;
        var wsName = value.children[0];
        wsName.value=webservice.getAttribute("ws_method_name");
        var pAtts = value.children[1];
        var pValues = this.parsedModel.ownerDocument.createElement( "values");
        pAtts.appendChild(pValues);
        var eAtts = value.children[2];
        var eValues = this.parsedModel.ownerDocument.createElement( "values");
        eAtts.appendChild(eValues);
        for (var i = 0; i < webservice.children.length; i++ ) {
            var fValue;
            if (webservice.children[i].getAttribute("attribute_type") == "E") {
                fValue = this.getData(eAtts).cloneNode(true);
                eValues.appendChild(fValue);
            }else {
                fValue = this.getData(pAtts).cloneNode(true);
                pValues.appendChild(fValue);
            }
            fValue.nodeName = "value";
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "id", webservice.children[i].getAttribute("attribute_id"));
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "name", webservice.children[i].getAttribute("name"));
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "uk", (webservice.children[i].getAttribute("attribute_uk")=="T").toString());
            facilis.parsers.ParseInUtils.setSubNodeValue(fValue, "multivalued", (webservice.children[i].getAttribute("multivalued")=="T").toString());

        }
    }

    element.parseEvents=function(Events) {
		var bussinesClasses=[];
		if (Events) {
			for (var i = 0; i < Events.children.length; i++ ) {
				if(!Events.children[i].getAttribute("WS") || (Events.children[i].getAttribute("WS")=="false")){
					var event = this.parseEventClass(Events.children[i]);
					if(event){
						bussinesClasses.push(event);
					}
				}
			}
		}
		return bussinesClasses;
    }

    element.parseEventClass=function(event) {
        if (event.getAttribute("BusClaName") == "BPMNAutoComplete") {
            return null;
        }
		var value={};
        value.evtid=event.getAttribute("EvtId");
        value.clsid=event.getAttribute("BusClaId");
        value.evtname=event.getAttribute("EvtName");
        value.clsname=event.getAttribute("BusClaName");
        this.setSkipCondition(value,event.getAttribute("SkipCond"));

        value.binding=this.parseBindings(facilis.parsers.ParseInUtils.getSubNode(event, "BusClaParBindings"));

        return value;
    }

    element.setSkipCondition=function(value, condition) {
		value.skipcondition=condition;
    }

    element.parseBindings=function(BusClaParBindings) {
        var values = [];
        if (BusClaParBindings) {
            for (var i = 0; i < BusClaParBindings.children.length; i++ ) {
                var value = {};
                value.id= BusClaParBindings.children[i].getAttribute("BusClaParId");
                value.param= BusClaParBindings.children[i].getAttribute("BusClaParName");
                value.type= BusClaParBindings.children[i].getAttribute("BusClaParType");
                value.value= (BusClaParBindings.children[i].getAttribute("BusClaParBndValue")?BusClaParBindings.children[i].getAttribute("BusClaParBndValue"):"");
                value.attribute= (BusClaParBindings.children[i].getAttribute("AttName")?BusClaParBindings.children[i].getAttribute("AttName"):"");
                //FIX  value.attribute").getAttribute("atttype") = ((BusClaParBindings.children[i].getAttribute("BusClaParBndType") + "")  == "P")?"process":"entity";
                value.attributeid= (BusClaParBindings.children[i].getAttribute("AttId")?BusClaParBindings.children[i].getAttribute("AttId"):"");
				value.attributetooltip= (BusClaParBindings.children[i].getAttribute("AttTooltip") ? BusClaParBindings.children[i].getAttribute("AttTooltip") : "");
				values.push(value);
            }
        }
		return values;
    }


    element.parseWebServiceThrowNode=function(WebServiceThrow, messagethrow) {
        this.parseThrowWs(messagethrow);

    }

    element.parseThrowWs=function(messagethrow) {
        var bussinessclasses = [];
        var ApiaTskEvents = this.getToParseSubNode("ApiaEvents");
        if (ApiaTskEvents && (ApiaTskEvents.children.length > 0)) {
            for (var i = 0; i < ApiaTskEvents.children.length; i++ ) {
                var ApiaTskEvent = this.parseWsEventClass(ApiaTskEvents.children[i]);
                if (ApiaTskEvents.children[i].getAttribute("WS") && ApiaTskEvents.children[i].getAttribute("WS") == "true" && ApiaTskEvents.children[i].getAttribute("BusClaId") != "102") {
                    bussinessclasses.push(ApiaTskEvent);
                }
            }
        }
		return bussinessclasses;
    }

    element.parseWsEventClass=function(ApiaTskEvent,value) {
		
		var value={evtname:"",evtid:"",clsname:"",clsid:"",binding:[]};

        value.evtid=ApiaTskEvent.getAttribute("EvtId");
        value.clsid=ApiaTskEvent.getAttribute("BusClaId");
        value.evtname=ApiaTskEvent.getAttribute("EvtName");
        value.clsname= ApiaTskEvent.getAttribute("BusClaName");

        value.binding=this.parseWsBindings(facilis.parsers.ParseInUtils.getSubNode(ApiaTskEvent, "BusClaParBindings"));

        return value;
    }

    element.parseWsBindings=function(BusClaParBindings, node) {
        var values = [];
        if (BusClaParBindings) {
            for (var i = 0; i < BusClaParBindings.children.length; i++ ) {
                var value = {id:"",param:"",type:"",value:"",attribute:"",attributeid:"",inout:"",attributetooltip:""};
                value.id= BusClaParBindings.children[i].getAttribute("BusClaParId");
                value.param= BusClaParBindings.children[i].getAttribute("BusClaParName");
                value.type= BusClaParBindings.children[i].getAttribute("BusClaParType");
                value.value= BusClaParBindings.children[i].getAttribute("BusClaParBndValue");
                value.attribute = ((BusClaParBindings.children[i].getAttribute("AttName"))?BusClaParBindings.children[i].getAttribute("AttName"):"");
                value.attributeid=(BusClaParBindings.children[i].getAttribute("AttId"))?BusClaParBindings.children[i].getAttribute("AttId"):"";
                value.uk=BusClaParBindings.children[i].getAttribute("UK");
                value.multivalued=BusClaParBindings.children[i].getAttribute("Multivalued");
				values.push(value);
            }
        }
		return values;
    }


    element.getWsPublications=function() {
        var WsPublications = this.getToParseSubNode("WsPublications");
        if (WsPublications) {
            var webservices = this.getParsedSubNode("webservices");
            var data = this.getData(webservices);
            var values = this.parsedModel.ownerDocument.createElement( "values");
            if (data) {
                for (var i = 0; i < WsPublications.children.length; i++ ) {
                    var WsPublication = WsPublications.children[i];
                    var value = data.cloneNode(true);
                    value.nodeName = "value";
                    facilis.parsers.ParseInUtils.getSubNode(value, "wsname").value= WsPublication.getAttribute("WsName");
                    var WsPublicationAttributes = facilis.parsers.ParseInUtils.getSubNode(WsPublication, "WsPublicationAttributes");
                    var entAtts = facilis.parsers.ParseInUtils.getSubNode(value, "entityattributes");
                    var pcsAtts = facilis.parsers.ParseInUtils.getSubNode(value, "processattributes");
                    if (WsPublicationAttributes){
                        var entAttsValues = this.parsedModel.ownerDocument.createElement( "values");
                        var pcsAttsValues = this.parsedModel.ownerDocument.createElement( "values");
                        entAtts.appendChild(entAttsValues);
                        pcsAtts.appendChild(pcsAttsValues);
                        var attData = this.getData(entAtts);

                        for (var u = 0; u < WsPublicationAttributes.children.length; u++ ) {
                            var val = parseWSAttribute(attData,WsPublicationAttributes.children[u]);
                        }

                    }
                }
            }
        }
    }

    element.parseWSAttribute=function(dataXML, WsPublicationAttribute) {
        var value = dataXML.cloneNode(true);
        if(WsPublicationAttribute){
            for (var i = 0; i < WsPublicationAttribute.children.length; i++ ) {
                /*var value = values.children[i];
                var WsPublicationAttribute = this.parsedModel.ownerDocument.createElement( "WsPublicationAttribute");
                WsPublicationAttributes.appendChild(WsPublicationAttribute);
                WsPublicationAttribute.WsAttType", type);
                for (var u = 0; u < value.children.length; u++ ) {
                    var name = value.children[u].getAttribute("name");
                    var val = value.children[u].getAttribute("value");
                    if(val){
                        if (name=="id") {
                            WsPublicationAttribute.AttId", val);
                        }else if (name=="name") {
                            WsPublicationAttribute.AttName", val);
                        }else if (name=="unique") {
                            WsPublicationAttribute.WsAttUk", val);
                        }else if (name=="multiple") {
                            WsPublicationAttribute.Multivaluated", val);
                        }
                    }
                }*/
            }
        }
    }

    element.parseProEleId=function() {
        var ProEleId = this.toParseNode.getAttribute("Id");
        /*var ProEleId = this.toParseNode.getAttribute("ProId");
        if (!ProEleId) {
            ProEleId = this.toParseNode.getAttribute("Id");
        }*/
        if (ProEleId) {
            this.parsedModel.proeleid= ProEleId;
        }
    }
    
    
    facilis.parsers.input.Activity = facilis.promote(Activity, "ElementParser");
    
}());


(function() {

    function ActivityElement() {
        this.Activity_constructor();
        this.parseFunctions.push(this.getLoopType);
    }
    
    var element = facilis.extend(ActivityElement, facilis.parsers.input.Activity);
    
    element.getLoopType=function() {
        var loop = this.getToParseSubNode("Loop");
        if (loop && loop.attributes.LoopType) {
            var loopType = loop.getAttribute("LoopType");
            if(this.parsedModel.looptype!=null)
				this.parsedModel.looptype= loopType;
			
            var std = loop.firstElementChild;
            if (loopType == "Standard") {
                var testTime = std.attributes.TestTime;
                var loopmaximum = std.attributes.LoopMaximum;
                var loopcounter = std.attributes.LoopCounter;
                this.setParsedModelValue("testTime", testTime);
                this.setParsedModelValue("loopmaximum", loopmaximum);
                this.setParsedModelValue("loopcounter", loopcounter);
				this.setParsedModelValue("loopcondition", std.attributes.LoopCondition);
				this.setParsedModelValue("loopdocumentation", std.attributes.ConditionDoc);

            }else if (loopType == "MultiInstance") {
                var LoopMultiInstance = facilis.parsers.ParseInUtils.getSubNode(loop, "LoopMultiInstance");
                if (LoopMultiInstance && this.parsedModel.mi_condition!=null) {
                    if (LoopMultiInstance.attributes.MultiplierAttId) {
                        this.parsedModel.mi_condition={
							id:LoopMultiInstance.attributes.MultiplierAttId,
							name:LoopMultiInstance.attributes.MultiplierAttName
						}
                    }else {
                        if( LoopMultiInstance.getAttribute("MI_Condition") && Utils.isNumeric( LoopMultiInstance.getAttribute("MI_Condition"))){
                            this.setParsedModelValue("mi_condition", LoopMultiInstance.getAttribute("MI_Condition"));
                        }
                    }
					this.setParsedModelValue("mi_ordering", LoopMultiInstance.getAttribute("MI_Ordering"));
                    
                }
            }
        }
    }

    facilis.parsers.input.ActivityElement = facilis.promote(ActivityElement, "Activity");
    
}());




(function() {

    function Artifact() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.getTextAnnotation);
        this.parseFunctions.push(this.getState);
        this.parseFunctions.push(this.getName);
		this.parseFunctions.push(this.getIsCollection);
		this.parseFunctions.push(this.getCapacity);
		this.parseFunctions.push(this.getIsUnlimited);
    }
    
    //static public//
    
    
    var element = facilis.extend(Artifact, facilis.parsers.input.ElementParser);
    
    element.startParse=function(){
        this.callParseFunctions();
        return this.parsedModel;
    }

    element.getTextAnnotation=function() {
        var textannotation = this.toParseNode.getAttribute("TextAnnotation");
        if (textannotation) {
            this.parsedModel.text=textannotation;
        }
    }

    element.getName=function() {
        if (this.toParseNode.getAttribute("Name")) {
            var name = this.toParseNode.getAttribute("Name");
            if (name != null) {
                this.parsedModel.name=name;
            }
        }
    }

    element.getState=function() {
        if (this.toParseNode.firstElementChild) {
            var DataObject = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "DataObject");
            if(DataObject){
                var state = DataObject.getAttribute("State");
                if (state != null) {
                    this.parsedModel.state=state;
                }
            }
        }
    }
	
	element.getIsCollection=function() {
		if (this.toParseNode.firstElementChild) {
			var DataObject;
			if (this.toParseNode.nodeName.indexOf("DataInput") >= 0) {
				DataObject = this.toParseNode;
			/*} else if (toParseNode.nodeName.indexOf("DataOutput") >= 0) {
				DataObject = toParseNode;*/
			} else {
				DataObject = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "DataObject");
			}
			if(DataObject){
				var isCollection = DataObject.getAttribute("IsCollection");
				if (isCollection != null) {
					this.parsedModel.isCollection= isCollection;
				}
			}
		}
	}
	/*
	element.getDataObjectType=function() {
		if (toParseNode.firstElementChild) {
			if (toParseNode.nodeName.indexOf("DataInput") >= 0) {
				setParsedModelValue("dataobjectType", "Input");
			} else if (toParseNode.nodeName.indexOf("DataOutput") >= 0) {
				setParsedModelValue("dataobjectType", "Output");
			} else {
				setParsedModelValue("dataobjectType", "None");
			}
		}
	}
	*/
	element.getCapacity=function() {
		var capacity = this.toParseNode.getAttribute("Capacity");
		if (capacity) {
			this.parsedModel.capacity=capacity;
		}
	}

	element.getIsUnlimited=function() {
		var isUnlimited = this.toParseNode.getAttribute("IsUnlimited");
		if (isUnlimited) {
			this.parsedModel.isUnlimited= isUnlimited;
		}
	}


    facilis.parsers.input.Artifact = facilis.promote(Artifact, "ElementParser");
    
}());

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

(function() {

    function Lane() {
        this.ElementParser_constructor();
        
    }
    
    var element = facilis.extend(Lane, facilis.parsers.input.ElementParser);

    facilis.parsers.input.Lane = facilis.promote(Lane, "ElementParser");
    
}());

(function() {

    function Gateway() {
        this.ElementParser_constructor();
        this.Route;
        this.parseFunctions.push(this.getRoute);
        this.parseFunctions.push(this.getInstantiate);
        this.parseFunctions.push(this.getExclusiveType);
        this.parseFunctions.push(this.getMarkerVisible);
        this.parseFunctions.push(this.getIncomingCondition);
        this.parseFunctions.push(this.getOutgoingCondition);
        this.parseFunctions.push(this.parseExecutionType);
    }
    
    //static public//
    
    
    var element = facilis.extend(Gateway, facilis.parsers.input.ElementParser);
    
    element.getRoute=function() {
        Route = this.getToParseSubNode("Route");
        if (!Route) {
            Route = this.getToParseSubNode("Gateway");
        }
        if (Route) {
            var gatewaytype = Route.getAttribute("GatewayType");
            if (facilis.View.getInstance().offline) {
                if (gatewaytype=="AND") {
                    gatewaytype = "Parallel";
                }
                if (gatewaytype=="XOR") {
                    gatewaytype = "Exclusive";
                }
                if (gatewaytype=="OR") {
                    gatewaytype = "Inclusive";
                }
            }
            if (gatewaytype) {
                this.parsedModel.gatewaytype=gatewaytype;
            }
        }
    }

    element.getInstantiate=function() {
        if(Route && Route.attributes.Instantiate){
            this.parsedModel.instantiate=(Route.getAttribute("Instantiate")||"false").toLowerCase()=="true";
        }
    }

    element.getExclusiveType=function() {
        if(Route && Route.getAttribute("ExclusiveType") && this.parsedModel.exclusivetype){
            this.parsedModel.exclusivetype=Route.getAttribute("ExclusiveType");
        }
    }

    element.getMarkerVisible=function() {
        if(Route && Route.getAttribute("MarkerVisible") && this.parsedModel.markervisible){
            this.parsedModel.markervisible=Route.getAttribute("MarkerVisible");
        }
    }

    element.getIncomingCondition=function() {
        if (Route && Route.getAttribute("IncomingCondition") && this.parsedModel.incomingcondition){
            this.parsedModel.incomingcondition=Route.getAttribute("IncomingCondition");
        }
    }

    element.getOutgoingCondition=function() {
        if (Route && Route.getAttribute("OutgoingCondition") && this.parsedModel.outgoingcondition){
            this.parsedModel.outgoingcondition= Route.getAttribute("OutgoingCondition");
        }
    }

    element.parseExecutionType=function() {
        if (Route && Route.getAttribute("ExecutionType") && this.parsedModel.executiontype) {
            this.parsedModel.executiontype = Route.getAttribute("ExecutionType");
        }
    }


    facilis.parsers.input.Gateway = facilis.promote(Gateway, "ElementParser");
    
}());

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



(function() {

    function Subflow() {
        this.ActivityElement_constructor();
        this.parseFunctions.push(this.getImplementation);
        this.parseFunctions.push(this.getIsTransaction);
        this.parseFunctions.push(this.getBlockActivity);
        this.parseFunctions.push(this.getIsExpanded);
        this.parseFunctions.push(this.getExecution);
        this.parseFunctions.push(this.getDataMappings);
        this.parseFunctions.push(this.parseSkipFirstTask);
        this.parseFunctions.push(this.getPrcName);
        this.parseFunctions.push(this.getFormsRef);
        this.parseFunctions.push(this.getEntity);
    }
    
    var element = facilis.extend(Subflow, facilis.parsers.input.ActivityElement);
    
    
    element.getImplementation=function() {
        /*var strNode = "<Implementation><Task>";
        var type = this.getToParseSubNodeValue("taskType");
        if (type.attributes.value!="") {
            strNode+="<"+type.attributes.value+" />"
        }
        strNode += "</Task></Implementation>";
        var implementationNode = getParsedNode(strNode);
        this.this.parsedModel.appendChild(implementationNode);*/
    }

    element.getIsTransaction=function() {
        var IsATransaction = this.toParseNode.getAttribute("IsATransaction");
        if (IsATransaction!="false") {
            if(this.parsedModel.isATransaction!=null)
				this.parsedModel.isATransaction=IsATransaction;
			
            var Transaction = this.getToParseSubNode("Transaction");
            if (Transaction) {
				if(this.parsedModel.transactionid!=null)
					this.parsedModel.transactionid=Transaction.getAttribute("Id");
            }
        }
    }

    element.getIsAdhoc=function() {
        var adhoc = this.toParseNode.attributes.AdHoc.value;
        if (adhoc!="false") {
			
			if(this.parsedModel.adhoc!=null)
				this.parsedModel.adhoc=true;
			
            var adhocordering = this.getToParseSubNode("AdHocOrdering");
            if (adhocordering) {
				if(this.parsedModel.adhocordering!=null)
					this.parsedModel.adhocordering=adhocordering;
            }

        }
    }

    element.getBlockActivity=function() {
        var BlockActivity = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "BlockActivity");
        if (BlockActivity) {
            var ActivitySetId = BlockActivity.attributes.ActivitySetId.value;
            if (this.parsedModel.name!=null) {
                var values = {
					name:this.parsedModel.name,
					id:ActivitySetId
				};
            }
        }
    }

    element.getIsExpanded=function() {
        var NodeGraphicsInfo = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "NodeGraphicsInfo");
        if(NodeGraphicsInfo){
            var expanded = NodeGraphicsInfo.getAttribute("Expanded");
            if (expanded == "true") {
                this.parsedModel.expanded = expanded;
                if(NodeGraphicsInfo.getAttribute("ExpandedWidth") &&
				   NodeGraphicsInfo.getAttribute("ExpandedHeight")){
                    this.parsedModel.width = NodeGraphicsInfo.getAttribute("ExpandedWidth");
                    this.parsedModel.height = NodeGraphicsInfo.getAttribute("ExpandedHeight");
                }
            }
        }
    }

    element.getExecution=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            if(SubFlow.getAttribute("ApiaExecution")=="MAP"){
                var processtype = this.setParsedModelValue("subprocesstype", "Embedded");
            }else {
                if(this.parsedModel.subprocesstype!=null)
					this.parsedModel.subprocesstype= "Reusable";
				
                var exec = SubFlow.getAttribute("ApiaExecution");
                if (exec && (exec.indexOf("_SKIP") > 0) ) {
                    exec = exec.split("_")[0];
                }
				
				if(this.parsedModel.execution!=null)
					this.parsedModel.execution= exec;
            }
        }
    }


    element.getDataMappings=function() {
        var DataMappings = this.getToParseSubNode("DataMappings");
        if(DataMappings && this.parsedModel.datamappings!=null){
            var input = facilis.parsers.ParseInUtils.getSubNode(datamappings, "inputmaps");
            var inData = this.getData(input);
            var inValues = this.parsedModel.ownerDocument.createElement( "values");
            input.appendChild(inValues);

            var out = facilis.parsers.ParseInUtils.getSubNode(datamappings, "outputmaps");
            var outData = this.getData(out);
            var outValues = this.parsedModel.ownerDocument.createElement( "values");
            out.appendChild(outValues);
            var value;
            for (var i = 0 ; i < DataMappings.children.length; i++ ) {
                var DataMapping = DataMappings.children[i];
                if (DataMapping.attributes.Direction.value == "IN") {
                    value= inData.cloneNode(true);
                    value.nodeName = "value";
                    inValues.appendChild(value);
                    facilis.parsers.ParseInUtils.setSubNodeValue(value, "inputmap", DataMapping.attributes.TestValue.value);
                }else {
                    value= outData.cloneNode(true);
                    value.nodeName = "value";
                    outValues.appendChild(value);
                    facilis.parsers.ParseInUtils.setSubNodeValue(value, "outputmap", DataMapping.attributes.TestValue.value);
                }
            }
        }
    }

    element.parseSkipFirstTask=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "skipfirsttask", SubFlow.getAttribute("SkipFirstTask"));
        }
    }

    element.getPrcName=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", this.toParseNode.getAttribute("Name"));
        if (SubFlow) {
            var nameXPDL = SubFlow.getAttribute("Name");
            if (nameXPDL.indexOf(".xpdl") > 0) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "filename", nameXPDL);
            }
            var processref = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "name");
            if (processref) {
                var oldValues=facilis.parsers.ParseInUtils.getSubNode(processref, "values");
                if (oldValues) {
                    oldValues.removeNode();
                }
                var values = this.parsedModel.ownerDocument.createElement( "values");
                values.setAttribute("value", this.toParseNode.getAttribute("Name"));
                var value = facilis.parsers.ParseInUtils.getParsedNode("<value value=\"" + this.toParseNode.getAttribute("Name") + "\"><level name=\"id\" type=\"label\" value=\"" + SubFlow.attributes.Id.value + "\" /><level name=\"name\" type=\"label\" value=\"" + this.toParseNode.getAttribute("Name") + "\" /></value>");
                values.appendChild(value);
                processref.attributes.value.value = this.toParseNode.getAttribute("Name");
                processref.appendChild(values);
            }
        }
    }

    element.getEntity=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            var entity = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "entity");
            if (entity && SubFlow.attributes.ProEleAttBusEntName.value && SubFlow.attributes.ProEleAttBusEntId.value) {
                var values = this.parsedModel.ownerDocument.createElement( "values");
                var value = facilis.parsers.ParseInUtils.getParsedNode("<value value=\"" + SubFlow.attributes.ProEleAttBusEntName.value + "\"><level name=\"id\" type=\"label\" value=\"" + SubFlow.attributes.ProEleAttBusEntId.value + "\" /><level name=\"name\" type=\"label\" value=\"" + SubFlow.attributes.ProEleAttBusEntName.value + "\" /></value>");
                values.appendChild(value);
                entity.setAttribute("value", SubFlow.attributes.ProEleAttBusEntName.value);
                entity.appendChild(values);
            }
        }
    }

    element.getFormsRef=function() {
        if (this.parsedModel.processforms!=null && this.parsedModel.entityforms!=null) {
            var FormsRef = this.getToParseSubNode("FormsRef");
            this.parsedModel.processforms=[];
			this.parsedModel.entityforms=[];
			var eForms=[];
			var pForms=[];
			
            var order;
            if (FormsRef) {
                for (var u = 0; u < FormsRef.children.length; u++ ) {
                    if (FormsRef.children[u].attributes.FrmType.value == "E") {
                        order = parseInt(FormsRef.children[u].attributes.ProEleFrmOrder.value);
                        var eValue = this.parseFormRef(FormsRef.children[u]);
                        eForms.push( { order:order, data:eValue } );
                        //eValues.appendChild(eValue);
                    }else {
                        order = parseInt(FormsRef.children[u].attributes.ProEleFrmOrder.value);
                        var pValue = this.parseFormRef(FormsRef.children[u]);
                        pForms.push( { order:order, data:pValue } );
                        //pValues.appendChild(pValue);
                    }
                }
                eForms.sort(function(a,b){ return a.order<b.order;});
                pForms.sort(function(a,b){ return a.order<b.order;});
                for (var e = 0; e < eForms.length; e++ ) {
                    this.parsedModel.entityforms.push(eForms[e].data);
                }
                for (var p = 0; p < pForms.length; p++ ) {
                    this.parsedModel.processforms.push(pForms[p].data);
                }
            }
        }
    }

    element.parseFormRef=function(form) {
        var value = {};
        value.id= form.getAttribute("FrmId");
        value.name= form.getAttribute("FrmName");
        value.readonly= form.getAttribute("ProEleFrmReadOnly");
        value.multiple= form.getAttribute("ProEleFrmMultiply");
        value.condition=form.getAttribute("ProEleFrmEvalCond");
        value.documentation=form.getAttribute("ConditionDoc");
        
        return value;
    }

    facilis.parsers.input.Subflow = facilis.promote(Subflow, "ActivityElement");
    
}());

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


(function() {

    function Event() {
        this.Activity_constructor();
        this.parseFunctions.push(this.getAttached);
        this.parseFunctions.push(this.getEvent);
        this.parseFunctions.push(this.getTrigger);
        this.parseFunctions.push(this.getTriggerElement);
    }
    
    var element = facilis.extend(Event, facilis.parsers.input.Activity);
    
    
    element.getEvent=function() {
        var name = this.toParseNode.getAttribute("name");
        var Event = (this.getToParseSubNode("BPMNEvent"))?this.getToParseSubNode("BPMNEvent"):this.getToParseSubNode("Event");
        var val= Event.firstElementChild.localName;
        var evtType = ((val=="StartEvent")?"startevent": (val=="IntermediateEvent")? "middleevent" : "endevent"  );
        this.parsedModel.eventType= evtType;
    }

    element.getTrigger=function() {
        var event = (this.getToParseSubNode("BPMNEvent"))?this.getToParseSubNode("BPMNEvent"):this.getToParseSubNode("Event");
        var eventType = (event.firstElementChild.getAttribute("Trigger"))?event.firstElementChild.getAttribute("Trigger"):"";
        if (event.firstElementChild.getAttribute("Result")) {
            eventType = event.firstElementChild.getAttribute("Result");
        }
		if(this.parsedModel.eventdetailtype!=null)
        	this.parsedModel.eventdetailtype = eventType;
    }

    element.getTriggerElement=function() {
        var TriggerMultiple = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerMultiple");
        var TriggerResultMessage = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultMessage");
        var TriggerTimer = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerTimer");
        var TriggerConditional = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerConditional");
        var TriggerResultSignal = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultSignal");
        var ResultError = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "ResultError");
        var TriggerResultCompensation = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "TriggerResultCompensation");
        if (TriggerMultiple) {
            this.parseMultipleTrigger(TriggerMultiple, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "multiple"));
        }else if(TriggerResultMessage){
            this.parseMessageTrigger(TriggerResultMessage, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "message"));
        }else if(TriggerTimer){
            this.parseTimerTrigger(TriggerTimer, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "timer"));
        }else if(TriggerConditional){
            this.parseConditionalTrigger(TriggerConditional, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "conditional"));
        }else if(TriggerResultSignal){
            this.parseConditionalTrigger(TriggerResultSignal, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "signal"));
        }else if(ResultError){
            this.parseErrorTrigger(ResultError, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "error"));
        }else if(TriggerResultCompensation){
            this.parseCompensationTrigger(TriggerResultCompensation, facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "compensation"));
        }
    }

    element.getAttached=function() {
        var IntermediateEvent = this.getToParseSubNode("IntermediateEvent");
        if (IntermediateEvent && (IntermediateEvent.getAttribute("IsAttached") == "true" || IntermediateEvent.getAttribute("Target"))) {
            this.parsedModel.target=IntermediateEvent.getAttribute("Target");
            this.parsedModel.isattached=true;
        }else if (IntermediateEvent) {
            this.parsedModel.isattached=false;
        }
    }



    element.parseMessageTrigger=function(TriggerResultMessage, trigger) {
        var WebServiceThrow;
        var WebServiceMapping;
        if (TriggerResultMessage) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerResultMessage.getAttribute("Name"));
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "implementation", this.toParseNode.getAttribute("Implementation"));
            if (trigger && this.parsedModel.getAttribute("name") == "middleevent" ) {
                trigger.setAttribute("disabled", "false");
                //WebServiceThrow = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceThrow");
                var messagethrow = facilis.parsers.ParseInUtils.getSubNode(trigger, "outmessageref");
                var messagecatch = facilis.parsers.ParseInUtils.getSubNode(trigger, "inmessageref");
                WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceMapping");
                if (WebServiceMapping) {
                    if(messagethrow){
                        messagethrow.setAttribute("disabled", "true");
                    }
                    parseWebServiceCatchNode(WebServiceMapping, messagecatch);
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger,"catchthrow", "CATCH");
                }else {
                    if(messagecatch){
                        messagecatch.setAttribute("disabled", "true");
                    }
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger,"catchthrow", "THROW");
                    parseWebServiceThrowNode(null, messagethrow);
                }
                if (TriggerResultMessage.getAttribute("CatchThrow")) {
                    facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "catchthrow", (TriggerResultMessage.getAttribute("CatchThrow")+"").toUpperCase());
                }
            }else if (!trigger && this.parsedModel.getAttribute("name") == "middleevent" ) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "catchthrow", (TriggerResultMessage.getAttribute("CatchThrow")+"").toUpperCase());
            }else if (this.parsedModel.getAttribute("name") == "endevent") {
                WebServiceThrow = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceThrow");
                parseWebServiceThrowNode(null, trigger);
            }else {
                WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TriggerResultMessage, "WebServiceMapping");
                //var msgcatch = facilis.parsers.ParseInUtils.getSubNode(trigger, "message");
                if (WebServiceMapping) {
                    parseWebServiceCatchNode(WebServiceMapping, trigger);
                }
            }

        }
    }

    element.parseTimerTrigger=function(TriggerTimer, trigger) {
        if (TriggerTimer) {
            var timeDate = TriggerTimer.getAttribute("TimeDate");
            var endDate = TriggerTimer.getAttribute("EndDate");
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "initdate", timeDate);
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "enddate", endDate);

            var timerattribute = facilis.parsers.ParseInUtils.getSubNode(trigger, "timerattribute");
            if (timerattribute && timerattribute.firstElementChild && timerattribute.firstElementChild.firstElementChild) {
                timerattribute.firstElementChild.firstElementChild.setAttribute("value", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(timerattribute, "name", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(timerattribute, "id", TriggerTimer.getAttribute("TimerAttId"));
                timerattribute.setAttribute("value", TriggerTimer.getAttribute("TimerAttName"));
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "timerattributetype", TriggerTimer.getAttribute("TimerAttType"));
            }
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "value", TriggerTimer.getAttribute("TimeCycle"));
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "unit", TriggerTimer.getAttribute("TimeUnit"));
        }
    }

    element.parseConditionalTrigger=function(TriggerConditional, trigger) {
        if (TriggerConditional) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerConditional.getAttribute("Name"));
            var Expression = facilis.parsers.ParseInUtils.getSubNode(TriggerConditional, "Expression");
            if (Expression) {
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "expressionbody", Expression.firstElementChild.nodeValue);
            }
        }
    }

    element.parseSignalTrigger=function(TriggerResultSignal, trigger) {
        if (TriggerResultSignal) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "name", TriggerResultSignal.getAttribute("Name"));
        }
    }

    element.parseMultipleTrigger=function(TriggerMultiple, trigger) {
        
        var message = facilis.parsers.ParseInUtils.getSubNode(trigger, "multimessage");
        var timer = facilis.parsers.ParseInUtils.getSubNode(trigger, "multitimer");
        var values;
        if (TriggerMultiple) {
            for (var i = 0; i < TriggerMultiple.children.length; i++ ) {
                if (TriggerMultiple.children[i].nodeName == "TriggerResultMessage") {
                    parseMessageTrigger(TriggerMultiple.children[i], message);
                }else if (TriggerMultiple.children[i].nodeName == "TriggerTimer") {
                    parseTimerTrigger(TriggerMultiple.children[i], timer);
                }
            }
        }
    }

    element.parseErrorTrigger=function(ResultError, trigger) {
        if (ResultError) {
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "errorcode", ResultError.getAttribute("ErrorCode"));
        }
    }

    element.parseCompensationTrigger=function(TriggerResultCompensation, trigger) {
        if (TriggerResultCompensation) {
            var activitytype = TriggerResultCompensation.getAttribute("ActivityType");
            facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activitytype", activitytype);
            if(activitytype=="Task"){
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activityreftask", TriggerResultCompensation.getAttribute("ActivityId"));
            }else {
                facilis.parsers.ParseInUtils.setSubNodeValue(trigger, "activityrefsubproc", TriggerResultCompensation.getAttribute("ActivityId"));
            }
        }
    }

    element.parseMultiCompensationTrigger=function(TriggerResultCompensation, trigger) {
        if (TriggerResultCompensation) {
            trigger = facilis.parsers.ParseInUtils.getSubNode(trigger, "activityref");
            var values = this.parsedModel.ownerDocument.createElement( "values");
            var valueStr = "<value value=\"" + TriggerResultCompensation.getAttribute("ActivityId") + "\"><level name=\"name\" value=\"" + TriggerResultCompensation.getAttribute("ActivityId") + "\" /><level name=\"type\" value=\"" + TriggerResultCompensation.getAttribute("ActivityType") + "\" /></value>"
            trigger.setAttribute("value", TriggerResultCompensation.getAttribute("ActivityId"));
            var value = facilis.parsers.ParseInUtils.getParsedNode(valueStr);
            values.appendChild(value);
            trigger.appendChild(values);
        }
    }
    

    facilis.parsers.input.Event = facilis.promote(Event, "Activity");
    
}());

(function() {

    function Task() {
        this.ActivityElement_constructor();
        this.parseFunctions.push(this.getType);
        this.parseFunctions.push(this.getFormsRef);
        //this.parseFunctions.push(this.getApiaTskPools);
        this.parseFunctions.push(this.getRoleRef);
        this.parseFunctions.push(this.getApiaTskEvents);
        this.parseFunctions.push(this.getApiaTskStates);
        this.parseFunctions.push(this.getTaskService);
        this.parseFunctions.push(this.getTaskUser);
        this.parseFunctions.push(this.getTaskSend);
        this.parseFunctions.push(this.getTaskReceive);
        this.parseFunctions.push(this.getTaskName);
        this.parseFunctions.push(this.getApiaHighlightComments);
        this.parseFunctions.push(this.getTaskSchedule);
        this.parseFunctions.push(this.getSkipCondition);
        this.parseFunctions.push(this.getProEleId);
    }
    
    var element = facilis.extend(Task, facilis.parsers.input.ActivityElement);

    element.getType=function () {
		var taskTypeValue=null;
        var implementation = this.getToParseSubNode("Implementation");
        if (implementation && implementation.firstElementChild && implementation.firstElementChild.firstElementChild) {
            var taskType = implementation.firstElementChild.firstElementChild.localName;
            taskTypeValue=taskType.split("Task")[1];
        }else {
            taskTypeValue="None";
        }
		if(this.parsedModel.taskType!=null)
			this.parsedModel.taskType=taskTypeValue;
    }

    element.getFormsRef=function () {
        if(this.parsedModel.steps!=null){
            var FormsRef = this.getToParseSubNode("FormsRef");
            if (FormsRef && FormsRef.firstElementChild && FormsRef.firstElementChild.nodeName != "Step") {
                var FormsRefClone = this.toParseNode.ownerDocument.createElement( "FormsRef");
				
				
				
                var forms = new Array();
                for (var i = 0; i < FormsRef.children.length; i++ ) {
                    var stepId = FormsRef.children[i].getAttribute("ProEleFrmStepId");
                    var frmOrder = FormsRef.children[i].getAttribute("ProEleFrmOrder");
                    forms.push( {order:stepId, frmOrder:frmOrder, form:FormsRef.children[i].cloneNode(true)} );
                }
                //forms.sortOn("order", Array.NUMERIC);
                forms.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
                var actual = null;
				var acutalStep = 0;
                i = 0;
                for (i = 0; i < forms.length; i++ ) {
                    if (actual != forms[i].order) {
						
						//Agregar huecos de steps
						for (var j = acutalStep + 1; j < forms[i].order; j++) {
							FormsRefClone.appendChild(this.toParseNode.ownerDocument.createElement("Step"));
						}

						acutalStep = parseInt(forms[i].order);

						//Agregar step actual
						
                        actual = forms[i].order;
                        var Step = this.toParseNode.ownerDocument.createElement( "Step");
                        FormsRefClone.appendChild(Step);
                    }
                    Step.appendChild(forms[i].form);
                }
                if (FormsRefClone.children.length > 0) {
                    FormsRef = FormsRefClone;
                }
            }
            
            var step=(this.parsedModel.steps.length)?this.parsedModel.steps[0]:{entityforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}],processforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}]};
			this.parsedModel.steps=[];
            if (FormsRef) {
                for (var u = 0; u < FormsRef.children.length; u++ ) {
                    var value = this.parseStep(FormsRef.children[u],step);
                    this.parsedModel.steps.push(value);
                }
            }
        }
    }

    element.parseStep=function (step,stepObj) {
		var i;
        var value = facilis.clone(stepObj);			
		var pForms=[];
		var eForms=[];

        value.nodeName = "value";
        for (var i = 0; i < step.children.length; i++ ) {
            var fValue={};
            
            fValue.id=step.children[i].getAttribute("FrmId");
            fValue.name=step.children[i].getAttribute("FrmName");
            fValue.readonly=step.children[i].getAttribute("ProEleFrmReadOnly");
            fValue.multiple=step.children[i].getAttribute("ProEleFrmMultiply");
            if (step.children[i].getAttribute("ProEleFrmEvalCond")) {
				fValue.condition=step.children[i].getAttribute("ProEleFrmEvalCond");
            }
            if (step.children[i].getAttribute("ConditionDoc")) {
                fValue.documentation=step.children[i].getAttribute("ConditionDoc");
            }
			
			if (step.children[i].getAttribute("FrmType") == "E") {
                eForms.push(fValue);
            }else {
                pForms.push(fValue);
            }
			
        }
		
		for (var n in value ) {
			if (n == "stepformse" || n == "entityforms") {
				value[n]=eForms;
				console.log("stepformse en Task");
			} else if (n == "stepformsp"|| n == "processforms") {
				value[n]=pForms;
				console.log("stepformsp en Task");
			}
		}
		
        return value;
    }

    element.getApiaTskPools=function () {
        var groups = this.getParsedSubNode("groups");
        var data = this.getData(groups);
        var ApiaTskPools = this.getToParseSubNode("ApiaTskPools");
        var values = this.parsedModel.ownerDocument.createElement("values");
        groups.appendChild(values);

        if (ApiaTskPools) {
            for (var u = 0; u < ApiaTskPools.children.length; u++ ) {
                var value = data.cloneNode(true);
                value.nodeName = "value";
                values.appendChild(value);
                facilis.parsers.ParseInUtils.getSubNode(value, "id").setAttribute("value",ApiaTskPools.children[u].getAttribute("PoolId"));
                facilis.parsers.ParseInUtils.getSubNode(value, "name").setAttribute("value",ApiaTskPools.children[u].getAttribute("PoolName"));
                if (ApiaTskPools.children[u].getAttribute("ProElePoolEvalCond")) {
                    var condVals= this.parsedModel.ownerDocument.createElement( "values");
                    var condVal = this.parsedModel.ownerDocument.createElement( "value");
                    condVals.appendChild(condVal);
                    condVal.appendChild(ApiaTskPools.children[u].firstElementChild.cloneNode(true));
                    facilis.parsers.ParseInUtils.getSubNode(value, "condition").appendChild(condVals);
                }
            }
        }
    }

    element.getApiaTskStates=function () {
		var values=[];
        if(this.parsedModel.taskstates!=null){
            var ApiaTskStates = this.getToParseSubNode("ApiaTskStates");
            if(ApiaTskStates){
                for (var i = 0; i < ApiaTskStates.children.length; i++ ) {
                    var ApiaTskState = this.parseApiaTskState(ApiaTskStates.children[i]);
                    values.push(ApiaTskState);
                }
            }
        }
		return values;
    }

    element.parseApiaTskState=function (ApiaTskState) {
		var value={};
        value.evtid=ApiaTskState.getAttribute("EvtId");
        value.clsid=ApiaTskState.getAttribute("EntStaId");
        value.evtname=ApiaTskState.getAttribute("EvtName");
        value.clsname= ApiaTskState.getAttribute("StaName");
        if (ApiaTskState.getAttribute("ProEleBusEntStaEvalCond") && ApiaTskState.getAttribute("ProEleBusEntStaEvalCond")!="") {
            var cond = ApiaTskState.getAttribute("ProEleBusEntStaEvalCond");
			value.condition=cond;

        }
        if (ApiaTskState.getAttribute("ConditionDoc") && ApiaTskState.getAttribute("ConditionDoc")!="") {
            var doc = ApiaTskState.getAttribute("ConditionDoc");
			value.documentation=doc;
        }

        return value;
    }

    element.getApiaTskEvents=function () {
        var ApiaTskEvents = this.getToParseSubNode("ApiaEvents");
        if (ApiaTskEvents && this.parsedModel.bussinessclasses!=null) {
            this.parsedModel.bussinessclasses=this.parseEvents(ApiaTskEvents);
        }
    }

    element.getRoleRef=function () {
        var RoleRef = this.getToParseSubNode("RoleRef");

        if (RoleRef && this.parsedModel.role) {
            var values = this.parsedModel.ownerDocument.createElement( "values");
            var value = this.parsedModel.ownerDocument.createElement( "value");
            values.appendChild(value);
            var role=new facilis.model.Role();
            
			role.id=RoleRef.getAttribute("RoleId");
            role.name = RoleRef.getAttribute("RoleName");
			this.parsedModel.role=role;
        }
    }


    element.getValues=function (node) {
        for (var i = 0;i< node.children.length; i++ ) {
            if (node.children[i].nodeName=="values") {
                return node.children[i];
            }
        }
    }


    element.getTaskService=function () {
        var TaskService = this.getToParseSubNode("TaskService");
        if (TaskService && this.parsedModel.service!=null) {
			
			var taskservice=new facilis.model.Service();

            var MessageIn = facilis.parsers.ParseInUtils.getSubNode(TaskService, "MessageIn");
            var MessageOut = facilis.parsers.ParseInUtils.getSubNode(TaskService, "MessageOut");

            taskservice.inmessageref=this.getMessage(MessageIn, new facilis.model.Inmessageref());
            taskservice.outmessageref=this.getMessage(MessageOut, new facilis.model.Outmessageref());

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskService, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, taskservice.inmessageref);
            }

            this.parseWebServiceThrowNode(null, taskservice.outmessageref);
			this.parsedModel.service=taskservice;

        }
    }
    element.getTaskReceive=function () {
        var TaskReceive = this.getToParseSubNode("TaskReceive");
        if (TaskReceive && this.parsedModel.receive!=null) {
        	var taskreceive = new facilis.model.Receive();
			
            var Message = facilis.parsers.ParseInUtils.getSubNode(TaskReceive, "Message");

            //var WebServiceCatchNode = facilis.parsers.ParseInUtils.getSubNode(TaskService, "WebServiceCatch");
            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskReceive, "WebServiceMapping");
            taskreceive.messageref=this.getMessage(Message, new facilis.model.Message());
			
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                //this.parseWebServiceCatchNode(WebServiceCatchNode, messagein);
                this.parseWebServiceCatchNode(WebServiceMapping, taskreceive.messageref);
            }

            taskreceive.instantiate=TaskReceive.getAttribute("Instantiate");
			this.parsedModel.receive=taskreceive;
        }
    }
    element.getTaskSend=function () {
        var TaskSend = this.getToParseSubNode("TaskSend");
        if (TaskSend && this.parsedModel.send!=null) {
			var tasksend = (facilis.model.Send)?new facilis.model.Send():null;
			
            tasksend.messageref = (facilis.model.User)?new facilis.model.Messageref():null;
            var Message = facilis.parsers.ParseInUtils.getSubNode(TaskSend, "Message");

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskSend, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, tasksend.messageref);
            }

            this.parseWebServiceThrowNode(null, tasksend.messageref);

            tasksend.messageref=this.getMessage(Message, tasksend.messageref);
            
			tasksend.instantiate=TaskSend.getAttribute("Instantiate");
			this.parsedModel.send=tasksend;
        }

    }
    element.getTaskUser=function () {
        var TaskUser = this.getToParseSubNode("TaskUser");
        if (this.parsedModel.user!=null && TaskUser) {
        	var taskuser = (facilis.model.User)?new facilis.model.User():null;
			
            var MessageIn = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "MessageIn");
            var MessageOut = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "MessageOut");
			
            taskuser.messagein=this.getMessage(MessageIn, new facilis.model.Inmessageref());
            taskuser.messageout=this.getMessage(MessageOut, new facilis.model.Outmessageref());

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, taskuser.messagein);
            }

            this.parseWebServiceThrowNode(null, taskuser.messageout);
			this.parsedModel.user=taskuser;
        }
    }
    element.getTaskManual=function () {
        /*var taskmanual = this.getToParseSubNode("manual");
        if (taskmanual) {
            var TaskManual = this.parsedModel.ownerDocument.createElement( "TaskManual");
        }*/
    }


    element.getMessage=function (Message,message) {
        if(Message){
            message.name=Message.getAttribute("Name");
            //var properties = facilis.parsers.ParseInUtils.getSubNode(message, "properties");
            var Properties = facilis.parsers.ParseInUtils.getSubNode(Message , "Properties");
            message.properties=this.parsePropertiesNode(Properties);
        }
		return null;
    }

    element.getTaskName=function () {
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", this.toParseNode.getAttribute("Name"));
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "nameChooser", this.toParseNode.getAttribute("Name"));
        TaskNode = this.getToParseSubNode("Task");
        if (TaskNode && TaskNode.getAttribute("TskName")) {
            //facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", TaskNode.getAttribute("TskName"));
            var tsk_title = TaskNode.getAttribute("TskTitle") ? TaskNode.getAttribute("TskTitle") : TaskNode.getAttribute("TskName");
			var tsk_name = TaskNode.getAttribute("TskName");
			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", tsk_title);
			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "tname", tsk_name);

			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "nameChooser", TaskNode.getAttribute("TskName"));
			
			var values = "<values><value value=\""+TaskNode.getAttribute("TskName")+"\"><level name=\"id\" value=\"" + TaskNode.getAttribute("TskId") + "\" /><level name=\"name\" value=\"" + tsk_name + "\" /><level name=\"label\" value=\"" + tsk_title + "\" /></value></values>"
			var valuesNode = facilis.parsers.ParseInUtils.getParsedNode(values);
			var chooser = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "nameChooser");
			chooser.getAttribute("value") = TaskNode.getAttribute("TskName");
			if (chooser) {
                chooser.setAttribute("value", TaskNode.getAttribute("TskName"));
                var oldValues=facilis.parsers.ParseInUtils.getSubNode(chooser, "values");
                if (oldValues) {
                    oldValues.removeNode();
                }
                chooser.appendChild(valuesNode);
            }
        }
    }

    element.getApiaHighlightComments=function () {
        if (TaskNode && this.parsedModel.highlightcomments!=null) {
             this.parsedModel.highlightcomments= TaskNode.getAttribute("highlight_comments");
        }
    }

    element.getTaskSchedule=function () {
        //var TASK_SCHEDULER = this.getToParseSubNode("TASK_SCHEDULER");
        var TASK_SCHEDULER = TaskNode;
        if (this.parsedModel.scheduledTask!=null && TASK_SCHEDULER) {
            this.parsedModel.scheduledTask = {
				tsk_sch_id:TASK_SCHEDULER.getAttribute("TskSchId"),
				asgn_type:TASK_SCHEDULER.getAttribute("AsignType"),
				active_tsk_id:TASK_SCHEDULER.getAttribute("ActiveTskId"),
				active_prc_id:TASK_SCHEDULER.getAttribute("ActivePrcId"),
				active_prc_name:TASK_SCHEDULER.getAttribute("ActivePrcName")
			}
			
        }
    }

    element.getSkipCondition=function () {
        if (TaskNode.getAttribute("SkipTskCond") && this.parsedModel.skipcondition!=null) {
			this.parsedModel.skipcondition=skipCondition;
        }
    }

    element.getProEleId=function () {
        if (this.parsedModel.proeleid!=null) {
            if(this.toParseNode.getAttribute("ProEleId")) {
                this.parsedModel.proeleid= this.toParseNode.getAttribute("ProEleId");
            }else {
                this.parsedModel.proeleid= this.toParseNode.getAttribute("Id");
            }
        }
    }
    
    facilis.parsers.input.Task = facilis.promote(Task, "ActivityElement");
    
}());


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



(function() {

    function Transition() {
        this.Line_constructor();
        
        this.parseFunctions.push(this.parseCondition);
        this.parseFunctions.push(this.parseType);
        this.parseFunctions.push(this.parseExecutionOrder);
    }
    
    var element = facilis.extend(Transition, facilis.parsers.input.Line);

    element.parseCondition=function() {
        var Condition = this.getToParseSubNode("Condition");
        if (Condition && Condition.getAttribute("Type") && this.parsedModel.conditiontype!=null) {
            this.parsedModel.conditiontype=Condition.getAttribute("Type");
        }
		var Expression = facilis.parsers.ParseInUtils.getSubNode(Condition, "Expression");
        if (Expression && Expression.firstElementChild && this.parsedModel.conditionexpression!=null) {
            this.parsedModel.conditionexpression = Expression.firstElementChild.toString();
        }

        var ConditionDoc = this.toParseNode.getAttribute("ConditionDoc");
        if (!ConditionDoc) {
            var obj = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "Object");
            if (!obj) {
                obj = this.toParseNode;
            }
            for (var i = 0; i < obj.children.length; i++ ) {
                if (obj.children[i].localName=="Documentation" && obj.children[i].firstElementChild) {
                    ConditionDoc = obj.children[i].firstElementChild.nodeValue;
                    break;
                }
            }
        }
        if (ConditionDoc && this.parsedModel.conditiondocumentation!=null) {
            this.parsedModel.conditiondocumentation = ConditionDoc;
        }


    }

    element.parseType=function() {
        if (this.parsedModel.apiatype!=null) {
            /*if(.getAttribute("LoopBack")=="true"){
                type.getAttribute("value") = "Loopback";
            }
            if (.getAttribute("TakeNext") == "true") {
                type.getAttribute("value") = "Wizard";
            }*/
            if(this.toParseNode.getAttribute("Type")=="L"){
                this.parsedModel.apiatype="Loopback";
            }else if (this.toParseNode.getAttribute("Type") == "W") {
                this.parsedModel.apiatype="Wizard";
            }else if (this.toParseNode.getAttribute("Type") == "N") {
                this.parsedModel.apiatype="None";
            }
        }
    }

    element.parseExecutionOrder=function() {
        if (this.parsedModel.executionorder!=null && this.toParseNode.getAttribute("ExecutionOrder")) {
            this.parsedModel.executionorder = this.toParseNode.getAttribute("ExecutionOrder");

        }
    }
    
    facilis.parsers.input.Transition = facilis.promote(Transition, "Line");
    
}());


