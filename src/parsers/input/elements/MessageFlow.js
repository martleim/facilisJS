(function() {

    function MessageFlow() {
        this.ElementParser_constructor();
        this.parseFunctions.push(this.parseMessageRef);
    }
    
    var element = facilis.extend(MessageFlow, facilis.parsers.input.Line);

    element.getConditionType=function() {
        var Condition = this.getToParseSubNode("Condition");
        if (Condition && Condition.attributes.Type) {
            this.parsedModel.conditiontype= Condition.getAttribute("Type");
        }
    }

    element.parseMessageRef=function() {
        var messageref = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode,"messageref");
        var MessageRef = this.getToParseSubNode("MessageRef");
        if (MessageRef && messageref) {
            var documentation = facilis.parsers.ParseInUtils.getSubNode(messageref, "documentation");
            var categories = facilis.parsers.ParseInUtils.getSubNode(messageref, "categories");
            var properties = facilis.parsers.ParseInUtils.getSubNode(messageref, "properties");

            var Documentation = facilis.parsers.ParseInUtils.getSubNode(MessageRef, "Documentation");
            var Categories = facilis.parsers.ParseInUtils.getSubNode(MessageRef, "Categories");
            var Properties = facilis.parsers.ParseInUtils.getSubNode(MessageRef, "Properties");

            var name = MessageRef.attributes.Name.value;

            facilis.parsers.ParseInUtils.setSubNodeValue(messageref, "name", name);

            parseDocumentationNode(Documentation, documentation);
            parseCategoriesNode(Categories, categories);
            parsePropertiesNode(Properties, properties);

        }

    }
    
    
    facilis.parsers.input.MessageFlow = facilis.promote(MessageFlow, "Line");
    
}());