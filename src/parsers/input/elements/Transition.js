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
