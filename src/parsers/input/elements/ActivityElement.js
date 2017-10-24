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


