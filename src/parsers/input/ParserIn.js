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