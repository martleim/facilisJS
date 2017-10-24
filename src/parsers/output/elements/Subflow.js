/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import parsers.output.ParserOut;
	import view.View;
	
	public class Subflow extends ActivityElement{
		
		private var subflowel:XMLNode;
		
		public function Subflow() {
			addParseFunction(setAttached);
			addParseFunction(getImplementation);
			addParseFunction(getTransaction);
			addParseFunction(getIsExpanded);
			addParseFunction(getEndPoint);
			addParseFunction(getProEleDesignXML);
			addParseFunction(getExecution);
			addParseFunction(getDataMappings);
			addParseFunction(getProcessRef);
			addParseFunction(getSkipFirstTask);
			super();
			addParseFunction(getFormsRef);
			addParseFunction(getEntity);
			addParseFunction(getBlockActivity);
		}
		
		function getImplementation() {
			var implementationNode:XMLNode = new XMLNode(1, (ElementParser.offline+"Implementation"));
			subflowel = new XMLNode(1, (ElementParser.offline + "SubFlow"));

			implementationNode.appendChild(subflowel);
			parsedNode.appendChild(implementationNode);
			var name = getToParseSubNodeValue("name");
			if (name) {
				subflowel.attributes.Name = name;
			}
			var filename:String = getToParseSubNodeValue("filename");
			if (filename && filename!="") {
				subflowel.attributes.Name = filename;
			}
			subflowel.attributes.Id = View.getInstance().getUniqueId();
			if (toParseNode.attributes.name == "csubflow") {
				subflowel.attributes.View == "COLLAPSED";
			}
		}
		
		function getTransaction() {
			var transaction = getToParseSubNodeValue("transaction");
			if (transaction && transaction!="false") {
				parsedNode.attributes.IsATransaction = transaction;
				var transactionid = getToParseSubNodeValue("transactionid");
				if(transactionid){
					var Transaction:XMLNode = new XMLNode(1, "Transaction");
					Transaction.attributes.Id = transactionid;
					parsedNode.appendChild(Transaction);
				}
			}
		}
		
		function getIsAdhoc() {
			var adhoc = getToParseSubNodeValue("adhoc");
			if (adhoc && adhoc!="false") {
				parsedNode.attributes.AdHoc = adhoc;
				var adhocordering = getToParseSubNodeValue("adhocordering")
				if(adhocordering){
					parsedNode.attributes.AdHocOrdering = adhocordering;
				}
			}
		}
		
		function getSubFlow() {
			var id = toParseNode.attributes.id;
			subflowel= new XMLNode(1, "SubFlow");
			//subflow.attributes.ActivitySetId = id;
			parsedNode.appendChild(subflowel);
		}
		
		function getIsExpanded() {
			var expanded = getToParseSubNodeValue("expanded");
			var type = toParseNode.attributes.name;
			if (expanded == "true" || type == "esubflow") {
				var node = ParseOutUtils.getSubNode(parsedNode, "NodeGraphicsInfo");
				node.attributes.Expanded = "true";
				node.attributes.ExpandedWidth = toParseNode.attributes.width;
				node.attributes.ExpandedHeight = toParseNode.attributes.height;
			}
		}
		
		function getEndPoint() {
			var endpoint = getToParseSubNodeValue("endpoint");
			if (endpoint) {
				var EndPoint:XMLNode = new XMLNode(1, "EndPoint");
				parsedNode.appendChild(EndPoint);
				
				var ExternalReference:XMLNode = new XMLNode(1, "ExternalReference");
				EndPoint.appendChild(ExternalReference);
				
				ExternalReference.attributes.Xref = ParseOutUtils.getSubNodeValue(endpoint, "xref");
				ExternalReference.attributes.Location = ParseOutUtils.getSubNodeValue(endpoint, "location");
				ExternalReference.attributes.Namespace = ParseOutUtils.getSubNodeValue(endpoint, "namespace");
				
				EndPoint.attributes.EndPointType = ParseOutUtils.getSubNodeValue(endpoint, "endpointtype");
			}
		}
		
		function getExecution() {
			var SubFlow:XMLNode = getParsedSubNode("SubFlow");
			var processtype = getToParseSubNodeValue("subprocesstype");
			var skipfirsttask= getToParseSubNodeValue("skipfirsttask");
			if (SubFlow) {
				var exec = "MAP";
				if (processtype == "Reusable") {
					exec = getToParseSubNodeValue("execution");
					if (!exec) {
						exec = "SYNCHR";
					}
				}
				if (skipfirsttask == "true") {
					exec = exec + "_SKIP";
				}
				if (!View.getInstance().offline){
					SubFlow.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				}
				if(!View.getInstance().offline){
					SubFlow.attributes[ElementParser.apia + "ApiaExecution"] = exec;
				}
			}
		}
		
		function getDataMappings() {
			var DataMappings:XMLNode = new XMLNode(1, "DataMappings");
			var datamappings:XMLNode = getToParseSubNode("datamappings");
			if(datamappings){
				var input:XMLNode= ParseOutUtils.getSubNode(datamappings, "inputmaps");
				var out:XMLNode = ParseOutUtils.getSubNode(datamappings, "outputmaps");
				if(input){
					input= getValues(input);
				}
				if(out){
					out = getValues(out);
				}
				var i:Number = 0;
				var DataMapping:XMLNode;
				if (input) {
					for (i = 0 ; i < input.childNodes.length; i++ ) {
						DataMapping = new XMLNode(1, "DataMapping");
						DataMapping.attributes.Direction = "IN";
						DataMapping.attributes.TestValue = ParseOutUtils.getSubNodeValue(input.childNodes[i],"inputmap");
						DataMappings.appendChild(DataMapping);
					}
				}
				if (out) {
					for (i = 0 ; i < out.childNodes.length; i++ ) {
						DataMapping = new XMLNode(1, "DataMapping");
						DataMapping.attributes.Direction = "OUT";
						DataMapping.attributes.TestValue = ParseOutUtils.getSubNodeValue(out.childNodes[i],"outputmap");
						DataMappings.appendChild(DataMapping);
					}
				}
				subflowel.appendChild(DataMappings);
			}
		}
		
		function getProcessRef() {
			//var processref:XMLNode = getToParseSubNode("processref");
			var processref:XMLNode = getToParseSubNode("name");
			var nameValue = processref.attributes.value;
			if (processref && !View.getInstance().offline) {
				var values:XMLNode = getValues(processref);
				if (values && values.firstChild) {
					values = values.firstChild;
					for (var i:Number = 0; i < values.childNodes.length; i++ ) {
						if (values.childNodes[i].attributes.name == "id") {
							subflowel.attributes.Id = values.childNodes[i].attributes.value;
						}
						if (values.childNodes[i].attributes.name == "name") {
							subflowel.attributes.Name = nameValue;
							parsedNode.attributes.Name = nameValue;
						}
					}
				}
			}
		}
		
		function getEntity() {
			var entity:XMLNode = getToParseSubNode("entity");
			if (entity) {
				var values:XMLNode = getValues(entity);
				if (values && values.firstChild) {
					values = values.firstChild;
					if (!View.getInstance().offline){
						subflowel.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
					}
					for (var i:Number = 0; i < values.childNodes.length; i++ ) {
						if (values.childNodes[i].attributes.name=="id") {
							subflowel.attributes[ElementParser.apia+"ProEleAttBusEntId"] = values.childNodes[i].attributes.value;
						}
						if (values.childNodes[i].attributes.name == "name") {
							subflowel.attributes[ElementParser.apia+"ProEleAttBusEntName"] = values.childNodes[i].attributes.value;
						}
					}
				}
			}
		}
		
		function getSkipFirstTask() {
			var skipfirsttask = getToParseSubNodeValue("skipfirsttask");
			if (skipfirsttask) {
				if (!View.getInstance().offline){
					subflowel.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
				}
				subflowel.attributes[ElementParser.apia+"SkipFirstTask"] = skipfirsttask;
			}
		}
		
		private function getFormsRef() {
			var processforms:XMLNode = getToParseSubNode("processforms");
			var entityforms:XMLNode = getToParseSubNode("entityforms");
			var FormsRef:XMLNode = new XMLNode(1, "FormsRef");
			var pValues:XMLNode = getValues(processforms);
			var eValues:XMLNode = getValues(entityforms);
			var FormRef:XMLNode;
			var pCount = 0;
			var eCount = 0;
			if(pValues){
				for (var i:Number = 0; i < pValues.childNodes.length; i++ ) {
					FormRef = null;
					FormRef = getFormRef(pValues.childNodes[i]);
					if (FormRef) {
						FormRef.attributes["FrmType"] = "P";
						FormRef.attributes.ProEleFrmOrder = pCount;
						FormsRef.appendChild(FormRef);
						pCount++;
					}
				}
			}
			if(eValues){
				for (var u = 0; u < eValues.childNodes.length; u++ ) {
					FormRef = null;
					FormRef = getFormRef(eValues.childNodes[u]);
					if (FormRef) {
						FormRef.attributes["FrmType"] = "E";
						FormRef.attributes.ProEleFrmOrder = eCount;
						FormsRef.appendChild(FormRef);
						eCount++;
					}
				}
			}
			if (FormsRef.childNodes.length > 0) {
				addApiaExtensions(subflowel);
				subflowel.appendChild(FormsRef);
			}
		}
		
		private function getFormRef(form:XMLNode) {
			var FormRef:XMLNode = new XMLNode(1, "FormRef");
			//FormRef.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
			for (var i:Number = 0; i<form.childNodes.length; i++) {
				var name = form.childNodes[i].attributes.name;
				if (name == "id") {
					FormRef.attributes["FrmId"] = form.childNodes[i].attributes.value;
				}else if (name == "name") {
					FormRef.attributes["FrmName"] = form.childNodes[i].attributes.value;
				}else if (name == "readonly") {
					FormRef.attributes["ProEleFrmReadOnly"] = (form.childNodes[i].attributes.value=="true").toString();
				}else if (name == "multiple") {
					FormRef.attributes["ProEleFrmMultiply"] = (form.childNodes[i].attributes.value=="true").toString();
				}else if (name == "condition") {
					var values = getValues(form.childNodes[i]);
					if (values && values.firstChild) {
						var value:String = values.firstChild.firstChild.nodeValue;
						if(value!=""){
							FormRef.attributes.ProEleFrmEvalCond = value;
						}
						//FormRef.appendChild(new XMLNode(3, value));
					}
				}else if (name == "documentation") {
					var docValues = getValues(form.childNodes[i]);
					if (docValues && docValues.firstChild) {
						var docValue:String = docValues.firstChild.firstChild;
						FormRef.attributes["ConditionDoc"] = docValue;
						//FormRef.appendChild(new XMLNode(3, docValue));
					}
				}
			}
			FormRef.attributes["ProEleFrmStepId"] = "1";
			return FormRef;
		}
		
		function setAttached() {
			var subElements:XMLNode = getToParseSubNode("subElements");
			if(subElements){
				for (var i:Number = 0; i < subElements.childNodes.length; i++ ) {
					if (subElements.childNodes[i] && subElements.childNodes[i].attributes.name=="middleevent") {
						subElements.childNodes[i].attributes.attached = toParseNode.attributes.id;
						var firsttask = ParseOutUtils.getSubNodeValue(toParseNode, "firsttask");
						if (firsttask == "true") {
							subElements.childNodes[i].attributes.firsttask = "true";
						}
					}
				}
			}
		}
		
		function getBlockActivity() {
			var processtype = getToParseSubNodeValue("subprocesstype");
			if (processtype == "Embedded") {
				
				var BlockActivity:XMLNode = new XMLNode(1, ElementParser.xpdl + "BlockActivity");
				var setId = View.getInstance().getUniqueId();
				if (!View.getInstance().offline) {
					setId = subflowel.attributes.Id;
				}
				var p = new ActivitySet();
				var activitySet:XMLNode = p.parse(toParseNode);
				activitySet.attributes.Id = setId;
				activitySet=ParserOut.getActivitySet(activitySet);
				setId = activitySet.attributes.Id;
				BlockActivity.attributes.ActivitySetId = setId;
				parsedNode.insertBefore(BlockActivity, subflowel.parentNode);
				subflowel.parentNode.removeNode();
			}else{
				ParserOut.addWorkFlowProcess(subflowel.attributes.Id, subflowel.attributes.Name);
			}
		}
		
		
	}	
}
