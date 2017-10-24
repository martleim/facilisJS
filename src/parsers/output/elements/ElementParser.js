/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements{
	import flash.xml.XMLDocument;
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import view.View;

	public class ElementParser {
		
		var parsedNode:XMLNode;
		var toParseNode:XMLNode;
		
		private var parseFunctions:Array;
		
		private var ObjectNode:XMLNode;
		
		public static var APIA_NAMESPACE = "http://www.statum.biz/2009/APIA.XPDL2.1";
		public static var XPDL_NAMESPACE = "http://www.wfmc.org/2008/XPDL2.1";
		
		public static var xpdl = "xpdl:";
		public static var offline = "xpdl:";
		public static var apia = "apia:";
		
		import controller.resources.FormResources;
		
		public function ElementParser() {
			addParseFunction(getId);
			addParseFunction(getName);
			addParseFunction(getObjectNode);
			addParseFunction(getDataFields);
			addParseFunction(getUserAttributes);
			
		}
		
		public function parse(node:XMLNode):XMLNode {
			toParseNode = node;
			return startParse();
		}
		
		function getToParseSubNode(name:String):XMLNode {
			var node = ParseOutUtils.getSubNode(toParseNode, name);
			if (node && node.attributes.disabled && node.attributes.disabled=="true") {
				return null;
			}
			return node;
		}
		
		function getParsedSubNode(name:String):XMLNode{
			return ParseOutUtils.getSubNode(parsedNode, name);
		}
		
		function getToParseSubNodeValue(name:String):String{
			return ParseOutUtils.getSubNodeValue(toParseNode, name);
		}
		
		function getParsedSubNodeValue(name:String):String{
			return ParseOutUtils.getSubNodeValue(parsedNode, name);
		}
	
		function callParseFunctions() {
			for (var i:Number = 0; i < parseFunctions.length;i++ ) {
				(parseFunctions[i] as Function)();
			}
		}
		
		function startParse():XMLNode { 
			callParseFunctions();
			return parsedNode;
		}
		
		function getParsedNode(xmlStr):XMLNode {
			return ParseOutUtils.getParsedNode(xmlStr);
		}
		
		function getValues(node:XMLNode) {
			if (!node) {
				return null;
			}
			for (var i:Number = 0;i< node.childNodes.length; i++ ) {
				if (node.childNodes[i].nodeName=="values") {
					return node.childNodes[i];
				}
			}
		}
		
		function addParseFunction(f:Function) {
			if(!parseFunctions){
				parseFunctions = new Array();
			}
			parseFunctions.push(f);
		}
		
		function removeParseFunction(f:Function) {
			if(parseFunctions){
				for (var i:Number = 0; i < parseFunctions.length; i++ ) {
					if (parseFunctions[i]==f) {
						parseFunctions.splice(i, 1);
					}
				}
			}
		}
		
		function getObjectNode() {
			if(!ObjectNode || (ObjectNode && !ObjectNode.parentNode)){
				ObjectNode = new XMLNode(1, ElementParser.xpdl + "Object");
				/*if(!View.getInstance().offline){
					ObjectNode.attributes["xmlns:xpdl"] = ElementParser.XPDL_NAMESPACE;
				}*/
				ObjectNode.attributes.Id = View.getInstance().getUniqueId();
				getDocumentation();
				//getCategories();
				if(ObjectNode.childNodes.length>0){
					parsedNode.appendChild(ObjectNode);
				}
			}
		}
		
		function testObjectNode() {
			if(ObjectNode && ObjectNode.parentNode){
				if (ObjectNode.childNodes.length==0) {
					ObjectNode.removeNode();
				}
			}
		}
		
		function getDocumentation() {
			var documentation:XMLNode = null;
			var forms:XMLNode = null;
			var events:XMLNode = null;
			var title:XMLNode = null;
			if(toParseNode.firstChild){
				for (var i:Number = 0; i < toParseNode.firstChild.childNodes.length; i++ ) {
					if (toParseNode.firstChild.childNodes[i].attributes.name == "documentation") {
						documentation = toParseNode.firstChild.childNodes[i];
					}
					if (toParseNode.firstChild.childNodes[i].attributes.name == "forms") {
						forms = toParseNode.firstChild.childNodes[i];
					}
					if (toParseNode.firstChild.childNodes[i].attributes.name == "events") {
						events = toParseNode.firstChild.childNodes[i];
					}
					if (toParseNode.firstChild.childNodes[i].attributes.name == "title") {
						title = toParseNode.firstChild.childNodes[i];
					}
				}
			}
			if (documentation || forms || events || title) {
				var Documentation:XMLNode = getDocumentationNode(documentation, forms, events, title);
				if (Documentation && Documentation.childNodes.length > 0) {
					Documentation.nodeName = ElementParser.xpdl+"Documentation";
					/*if(!View.getInstance().offline){
						Documentation.attributes["xmlns:xpdl"] = ElementParser.XPDL_NAMESPACE;
					}*/
					if (!ParseOutUtils.getSubNode(ObjectNode, ElementParser.xpdl+"Documentation")) {
						ObjectNode.appendChild(Documentation);
					}
				}
			}
		}
		
		function getDocumentationNode(documentation:XMLNode, forms:XMLNode = null, events:XMLNode = null, title:XMLNode = null):XMLNode {
			var Documentation:XMLNode;
			if (documentation && (documentation.attributes.value != "" || forms || events || title)) {
				if ((!events && !forms && !title) || !View.complexDoc) {
					if (documentation.attributes.value != "") {
						Documentation = new XMLNode(1, "Documentation");
						if(documentation.attributes.value && documentation.attributes.value!=""){
							Documentation.appendChild(new XMLNode(3, documentation.attributes.value));
							//parsedNode.appendChild(Documentation);
						}else {
							return null;
						}
					}
				}else if (View.complexDoc && (forms || events || title)) {
					Documentation = new XMLNode(1, "Documentation");
					if (documentation.attributes.value != "") {
						var docNode:XMLNode = new XMLNode(1, "documentation");
						var docVal = documentation.attributes.value;
						if (docVal && docVal != "") {
							Documentation.appendChild(docNode);
							docNode.appendChild(new XMLNode(3, docVal));
						}
					}
					parseFormsDoc(forms, Documentation);
					parseEventsDoc(events, Documentation);
					parseTitle(title, Documentation);
					if(Documentation.hasChildNodes()){
						var strNodes = "";
						while (Documentation.hasChildNodes()) {
							strNodes += Documentation.childNodes[0].toString();
							(Documentation.childNodes[0] as XMLNode).removeNode();
						}
						ParseOutUtils.escapeHTML(strNodes);
						Documentation.appendChild(new XMLNode(3, strNodes));
					}else {
						Documentation = null;
					}
				}
			}
			return Documentation;
		}
		
		private function parseTitle(titleNode:XMLNode, Documentation:XMLNode) {
			if(titleNode){
				var value = titleNode.attributes.value;
				if (value && value != "") {
					var title = new XMLNode(1, "title");
					title.attributes.value = value;
					Documentation.appendChild(title);
				}
			}
		}
		
		private function parseFormsDoc(forms:XMLNode, Documentation:XMLNode) {
			if (forms) {
				var formsNode:XMLNode = new XMLNode(1, "forms");
				var formsValues:XMLNode;
				for (var d = 0; d < forms.childNodes.length; d++ ) {
					if(forms.childNodes[d].nodeName=="values"){
						formsValues = forms.childNodes[d];
					}
				}
				if (!formsValues && toParseNode.attributes.name == "pool") {
					formsValues = new XMLNode(1, "values");
					var frms:Array = FormResources.getInstance().getResources();
					for (var i = 0; i < frms.length; i++ ) {
						formsValues.appendChild(frms[i].cloneNode(true));
					}
				}
				if (formsValues) {
					for (var f = 0; f < formsValues.childNodes.length; f++ ) {
						//var formDoc = parseFormDoc(formsValues.childNodes[f]);
						//if((formDoc.attributes.name && formDoc.attributes.name!="" )|| (formDoc.attributes.description && formDoc.attributes.description!="") || formDoc.childNodes>0){
							//formsNode.appendChild(formDoc);
						//}
						if (formsValues.childNodes[f].childNodes[0].attributes.name == "step") {
							var pformStep;
							var eformStep;
							for (var g:Number = 0; g < formsValues.childNodes[f].childNodes.length; g++ ) {
								if (formsValues.childNodes[f].childNodes[g].attributes.name == "stepformse" || formsValues.childNodes[f].childNodes[g].attributes.name == "entityforms")
									eformStep = formsValues.childNodes[f].childNodes[g];
								else if (formsValues.childNodes[f].childNodes[g].attributes.name == "stepformsp" || formsValues.childNodes[f].childNodes[g].attributes.name == "processforms")
									pformStep = formsValues.childNodes[f].childNodes[g];
							}
							//var pformStep = formsValues.childNodes[f].childNodes[1];
							//var eformStep = formsValues.childNodes[f].childNodes[2];
							parseFormsStepDoc(pformStep, formsNode, f + 1, "P");
							parseFormsStepDoc(eformStep, formsNode, f + 1, "E");
						}else {
							formsNode.appendChild(parseFormDoc(formsValues.childNodes[f]));
						}
					}
				}
				if(formsNode.childNodes.length>0){
					Documentation.appendChild(formsNode);
				}
			}
		}
		
		private function parseFormsStepDoc(forms:XMLNode, formsNode:XMLNode,stepNumber:Number,formType:String="") {
			if (forms) {
				var formsValues:XMLNode;
				for (var d = 0; d < forms.childNodes.length; d++ ) {
					if(forms.childNodes[d].nodeName=="values"){
						formsValues = forms.childNodes[d];
					}
				}
				if (formsValues) {
					for (var f = 0; f < formsValues.childNodes.length; f++ ) {
						var frmId = parseInt(formsValues.childNodes[f].firstChild.attributes.value);
						if(FormResources.getInstance().getResource(frmId)){
							var formDoc = parseFormDoc(formsValues.childNodes[f]);
							formDoc.attributes.frmStepId = stepNumber;
							formDoc.attributes.frmOrder = f;
							if (formType != "") {
								formDoc.attributes.frmType = formType;
							}
							formsNode.appendChild(formDoc);
						}
					}
				}
			}
		}
		
		private function parseEventsDoc(events:XMLNode, Documentation:XMLNode) {
			if(events){
				var eventsNode:XMLNode = new XMLNode(1, "events");
				var eventsValues:XMLNode;
				for (var ed = 0; ed < events.childNodes.length; ed++ ) {
					if(events.childNodes[ed].nodeName=="values"){
						eventsValues = events.childNodes[ed];
					}
				}
				if (eventsValues) {
					for (var e = 0; e < eventsValues.childNodes.length; e++ ) {
						var eventDoc:XMLNode = parseEventDoc(eventsValues.childNodes[e]);
						eventDoc.attributes.evtExecOrder = e;
						eventsNode.appendChild(eventDoc);
					}
				}
				if (eventsNode.childNodes.length > 0) {
					Documentation.appendChild(eventsNode);
				}
			}
		}
		
		function parseFormDoc(form:XMLNode) {
			var formNode:XMLNode = new XMLNode(1, "form");
			/*formNode.attributes.frmName = "";
			formNode.attributes.frmTitle = "";*/
			for (var i:Number = 0; i < form.childNodes.length; i++ ) {
				if (form.childNodes[i].attributes.name == "formId") {
					if (form.childNodes[i].attributes.value!=null && (form.childNodes[i].attributes.value+"") != "") {
						formNode.attributes.frmId = form.childNodes[i].attributes.value;
					}
				}else if (form.childNodes[i].attributes.name=="formName") {
					if(form.childNodes[i].attributes.value && form.childNodes[i].attributes.value!=""){
						formNode.attributes.frmName = form.childNodes[i].attributes.value;
					}
				}else if (form.childNodes[i].attributes.name == "formDesc") {
					if(form.childNodes[i].attributes.value && form.childNodes[i].attributes.value!=""){
						formNode.attributes.frmTitle = form.childNodes[i].attributes.value;
					}
				}else if (form.childNodes[i].attributes.name == "frmEvents") {
					//if(form.childNodes[i].attributes.value && form.childNodes[i].attributes.value!=""){
						parseEventsDoc(form.childNodes[i],formNode);
					//}
				}else if (form.childNodes[i].attributes.name=="doc") {
					var doc = form.childNodes[i];
					var docValues:XMLNode;
					for (var u = 0; u < doc.childNodes.length; u++ ) {
						if (doc.childNodes[u].nodeName=="values") {
							docValues = doc.childNodes[u];
						}
					}
					if(docValues){
						for (var d = 0; d < docValues.childNodes.length; d++ ) {
							var docNode:XMLNode = new XMLNode(1,"attribute");
							var fieldDoc:XMLNode = docValues.childNodes[d];
							
							var fnameAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "fname");
							var descriptionAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "description");
							var tooltipAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "tooltip");
							var datatypeAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "datatype");
							var fieldtypeAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "fieldtype");
							var rulesAtt = ParseOutUtils.getSubNodeValue(fieldDoc, "rules");
							var grid = ParseOutUtils.getSubNodeValue(fieldDoc, "grid");
							
							docNode.attributes.attName = fnameAtt?fnameAtt:"";
							docNode.attributes.attLabel = descriptionAtt?descriptionAtt:"";
							docNode.attributes.attTooltip = tooltipAtt?tooltipAtt:"";
							docNode.attributes.datatype=datatypeAtt?datatypeAtt:"";
							docNode.attributes.fieldtype=fieldtypeAtt?fieldtypeAtt:"";
							docNode.attributes.regExp = rulesAtt?rulesAtt:"";
							docNode.attributes.grid = grid?grid:"";
							if (!(docNode.attributes.name == "" && docNode.attributes.attLabel == "" && docNode.attributes.datatype == "" && docNode.attributes.fieldtype == "" && docNode.attributes.regExp == "")) {
								formNode.appendChild(docNode);
							}
						}
					}
				}
			}
			return formNode;
		}
		
		function parseEventDoc(event:XMLNode) {
			var eventNode:XMLNode = new XMLNode(1, "event");
			for (var i:Number = 0; i < event.childNodes.length; i++ ) {
				
				if (event.childNodes[i].attributes.name=="evtName") {
					if(event.childNodes[i].attributes.value){
						//eventNode.attributes.evtName = event.childNodes[i].attributes.value;
						eventNode.attributes.evtName = getEventNameValue(event.childNodes[i]);
					}
				}else if (event.childNodes[i].attributes.name == "clsName") {
					eventNode.attributes.busClaName = "";
					if(event.childNodes[i].attributes.value){
						eventNode.attributes.busClaName = event.childNodes[i].attributes.value;
					}
				}else if (event.childNodes[i].attributes.name == "clsDesc") {
					eventNode.attributes.busClaDesc = "";
					if(event.childNodes[i].attributes.value){
						eventNode.attributes.busClaDesc = event.childNodes[i].attributes.value;
					}
				}
			}
			return eventNode;
		}
		
		private function getEventNameValue(cmb:XMLNode) {
			var validValue = "";
			var value = cmb.attributes.value;
			var values:XMLNode = cmb.firstChild;
			for (var i:Number = 0; i < values.childNodes.length; i++ ) {
				if (validValue=="" && values.childNodes[i].attributes.disabled!="true") {
					validValue = values.childNodes[i].attributes.value;
				}
				if (values.childNodes[i].attributes.value == value) {
					if(values.childNodes[i].attributes.disabled!="true"){
						validValue=value;
					}
				}
			}
			return validValue;
		}
		
		function getCategories() {
			var categories = getToParseSubNode("categories");
			if (categories) {
				var Categories:XMLNode = getCategoriesNode(categories);
				if (Categories && Categories.childNodes.length > 0) {
					Categories.nodeName = ElementParser.xpdl + "Categories";
					if(!View.getInstance().offline){
						Categories.attributes["xmlns:xpdl"] = ElementParser.XPDL_NAMESPACE;
					}
					/*if (!ObjectNode) {
						getObjectNode();
					}
					ObjectNode.appendChild(Categories);*/
				}
			}
		}
		
		function getCategoriesNode(categories:XMLNode):XMLNode {
			var Categories:XMLNode;
			if (categories) {
				categories = getValues(categories);
				Categories = new XMLNode(1, "Categories");
				getSubCategories(categories, Categories);
			}
			return Categories;
		}
		
		function getSubCategories(categories:XMLNode, parent:XMLNode) {
			if(categories){
				for (var i:Number = 0; i < categories.childNodes.length;i++ ) {
					var category = getCategoryNode(categories.childNodes[i]);
					if (category) {
						parent.appendChild(category);
					}
				}
			}
		}
		
		function getCategoryNode(category:XMLNode):XMLNode {
			var Category:XMLNode;
			if (category && category.childNodes.length>0) {
				Category = new XMLNode(1, "Category");
				for (var i:Number = 0; i < category.childNodes.length; i++ ) {
					if(category.childNodes[i].nodeName=="level"){
						Category.attributes.CategoryId = category.childNodes[i].attributes.id;
						Category.attributes.Name = category.childNodes[i].attributes.value;
						var documentation = ParseOutUtils.getSubNode(category.childNodes[i], "documentation");
						if(documentation){
							var Documentation = getDocumentationNode(documentation);
							Category.appendChild(Documentation);
						}
						
					}
					if (category.childNodes[i].nodeName == "childnodes") {
						getSubCategories(category.childNodes[i],Category);
					}
				}
				
			}
			return Category;
		}
		
		function getPropertiesNode(properties:XMLNode,parent:XMLNode) {
			var Properties:XMLNode;
			if (properties && properties.childNodes.length > 0) {
				Properties= new XMLNode(1, "Properties");
				properties = getValues(properties);
				if (properties && properties.childNodes.length > 0) {
					for (var i:Number = 0; i < properties.childNodes.length; i++ ) {
						var Property:XMLNode = new XMLNode(1, "Property");
						var nodes:XMLNode = properties.childNodes[i];// ParseOutUtils.getSubNode(properties.childNodes[i], "values");
						Property.attributes.Id = ParseOutUtils.getSubNodeValue(nodes,"id");
						Property.attributes.Name = ParseOutUtils.getSubNodeValue(nodes,"name");
						Property.attributes.Type = ParseOutUtils.getSubNodeValue(nodes,"type");
						Property.attributes.Value = ParseOutUtils.getSubNodeValue(nodes,"value");
						Property.attributes.Correlation = ParseOutUtils.getSubNodeValue(nodes, "correlation");
						Property.attributes.UK = ParseOutUtils.getSubNodeValue(nodes, "uk");
						Property.attributes.Multivalued = ParseOutUtils.getSubNodeValue(nodes, "multivalued");
						Property.attributes.Index = ParseOutUtils.getSubNodeValue(nodes, "index");
						Properties.appendChild(Property);
					}
				}
				parent.appendChild(Properties);
			}
		}
		
		function getProperties() {
			for (var i:Number = 0; i < toParseNode.childNodes.length; i++ ) {
				if (toParseNode.childNodes[i].attributes.name=="properties") {
					var properties = toParseNode.childNodes[i];
					getPropertiesNode(properties,parsedNode);
				}
			}
		}
		
		function getName() {
			var name:String = null;
			var namechooser:String = null;
			for (var i:Number = 0; i < toParseNode.firstChild.childNodes.length; i++ ) {
				if (toParseNode.firstChild.childNodes[i].attributes.name=="name") {
					name = toParseNode.firstChild.childNodes[i].attributes.value;
				}
				if (toParseNode.firstChild.childNodes[i].attributes.name=="nameChooser") {
					namechooser = toParseNode.firstChild.childNodes[i].attributes.value;
				}
			}
			if (name != null) {
				parsedNode.attributes.Name = name;
			}else if (namechooser && namechooser!="") {
				parsedNode.attributes.Name = namechooser;
			}
		}
		
		function getId() {
			var id = toParseNode.attributes.id;
			if (id) {
				parsedNode.attributes.Id = id;
			}
		}
		
		function getDataFieldsNode(datafields:XMLNode,parent:XMLNode) {
			var DataFields:XMLNode;
			if (datafields && datafields.childNodes.length > 0) {
				DataFields= new XMLNode(1, "DataFields");
				datafields = getValues(datafields);
				if (datafields && datafields.childNodes.length > 0) {
					for (var i:Number = 0; i < datafields.childNodes.length; i++ ) {
						var DataField:XMLNode = new XMLNode(1, "DataField");
						var nodes:XMLNode = datafields.childNodes[i];// ParseOutUtils.getSubNode(properties.childNodes[i], "values");
						var name = ParseOutUtils.getSubNodeValue(nodes, "name");
						var type = ParseOutUtils.getSubNodeValue(nodes, "type");
						var value = ParseOutUtils.getSubNodeValue(nodes, "value");
						var correlation = ParseOutUtils.getSubNodeValue(nodes, "correlation");
						var uk = ParseOutUtils.getSubNodeValue(nodes, "uk");
						var multivalued = ParseOutUtils.getSubNodeValue(nodes, "multivalued");
						var index = ParseOutUtils.getSubNodeValue(nodes, "index");
						if(name){
							DataField.attributes.Name = name;
						}
						if(type){
							DataField.attributes.Type = type;
						}
						if(value){
							DataField.attributes.Value = value;
						}
						if(correlation){
							DataField.attributes.Correlation = correlation;
						}
						if(uk){
							DataField.attributes.UK = uk;
						}
						if(multivalued){
							DataField.attributes.Multivalued = multivalued;
						}
						if(index){
							DataField.attributes.Index = index;
						}
						DataFields.appendChild(DataField);
					}
				}
				if (DataFields.childNodes.length > 0) {
					parent.appendChild(DataFields);
				}
			}
		}
		
		function getDataFields() {
			var bpmn:XMLNode = toParseNode.firstChild;
			for (var i:Number = 0; i < bpmn.childNodes.length; i++ ) {
				if (bpmn.childNodes[i].attributes.name=="properties") {
					var properties = bpmn.childNodes[i];
					getDataFieldsNode(properties,parsedNode);
				}
			}
		}
		
		function getUserAttributes() {
			var ExtendedAttributes:XMLNode = new XMLNode(1, "ExtendedAttributes");
			var userproperties:XMLNode;
			for (var u = 0; u < toParseNode.childNodes.length;u++ ) {
				if (toParseNode.childNodes[u].attributes.id == "userproperties") {
					userproperties = toParseNode.childNodes[u];
				}
			}
			if (userproperties) {
				var userattributes:XMLNode = ParseOutUtils.getSubNode(userproperties, "userattributes");
				if(userattributes){
					var values:XMLNode = getValues(userattributes);
					if (values) {
						for (var i:Number = 0; i < values.childNodes.length;i++ ) {
							var ExtendedAttribute:XMLNode = new XMLNode(1, "ExtendedAttribute");
							ExtendedAttribute.attributes.Name = ParseOutUtils.getSubNodeValue(values.childNodes[i], "name");
							ExtendedAttribute.attributes.Value = ParseOutUtils.getSubNodeValue(values.childNodes[i], "value");
							ExtendedAttribute.attributes.Type = ParseOutUtils.getSubNodeValue(values.childNodes[i], "type");
							ExtendedAttributes.appendChild(ExtendedAttribute);
						}
						parsedNode.appendChild(ExtendedAttributes);
					}
				}
			}
		}
		
		
	}
	
}
