/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
	import flash.xml.XMLNode;
	import parsers.output.ParseOutUtils;
	import view.View;

	public class ActivityElement extends Activity{
		
		public function ActivityElement() {
			addParseFunction(getPerformers);
			addParseFunction(getLoopType);
			super();
		}
		
		function getLoopType() {
			var loopType = getToParseSubNodeValue("looptype");
			if (loopType && loopType!="None") {
				var Loop:XMLNode=new XMLNode(1, ElementParser.xpdl+"Loop");
				Loop.attributes.LoopType = loopType;
				if (loopType == "Standard") {
					var testTime = getToParseSubNodeValue("testtime");
					var loopmaximum = getToParseSubNodeValue("loopmaximum");
					var loopcounter = getToParseSubNodeValue("loopcounter");
					var loopcondition = getToParseSubNodeValue("loopcondition");
					var LoopStandard:XMLNode = new XMLNode(1, ElementParser.xpdl+"LoopStandard");

					var loopdocumentation:XMLNode = getToParseSubNode("loopdocumentation");
					if(loopdocumentation && loopdocumentation.firstChild && loopdocumentation.firstChild.firstChild && loopdocumentation.firstChild.firstChild.attributes.value){
						LoopStandard.attributes[ElementParser.apia+"ConditionDoc"]=loopdocumentation.firstChild.firstChild.attributes.value;
					}
					LoopStandard.attributes.TestTime = testTime;
					//LoopStandard.attributes.LoopMaximum = (loopmaximum)?loopmaximum:"";
					//LoopStandard.attributes.LoopCounter = (loopcounter)?loopcounter:"";
					if (loopcondition) {
						LoopStandard.attributes.LoopCondition = loopcondition;
					}
					Loop.appendChild(LoopStandard);
				}else if (loopType == "MultiInstance") {
					var LoopMultiInstance:XMLNode = new XMLNode(1, ElementParser.xpdl+"LoopMultiInstance");
					var mi_condition:XMLNode = getToParseSubNode("mi_condition");
					if(mi_condition){
						var values:XMLNode = getValues(mi_condition);
						if (values && values.firstChild) {
							var value:XMLNode = values.firstChild;
							if (!View.getInstance().offline){
								LoopMultiInstance.attributes["xmlns:apia"] = ElementParser.APIA_NAMESPACE;
							}
							LoopMultiInstance.attributes[ElementParser.apia+"MultiplierAttName"] = mi_condition.attributes.value;
							for (var i:Number = 0; i < value.childNodes.length; i++ ) {
								if (value.childNodes[i].attributes.name == "id") {
									LoopMultiInstance.attributes[ElementParser.apia+"MultiplierAttId"] = value.childNodes[i].attributes.value;
								}
								/*if (value.childNodes[i].attributes.name == "name") {
									LoopMultiInstance.attributes[ElementParser.apia+"MultiplierAttName"] = value.childNodes[i].attributes.value;
								}*/
							}
						}else if (mi_condition.attributes.value) {
							LoopMultiInstance.attributes["MI_Condition"] = mi_condition.attributes.value;
						}
					}
					var mi_ordering:XMLNode = getToParseSubNode("mi_ordering");
					if(mi_ordering){
						LoopMultiInstance.attributes.MI_Ordering = mi_ordering.attributes.value;
					}
					var mi_flowcondition:XMLNode = getToParseSubNode("mi_flowcondition");
					if(mi_flowcondition){
						LoopMultiInstance.attributes.MI_FlowCondition = mi_flowcondition.attributes.value;
					}
					Loop.appendChild(LoopMultiInstance);
				}
				parsedNode.appendChild(Loop);
			}
		}
		
		
		
	}
	
}
