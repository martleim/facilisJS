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