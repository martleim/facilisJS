/**
* ...
* @author Default
* @version 0.1
*/

package parsers.output.elements {
import flash.xml.*;

	public class Artifact extends Activity{
		
		public function Artifact() {
			addParseFunction(getObjectNode);
			addParseFunction(getArtifactType);
			super();
			addParseFunction(getTextAnnotation);
			addParseFunction(getGroup);
		}
		
		override function startParse():XMLNode{
			parsedNode = new XMLNode(1, (ElementParser.offline+"Artifact"));
			this.callParseFunctions();
			return parsedNode;
		}
		
		function getTextAnnotation() {
			var textannotation = getToParseSubNodeValue("text");
			if (textannotation) {
				parsedNode.attributes.TextAnnotation = textannotation;
			}
		}
		
		function getGroup() {
			var name=getToParseSubNodeValue("name");
			if (this.toParseNode.attributes.name == "group" && name) {
				parsedNode.attributes.Group = name;
			}
		}
		
		function getArtifactType() {
			var name = this.toParseNode.attributes.name;
			
			//Mantener compabilidad
			//parsedNode.attributes.ArtifactType = (name == "dataobject")?"DataObject":((name == "group")?"Group":"Annotation");
			if (name == "datainput" || name == "dataoutput")
				parsedNode.attributes.ArtifactType = "DataObject";
			else
				parsedNode.attributes.ArtifactType = (name == "dataobject")?"DataObject":((name == "group")?"Group":"Annotation");
			
			var theName;
			var state;
			var isCollection;
			
			if (name == "dataobject") {
				theName = getToParseSubNodeValue("name");
				state = getToParseSubNodeValue("state");
				isCollection = getToParseSubNodeValue("isCollection");
				
				var typeNode:XMLNode = new XMLNode(1, ElementParser.xpdl + "" + parsedNode.attributes.ArtifactType);
				typeNode.attributes.Id = toParseNode.attributes.id;
				parsedNode.appendChild(typeNode);
				if (theName)
					typeNode.attributes.Name= theName;
				if (state)
					typeNode.attributes.State= state;
				if (isCollection)
					typeNode.attributes.IsCollection = isCollection;
				
			} else if (name == "datainput") {
				theName = getToParseSubNodeValue("name");
				state = getToParseSubNodeValue("state");
				isCollection = getToParseSubNodeValue("isCollection");
				
				parsedNode = new XMLNode(1, ElementParser.xpdl + "DataInput");					
				if (theName)
					parsedNode.attributes.Name= theName;
				if (state)
					parsedNode.attributes.State= state;
				if (isCollection)
					parsedNode.attributes.IsCollection = isCollection;
			} else if (name == "dataoutput") {
				theName = getToParseSubNodeValue("name");
				state = getToParseSubNodeValue("state");
				isCollection = getToParseSubNodeValue("isCollection");
				
				parsedNode = new XMLNode(1, ElementParser.xpdl + "DataOutput");
				if (theName)
					parsedNode.attributes.Name= theName;
				if (state)
					parsedNode.attributes.State= state;
				if (isCollection)
					parsedNode.attributes.IsCollection = isCollection;
			}
		}
		
	}
	
}
