/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output {
	import flash.text.TextField;
	import flash.xml.XMLDocument;
	import flash.xml.XMLNode;
	import parsers.AbstractParser;
	import parsers.output.elements.ElementParser;
	import utils.LibraryManager;
	import view.View;
	import parsers.output.elements.WorkflowProcess;

	public class ParserOut extends AbstractParser{
		
		private var xmlOut:XMLNode;
		private var poolsXML:XMLNode;
		private static var processes:XMLNode;
		private var artifactsXML:XMLNode;
		private var associationsXML:XMLNode;
		private var messageFlowsXML:XMLNode;
		private static var participantsXML:XMLNode;
		private var WorkflowProcesses:XMLNode;
		
		private var workflowProcessName = "";
		private var workflowProcessObj:XMLNode = null;
		private var mainPoolId = null;
		
		private var mainWF:XMLNode;
		private var activitiesWF:XMLNode;
		private static var activitySetsXML:XMLNode;
		
		private var boundaryWorkflowProcessID:int;
		private var boundaryWorkflowProcess:WorkflowProcess;
		
		private var datastoresXML:XMLNode;
		
		public function ParserOut() {
		}
		
		override public function parse(xml:XMLNode):XMLNode {
			xmlOut = new XMLNode(1, ((View.getInstance().offline?"xpdl:":"") + "Package"));
			
			if (View.getInstance().offline) {
				var PackageHeader:XMLNode = new XMLNode(1, ElementParser.xpdl+"PackageHeader");
				var XPDLVersion:XMLNode = new XMLNode(1, ElementParser.xpdl + "XPDLVersion");
				var Vendor:XMLNode = new XMLNode(1, ElementParser.xpdl + "Vendor");
				var Created:XMLNode = new XMLNode(1, ElementParser.xpdl + "Created");
				PackageHeader.appendChild(XPDLVersion);
				PackageHeader.appendChild(Vendor);
				PackageHeader.appendChild(Created);
				XPDLVersion.appendChild(new XMLNode(3, "2.1"));
				Vendor.appendChild(new XMLNode(3, "STATUM"));
				var d:Date = new Date();
				var date:String = (d.getDate()) + "";
				var month:String = (d.getMonth() + 1) + "";
				var seconds:String = (d.getSeconds() + 1) + "";
				var minutes:String = (d.getMinutes() + 1) + "";
				var hours:String = (d.getHours()) + "";
				date = ((date.length == 1)?"0":"") + date;
				month = ((month.length == 1)?"0":"") + month;
				seconds = ((seconds.length == 1)?"0":"") + seconds;
				minutes = ((minutes.length == 1)?"0":"") + minutes;
				hours = ((hours.length == 1)?"0":"") + hours;
				Created.appendChild(new XMLNode(3, (d.getFullYear() + "/" + month + "/" + date) + " " + hours + ":" + minutes + ":" + seconds ));
				xmlOut.appendChild(PackageHeader);
			}
			
			xmlOut.attributes.Id = View.getInstance().getUniqueId();
			xmlOut.attributes["xmlns:xpdl"] = "http://www.wfmc.org/2008/XPDL2.1";
			if(!View.getInstance().offline){
				xmlOut.attributes["xmlns"] = "http://www.statum.biz/2009/APIA.XPDL2.1";
				//xmlOut.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				ElementParser.offline = "";
			}else {
				ElementParser.apia = "";
				//ElementParser.xpdl = "";
			}
			
			//xmlOut = new XMLNode(1, "ApiaElements");
			parseBack(xml);
			ParserOut.participantsXML = new XMLNode(1, ElementParser.offline+"Participants");
			poolsXML = new XMLNode(1, ElementParser.xpdl + "Pools");
			artifactsXML = new XMLNode(1, (ElementParser.offline + "Artifacts"));
			if(View.getInstance().offline){
				associationsXML = new XMLNode(1, (ElementParser.offline + "Associations"));
			}else {
				associationsXML = new XMLNode(1, (ElementParser.xpdl + "Associations"));
			}
			messageFlowsXML = new XMLNode(1, "MessageFlows");
			xmlOut.appendChild(ParserOut.participantsXML);
			xmlOut.appendChild(poolsXML);
			xmlOut.appendChild(associationsXML);
			xmlOut.appendChild(artifactsXML);
			xmlOut.appendChild(messageFlowsXML);

			datastoresXML = new XMLNode(1, ElementParser.offline+"DataStores");
			xmlOut.appendChild(datastoresXML);
			
			getPools(xml);
			getProcesses(xml);
			mainPoolId = null;
			if (poolsXML.childNodes.length == 0) {
				poolsXML.removeNode();
			}else {
				for (var i:Number = 0; i < poolsXML.childNodes.length; i++ ) {
					if (poolsXML.childNodes[i].attributes.MainPool == "true") {
						delete((poolsXML.childNodes[i].attributes as Object).Name);
						mainPoolId = poolsXML.childNodes[i].attributes.Process;
					}
				}
			}
			if (associationsXML.childNodes.length == 0) {
				associationsXML.removeNode();
			}
			if (artifactsXML.childNodes.length == 0) {
				artifactsXML.removeNode();
			}
			if (messageFlowsXML.childNodes.length == 0) {
				messageFlowsXML.removeNode();
			}
			if (ParserOut.participantsXML.childNodes.length == 0) {
				ParserOut.participantsXML.removeNode();
			}
			if (artifactsXML.childNodes.length == 0) {
				artifactsXML.removeNode();
			}
			activitiesWF = null;
			mainWF = null;
			var wf:XMLNode = null;
			var o:Number;
			if (WorkflowProcesses.childNodes.length > 0) {
				var activitiesFound = false;
				for (var w = 0; w < WorkflowProcesses.childNodes.length; w++ ) {
					wf = WorkflowProcesses.childNodes[w];
					var obj:XMLNode = null;
					o = 0;
					for (o = 0; o<wf.childNodes.length; o++ ) {
						if (wf.childNodes[o].localName == "Activities") {
							activitiesFound = true;
							activitiesWF = wf;
						}
						if (wf.childNodes[o].localName=="Object") {
							obj = wf.childNodes[o];
						}
					}
					//if (activitiesFound) {
						if (obj && wf.attributes.Id == mainPoolId && WorkflowProcesses.childNodes.length>1) {
							mainWF = wf;
							workflowProcessObj = obj.cloneNode(true);
							obj.removeNode();
						}
						/*if (w != 0) {
							var wfAux:XMLNode= wf.cloneNode(true);
							wf.removeNode();
							WorkflowProcesses.insertBefore(wfAux, WorkflowProcesses.firstChild);
						}*/
						//break;
					//}
				}
				if(activitiesWF){
					if (workflowProcessName) {
						//WorkflowProcesses.childNodes[0].attributes.Name = workflowProcessName;
						activitiesWF.attributes.Name = workflowProcessName;
					}
					if(workflowProcessObj){
						//WorkflowProcesses.childNodes[0].appendChild(workflowProcessObj);
						for (var k = 0; k<activitiesWF.childNodes.length; k++ ) {
							if (activitiesWF.childNodes[k].localName=="Object") {
								activitiesWF.childNodes[k].removeNode();
								break;
							}
						}
						activitiesWF.appendChild(workflowProcessObj);
					}
				}
				w = 0;
				wf = null;
				for (w = 0; w < WorkflowProcesses.childNodes.length; w++ ) {
					wf = WorkflowProcesses.childNodes[w];
					o = 0;
					activitiesFound = false;
					for (o = 0; o < wf.childNodes.length; o++ ) {
						if (wf.childNodes[o].localName == "Activities") {
							activitiesFound = true;
							break;
						}
					}
					if (activitiesFound) {
						if (w != 0) {
							var wfAux:XMLNode= wf.cloneNode(true);
							wf.removeNode();
							WorkflowProcesses.insertBefore(wfAux, WorkflowProcesses.firstChild);
						}
						break;
					}
				}
				mainWF = WorkflowProcesses.firstChild;
				if (mainWF && processAction && processAction != "") {
					mainWF.attributes[ElementParser.apia + "ProAction"] = processAction;
					mainWF.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				}
			}
			return xmlOut;
		}
		
		private function getPools(xml:XMLNode) {
			poolsXML.appendChild(getElementParser(xml.attributes.name).parse(xml));
			var subElements = ParseOutUtils.getSubNode(xml, "subElements");
			for (var i:Number = 0; i < subElements.childNodes.length; i++ ) {
				var name = subElements.childNodes[i].attributes.name;
				if (name == "pool") {
					subElements.childNodes[i].attributes.process = View.getInstance().getUniqueId();
					var elParser:ElementParser = getElementParser(name);
					//poolsXML.appendChild(elParser.parse(subElements.childNodes[i]));
					var pool:XMLNode = elParser.parse(subElements.childNodes[i]);
					poolsXML.appendChild(pool);
					if(pool.attributes.BoundaryVisible) {
						boundaryWorkflowProcessID = pool.attributes.Process;
					}
				}
			}
		}
		
		private function getProcesses(xml:XMLNode) {
			processes = new XMLNode(1, (ElementParser.offline + "WorkflowProcesses"));
			var subElements = ParseOutUtils.getSubNode(xml, "subElements");
			var proEvents:XMLNode;
			for (var i:Number = 0; i < subElements.childNodes.length; i++ ) {
				var name = subElements.childNodes[i].attributes.name;
				if (name == "pool" /* && subElements.childNodes[i].attributes.mainpool=="true" */) {
					//Modificamos getProcess para que deje en WorkflowProcess.apiaEvents:XMLNode los eventos
					//var process:XMLNode = getProcess(subElements.childNodes[i]);					
					var process:XMLNode = getProcessWithoutEvents(subElements.childNodes[i]);
					processes.appendChild(process);
				}
			}
			WorkflowProcesses = processes;
			//processes.appendChild(getProcess(xml));
			processes.appendChild(getProcessWithoutEvents(xml));
			xmlOut.appendChild(processes);
						
			if(boundaryWorkflowProcess != null) {
				boundaryWorkflowProcess.addWFEvents();
			}
		}
		
		private function getProcess(xml:XMLNode):XMLNode {
			var p:WorkflowProcess = new WorkflowProcess();
			var poolXML:XMLNode = p.parse(xml);
			//var poolXML:XMLNode = new XMLNode(1, "WorkflowProcess");
			poolXML.attributes.Id = xml.attributes.process;
			/*if(xml.attributes.mainpool=="true"){
				var Name = ParseOutUtils.getSubNodeValue(xml, "name");
				if(Name && Name!=""){
					//poolXML.attributes.Name = Name;
				}
			}*/
			if (xml.attributes.mainpool == "true" && workflowProcessName && workflowProcessName!="") {
				//poolXML.attributes.Name = workflowProcessName;
			}
			var subElements:XMLNode = ParseOutUtils.getSubNode(xml, "subElements");
			parseProcessElements(subElements, poolXML);
			p.setMainWFObject();
			p.addWFEvents();
			return poolXML;
		}
		
		private function getProcessWithoutEvents(xml:XMLNode):XMLNode {
			var p:WorkflowProcess = new WorkflowProcess();
			var poolXML:XMLNode = p.parse(xml);
			//var poolXML:XMLNode = new XMLNode(1, "WorkflowProcess");
			poolXML.attributes.Id = xml.attributes.process;
			/*if(xml.attributes.mainpool=="true"){
			var Name = ParseOutUtils.getSubNodeValue(xml, "name");
			if(Name && Name!=""){
			//poolXML.attributes.Name = Name;
			}
			}*/
			if (xml.attributes.mainpool == "true" && workflowProcessName && workflowProcessName != "") {
				//Se descomenta porque no se guarda el nombre del proceso
				poolXML.attributes.Name = workflowProcessName;
			}
			var subElements:XMLNode = ParseOutUtils.getSubNode(xml, "subElements");
			parseProcessElements(subElements, poolXML);
			p.setMainWFObject();
			//p.addWFEvents();
			
			if(poolXML.attributes.Id == boundaryWorkflowProcessID || boundaryWorkflowProcess == null) {
				boundaryWorkflowProcess = p;
			}
			
			return poolXML;
		}
		
		
		public static function addWorkFlowProcess(id, name) {
			var WorkFlowProcess:XMLNode = new XMLNode(1, (ElementParser.offline + "WorkflowProcess"));
			var ProcessHeader:XMLNode = new XMLNode(1, ElementParser.xpdl+"ProcessHeader");
			WorkFlowProcess.appendChild(ProcessHeader);
			WorkFlowProcess.attributes.Id = id;
			if(name){
				WorkFlowProcess.attributes.Name = name;
			}
			for (var i = 0; i < processes.childNodes.length; i++ ) {
				if (processes.childNodes[i].attributes.Id == id) {
					return;
				}
			}
			processes.appendChild(WorkFlowProcess);
		}
		
		public function parseProcessElements(subElements:XMLNode,el:XMLNode) {
			parseWorkFlowElements(subElements,el);
			var transitions:XMLNode = getTransitions(subElements);
			if(transitions.childNodes.length>0){
				el.appendChild(transitions);
			}
			setTransitionRestrictions(el);
		}
		
		private function parseWorkFlowElements(xml:XMLNode, workflowEl:XMLNode) {
			var datainputoutputsXML:XMLNode = new XMLNode(1, (ElementParser.offline + "DataInputOutputs"));
			var datastorereferencesXML:XMLNode = new XMLNode(1, (ElementParser.offline + "DataStoreReferences"));
			
			var activitiesXML:XMLNode = new XMLNode(1, (ElementParser.offline+"Activities"));
			activitySetsXML= new XMLNode(1, (ElementParser.offline + "ActivitySets"));
			if(xml){
				for (var i:Number = 0; i < xml.childNodes.length; i++ ) {
					var name = xml.childNodes[i].attributes.name;
					var p:ElementParser ;
					if (name == "task" || name == "csubflow" || name == "esubflow" || name == "startevent"
					|| name == "middleevent" ||	name == "endevent" || name == "gateway" ) {
						p = getElementParser(name);
						var activity:XMLNode = p.parse(xml.childNodes[i]);
						activitiesXML.appendChild(activity);
						/*if (name == "csubflow" || name == "esubflow") {
							var ActivitySetId = null;
							for (var e = 0; e < activity.childNodes.length; e++ ) {
								if (activity.childNodes[e].localName == "BlockActivity") {
									ActivitySetId = activity.childNodes[e].attributes.ActivitySetId;
								}
							}
							if(ActivitySetId){
								p = getElementParser("activityset");
								var activitySet:XMLNode = p.parse(xml.childNodes[i]);
								activitySet.attributes.Id = ActivitySetId;
								var exists = false;
								for (var n = 0; n < activitySetsXML.childNodes.length; n++ ) {
									if (activitySetsXML.childNodes[n].attributes.Name==activitySet.attributes.Name) {
										
									}
								}
								if (!exists) {
									activitySetsXML.appendChild(activitySet);
								}
							}
						}*/
					}
					if (name == "csubflow" || name == "task") {
						var subElements:XMLNode = ParseOutUtils.getSubNode(xml.childNodes[i], "subElements");
						if(subElements){
							for (var u = 0; u < subElements.childNodes.length;u++ ) {
								var subName = subElements.childNodes[u].attributes.name;
								if (subName == "middleevent") {
									var node:XMLNode = subElements.childNodes[u];
									node.attributes.target = xml.childNodes[i].attributes.id;
									node.attributes.isattached = "true";
									p = getElementParser(subName);
									var evt:XMLNode = p.parse(node);
									activitiesXML.appendChild(evt);
								}
							}
						}
					}
					if (name == "group" || name == "textannotation" || name=="dataobject") {
						p = getElementParser(name);
						var artifact:XMLNode = p.parse(xml.childNodes[i]);
						/*if ( name == "dataobject") {
							//Si es datainput o dataoutput, colocarlo en datainputoutputsXML
							if (artifact.localName.indexOf("DataInput") >= 0  || artifact.localName.indexOf("DataOutput") >= 0 )
								datainputoutputsXML.appendChild(artifact);
							else
								artifactsXML.appendChild(artifact);
						} else {
							artifactsXML.appendChild(artifact);
						}*/
						artifactsXML.appendChild(artifact);
					}
					if (name == "datainput" || name == "dataoutput") {
						p = getElementParser(name);
						var data_artifact:XMLNode = p.parse(xml.childNodes[i]);
						datainputoutputsXML.appendChild(data_artifact);
					}
					if (name == "datastore") {
						p = getElementParser(name);
						var datastore:XMLNode = p.parse(xml.childNodes[i]);
						
						//Crear la referencia
						var datastorereference = new XMLNode(1, ElementParser.offline + "DataStoreReference");
						datastorereference.attributes.Id = datastore.attributes.Id;
						datastore.attributes.Id = View.getInstance().getUniqueId();
						datastorereference.attributes.DataStoreRef = datastore.attributes.Id;
						//Movemos el NodeGraphicsInfos
						for (var j:int = 0; j < datastore.childNodes.length; j++ ) {
							if(datastore.childNodes[j].localName == "NodeGraphicsInfos") {
								datastorereference.appendChild(datastore.childNodes[j]);
								break;
							}
						}
						var state = ParseOutUtils.getSubNodeValue(xml.childNodes[i], "state");
						if (state != null)
							datastorereference.attributes.State = state;
							
						datastoresXML.appendChild(datastore);
						datastorereferencesXML.appendChild(datastorereference);
					}
				}
			}
			if(activitySetsXML.childNodes.length>0){
				workflowEl.appendChild(activitySetsXML);
			}
			if(activitiesXML.childNodes.length>0){
				workflowEl.appendChild(activitiesXML);
			}
			if (datainputoutputsXML.childNodes.length > 0) {
				workflowEl.appendChild(datainputoutputsXML);
			}
			if (datastorereferencesXML.childNodes.length > 0) {
				workflowEl.appendChild(datastorereferencesXML);
			}
		}
		
		public static function getActivitySet(activitySet:XMLNode) {
			for (var i = 0; i < activitySetsXML.childNodes.length; i++ ) {
				if (activitySetsXML.childNodes[i].attributes.Name==activitySet.attributes.Name) {
					return activitySetsXML.childNodes[i];
				}
			}
			activitySetsXML.appendChild(activitySet);
			return activitySet;
		}
		
		
		private function getTransitions(xml:XMLNode):XMLNode {
			var transitionsXML:XMLNode = new XMLNode(1, (ElementParser.offline+"Transitions"));
			if(xml){
				for (var i:Number = 0; i < xml.childNodes.length; i++ ) {
					var name = xml.childNodes[i].attributes.name;
					var p:ElementParser;
					if(name == "sflow" ) {
						p = getElementParser(name);
						var activity:XMLNode = p.parse(xml.childNodes[i]);
						transitionsXML.appendChild(activity);
					}
					if (name == "mflow") {
						p = getElementParser(name);
						var message:XMLNode = p.parse(xml.childNodes[i]);
						messageFlowsXML.appendChild(message);
					}
					if (name == "association" ) {
						p = getElementParser(name);
						var association:XMLNode = p.parse(xml.childNodes[i]);
						associationsXML.appendChild(association);
					}
				}
				if (associationsXML.childNodes.length == 0) {
					//associationsXML.removeNode();
				}
				if (messageFlowsXML.childNodes.length == 0) {
					messageFlowsXML.removeNode();
				}
			}
			return transitionsXML;
		}
		
		public static function getElementParser(type:String):ElementParser {
			var className = "";
			var outPackage = "parsers.output.elements."
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
				className = "DataObject";
				break;
				case "datainput":
				case "dataoutput":
				className = "Artifact";
				break;
				case "datastore":
				className = "DataStore";
				break;
				case "back":
				className = "TaskService";
				break;
				case "association":
				className = "Association";
				break;
				case "mflow":
				className = "MessageFlow";
				break;
				case "sflow":
				className = "Transition";
				break;
				case "activityset":
				className = "ActivitySet";
				break;
			}
			
			return (LibraryManager.getInstance().getInstancedObject(outPackage+className) as ElementParser);
			
			
		}
		
		private var processAction = "";
		
		
		function parseBack(back:XMLNode) {
			var bpd:XMLNode = ParseOutUtils.getSubNode(back, "bpd");
			processAction = ParseOutUtils.getSubNodeValue(back, "protype");
			var BPMN:XMLNode = back.firstChild;
			if(!BPMN){
				BPMN = ParseOutUtils.getSubNode(back, "BPMN");
			}
			workflowProcessName = ParseOutUtils.getSubNodeValue(BPMN, "name");
			if(bpd){
				var id = ParseOutUtils.getSubNodeValue(bpd, "id");
				var name = ParseOutUtils.getSubNodeValue(bpd, "name");
				var version = ParseOutUtils.getSubNodeValue(bpd, "version");
				var author = ParseOutUtils.getSubNodeValue(bpd, "author");
				var language = ParseOutUtils.getSubNodeValue(bpd, "language");
				var querylanguage = ParseOutUtils.getSubNodeValue(bpd, "querylanguage");
				var creationdate = ParseOutUtils.getSubNodeValue(bpd, "creationdate");
				var modificationdate = ParseOutUtils.getSubNodeValue(bpd, "modificationdate");
				var documentation = ParseOutUtils.getSubNodeValue(bpd, "documentation");
				if(id){
					xmlOut.attributes.Id = id;
				}
				if (name) {
					xmlOut.attributes.Name = name;
				}
				if(language){
					xmlOut.attributes.Language = language;
				}
				var RedefinableHeader:XMLNode;
				if (version) {
					RedefinableHeader = new XMLNode(1, ElementParser.xpdl+"RedefinableHeader");
					RedefinableHeader.attributes.Version = version;
				}
				if (author) {
					if(!RedefinableHeader){
						RedefinableHeader = new XMLNode(1, ElementParser.xpdl+"RedefinableHeader");
					}
					RedefinableHeader.attributes.Author = author;
				}
				if(RedefinableHeader){
					xmlOut.appendChild(RedefinableHeader);
				}
				var PackageHeader:XMLNode;
				if (creationdate) {
					PackageHeader = new XMLNode(1, ElementParser.xpdl+"PackageHeader");
					var Created:XMLNode = new XMLNode(1, "Created");
					Created.attributes.CreationDate = creationdate;
					PackageHeader.appendChild(Created);
				}
				if (modificationdate) {
					if (!PackageHeader) {
						PackageHeader = new XMLNode(1, ElementParser.xpdl+"PackageHeader");
					}
					var ModificationDate:XMLNode = new XMLNode(1, ElementParser.xpdl+"ModificationDate");
					ModificationDate.attributes.Date = modificationdate;
					PackageHeader.appendChild(ModificationDate);
				}
				if(PackageHeader){
					xmlOut.appendChild(PackageHeader);
				}
			}
			var process:XMLNode = ParseOutUtils.getSubNode(back, "process");
			if (process) {
				//var name = ParseOutUtils.getSubNodeValue(process, "name");
				var processtype = ParseOutUtils.getSubNodeValue(process, "processtype");
				//var performers:XMLNode = ParseOutUtils.getSubNode(process, "performers");
				var properties:XMLNode = ParseOutUtils.getSubNode(process, "properties");
				if (processtype) {
					xmlOut.attributes.ProcessType = processtype;
				}
				/*if (performers) {
					var Performers = getPerformers(ParseOutUtils.getSubNode(performers,"values"));
					if (Performers) {
						xmlOut.appendChild(Performers);
					}
				}*/
				if (properties) {
					var Properties = null;
					for (var i:Number = 0; i < properties.childNodes.length;i++ ) {
						if (properties.childNodes[i].nodeName=="values") {
							Properties = getProperties(properties.childNodes[i]);
						}
					}
					if (Properties) {
						xmlOut.appendChild(Properties);
					}
				}
			}
		}
		
		
		private function getPerformers(performers:XMLNode):XMLNode {
			if (performers && performers.childNodes.length > 0) {
				var Performers:XMLNode = new XMLNode(1, ElementParser.offline + "Performers");
				for (var i:Number = 0; i < performers.childNodes.length; i++ ) {
					var Performer:XMLNode = new XMLNode(1, ElementParser.offline + "Performer");
					if(!View.getInstance().offline){
						Performer.attributes.PerfId = (ParseOutUtils.getSubNodeValue(performers.childNodes[i], "id") as String).toUpperCase();
						Performer.attributes.PerfName = (ParseOutUtils.getSubNodeValue(performers.childNodes[i], "name") as String).toUpperCase();
					}else {
						Performer.appendChild(new XMLNode(3, ParseOutUtils.getSubNodeValue(performers.childNodes[i], "name")));
					}
					//Performer.attributes.ProElePerfEvalCond = ParseOutUtils.getSubNodeValue(performers.childNodes[i], "condition");
					var condValues = ParseOutUtils.getSubNode((ParseOutUtils.getSubNode(performers.childNodes[i], "condition")),"values");
					if (condValues && condValues.firstChild) {
						var condValue:String = condValues.firstChild.firstChild;
						Performer.attributes.ProElePerfEvalCond = condValue;
					}
					Performers.appendChild(Performer);
				}
				return Performers;
			}
			return null;
		}
		
		private function getProperties(properties:XMLNode):XMLNode {
			if (properties && properties.childNodes.length > 0) {
				var Properties:XMLNode = new XMLNode(1, "Properties");
				properties = ParseOutUtils.getSubNode(properties,"values");
				if(properties.childNodes.length>0){
					for (var i:Number = 0; i < properties.childNodes.length; i++ ) {
						var Property:XMLNode = new XMLNode(1, "Property");
						var nodes:XMLNode = ParseOutUtils.getSubNode(properties.childNodes[i], "values");
						Property.attributes.PropertyId = ParseOutUtils.getSubNodeValue(nodes,"id");
						Property.attributes.Name = ParseOutUtils.getSubNodeValue(nodes,"name");
						Property.attributes.Type = ParseOutUtils.getSubNodeValue(nodes,"type");
						Property.attributes.Value = ParseOutUtils.getSubNodeValue(nodes, "value");
						Property.attributes.PropertyType = ParseOutUtils.getSubNodeValue(nodes,"propertytype");
						Property.attributes.Correlation = ParseOutUtils.getSubNodeValue(nodes,"correlation");
						Properties.appendChild(Property);
					}
					return Properties;
				}
			}
			return null;
		}
		
		public static function addParticipant(id, name) {
			var Participant:XMLNode = new XMLNode(1, ElementParser.offline + "Participant");
			for (var i:Number = 0; i < ParserOut.participantsXML.childNodes.length; i++ ) {
				if ( ( ( (ParserOut.participantsXML.childNodes[i].attributes.Id + "") == (id + "") )
				|| ( (ParserOut.participantsXML.childNodes[i].attributes.Name + "") == (name + "")  )  ) ||
				( ( (ParserOut.participantsXML.childNodes[i].attributes.Id + "") == (name + "") )
				|| ( (ParserOut.participantsXML.childNodes[i].attributes.Name + "") == (id + "")  )  ) ){
					return ParserOut.participantsXML.childNodes[i];
				}
			}
			if ((id+"")=="null" || (id + "") == "undefined") {
				id = name;
				name = null;
			}
			if (name) {
				//Participant.attributes.Name = name.toUpperCase() + "";
				Participant.attributes.Name = name + "";
			}else if (View.getInstance().offline) {
				if (id && (id + "") != "undefined") {
					Participant.attributes.Name = id + "";
				}
			}
			if (id && (id + "") != "undefined") {
				//Participant.attributes.Id = id.toUpperCase() + "";
				Participant.attributes.Id = id.split(" ").join("_");
			}
			var ParticipantType:XMLNode = new XMLNode(1, ElementParser.xpdl+"ParticipantType");
			ParticipantType.attributes.Type = "ROLE";
			Participant.appendChild(ParticipantType);
			participantsXML.appendChild(Participant);
			return Participant;
		}
		
		private function setTransitionRestrictions(el:XMLNode) {
			
			var Transitions:XMLNode;
			var Activities:XMLNode;
			for (var i:Number = 0; i < el.childNodes.length; i++ ) {
				if (el.childNodes[i].localName=="Transitions") {
					Transitions = el.childNodes[i];
				}
				if (el.childNodes[i].localName=="Activities") {
					Activities = el.childNodes[i];
				}
			}
			if (Transitions && Activities) {
				i = 0;
				for (i = 0; i < Activities.childNodes.length; i++ ) {
					var Id = Activities.childNodes[i].attributes.Id;
					var transitions:Array = new Array();
					for (var t = 0; t < Transitions.childNodes.length; t++ ) {
						if (Transitions.childNodes[t].attributes.From == Id) {
							var order = getTransitionOrder(Transitions.childNodes[t]);
							var hasCond = hasCondition(Transitions.childNodes[t]);
							transitions.push( { order:order, transition:Transitions.childNodes[t].attributes.Id ,condition:hasCond} );
						}
					}
					setElementTransRestrictions(Activities.childNodes[i], transitions);
				}
			}
			
		}
		
		private function setElementTransRestrictions(el:XMLNode, transitions:Array) {
			if (transitions.length > 1) {
				var TransitionRestrictions:XMLNode = new XMLNode(1, ElementParser.xpdl+"TransitionRestrictions");
				var TransitionRestriction:XMLNode = new XMLNode(1, ElementParser.xpdl + "TransitionRestriction");
				var Split:XMLNode = new XMLNode(1, ElementParser.xpdl + "Split");
				var TransitionRefs:XMLNode = new XMLNode(1, ElementParser.xpdl + "TransitionRefs");
				Split.appendChild(TransitionRefs);
				TransitionRestriction.appendChild(Split);
				TransitionRestrictions.appendChild(TransitionRestriction);
				transitions.sortOn("order", Array.NUMERIC);
				var splitType="Parallel";
				for (var i:Number = 0; i < transitions.length; i++ ) {
					var TransitionRef:XMLNode = new XMLNode(1, ElementParser.xpdl + "TransitionRef");
					TransitionRef.attributes.Id = transitions[i].transition;
					TransitionRefs.appendChild(TransitionRef);
					if (transitions[i].condition) {
						splitType = "Inclusive";
					}
				}
				i = 0;
				var before:XMLNode = el.firstChild;
				for (i = 0; i < el.childNodes.length; i++ ) {
					if (el.childNodes[i].localName=="Route" || el.childNodes[i].localName=="Implementation") {
						before = el.childNodes[i];
					}
				}
				if (before.nextSibling && before.nextSibling.nodeName.indexOf("Performer") >= 0) {
					before = before.nextSibling;
				}
				if (before.nextSibling) {
					el.insertBefore(TransitionRestrictions, before.nextSibling);
				}else {
					el.appendChild(TransitionRestrictions);
				}
				Split.attributes.Type = splitType;
				i = 0;
				for (i = 0; i < el.childNodes.length; i++ ) {
					if (el.childNodes[i].localName == "Route" ) {
						var GatewayType = el.childNodes[i].attributes.GatewayType;
						splitType = GatewayType;
					}
				}
				Split.attributes.Type = splitType;
			}
		}
		
		private function getTransitionOrder(trans:XMLNode):Number {
			var order:Number;
			if (trans.attributes["apia:ExecutionOrder"]) {
				order = Number(trans.attributes["apia:ExecutionOrder"]);
			}
			return order;
		}
		
		private function hasCondition(trans:XMLNode):Boolean {
			var order:Number;
			for (var i:Number = 0; i < trans.childNodes.length; i++ ) {
				if (trans.childNodes[i].localName == "Condition") {
					return true;
				}
			}
			return false;
		}
		
	}
	
}
