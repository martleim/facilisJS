(function() {

    function Subflow() {
        this.ActivityElement_constructor();
        this.parseFunctions.push(this.getImplementation);
        this.parseFunctions.push(this.getIsTransaction);
        this.parseFunctions.push(this.getBlockActivity);
        this.parseFunctions.push(this.getIsExpanded);
        this.parseFunctions.push(this.getExecution);
        this.parseFunctions.push(this.getDataMappings);
        this.parseFunctions.push(this.parseSkipFirstTask);
        this.parseFunctions.push(this.getPrcName);
        this.parseFunctions.push(this.getFormsRef);
        this.parseFunctions.push(this.getEntity);
    }
    
    var element = facilis.extend(Subflow, facilis.parsers.input.ActivityElement);
    
    
    element.getImplementation=function() {
        /*var strNode = "<Implementation><Task>";
        var type = this.getToParseSubNodeValue("taskType");
        if (type.attributes.value!="") {
            strNode+="<"+type.attributes.value+" />"
        }
        strNode += "</Task></Implementation>";
        var implementationNode = getParsedNode(strNode);
        this.this.parsedModel.appendChild(implementationNode);*/
    }

    element.getIsTransaction=function() {
        var IsATransaction = this.toParseNode.getAttribute("IsATransaction");
        if (IsATransaction!="false") {
            if(this.parsedModel.isATransaction!=null)
				this.parsedModel.isATransaction=IsATransaction;
			
            var Transaction = this.getToParseSubNode("Transaction");
            if (Transaction) {
				if(this.parsedModel.transactionid!=null)
					this.parsedModel.transactionid=Transaction.getAttribute("Id");
            }
        }
    }

    element.getIsAdhoc=function() {
        var adhoc = this.toParseNode.attributes.AdHoc.value;
        if (adhoc!="false") {
			
			if(this.parsedModel.adhoc!=null)
				this.parsedModel.adhoc=true;
			
            var adhocordering = this.getToParseSubNode("AdHocOrdering");
            if (adhocordering) {
				if(this.parsedModel.adhocordering!=null)
					this.parsedModel.adhocordering=adhocordering;
            }

        }
    }

    element.getBlockActivity=function() {
        var BlockActivity = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "BlockActivity");
        if (BlockActivity) {
            var ActivitySetId = BlockActivity.attributes.ActivitySetId.value;
            if (this.parsedModel.name!=null) {
                var values = {
					name:this.parsedModel.name,
					id:ActivitySetId
				};
            }
        }
    }

    element.getIsExpanded=function() {
        var NodeGraphicsInfo = facilis.parsers.ParseInUtils.getSubNode(this.toParseNode, "NodeGraphicsInfo");
        if(NodeGraphicsInfo){
            var expanded = NodeGraphicsInfo.getAttribute("Expanded");
            if (expanded == "true") {
                this.parsedModel.expanded = expanded;
                if(NodeGraphicsInfo.getAttribute("ExpandedWidth") &&
				   NodeGraphicsInfo.getAttribute("ExpandedHeight")){
                    this.parsedModel.width = NodeGraphicsInfo.getAttribute("ExpandedWidth");
                    this.parsedModel.height = NodeGraphicsInfo.getAttribute("ExpandedHeight");
                }
            }
        }
    }

    element.getExecution=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            if(SubFlow.getAttribute("ApiaExecution")=="MAP"){
                var processtype = this.setParsedModelValue("subprocesstype", "Embedded");
            }else {
                if(this.parsedModel.subprocesstype!=null)
					this.parsedModel.subprocesstype= "Reusable";
				
                var exec = SubFlow.getAttribute("ApiaExecution");
                if (exec && (exec.indexOf("_SKIP") > 0) ) {
                    exec = exec.split("_")[0];
                }
				
				if(this.parsedModel.execution!=null)
					this.parsedModel.execution= exec;
            }
        }
    }


    element.getDataMappings=function() {
        var DataMappings = this.getToParseSubNode("DataMappings");
        if(DataMappings && this.parsedModel.datamappings!=null){
            var input = facilis.parsers.ParseInUtils.getSubNode(datamappings, "inputmaps");
            var inData = this.getData(input);
            var inValues = this.parsedModel.ownerDocument.createElement( "values");
            input.appendChild(inValues);

            var out = facilis.parsers.ParseInUtils.getSubNode(datamappings, "outputmaps");
            var outData = this.getData(out);
            var outValues = this.parsedModel.ownerDocument.createElement( "values");
            out.appendChild(outValues);
            var value;
            for (var i = 0 ; i < DataMappings.children.length; i++ ) {
                var DataMapping = DataMappings.children[i];
                if (DataMapping.attributes.Direction.value == "IN") {
                    value= inData.cloneNode(true);
                    value.nodeName = "value";
                    inValues.appendChild(value);
                    facilis.parsers.ParseInUtils.setSubNodeValue(value, "inputmap", DataMapping.attributes.TestValue.value);
                }else {
                    value= outData.cloneNode(true);
                    value.nodeName = "value";
                    outValues.appendChild(value);
                    facilis.parsers.ParseInUtils.setSubNodeValue(value, "outputmap", DataMapping.attributes.TestValue.value);
                }
            }
        }
    }

    element.parseSkipFirstTask=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "skipfirsttask", SubFlow.getAttribute("SkipFirstTask"));
        }
    }

    element.getPrcName=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", this.toParseNode.getAttribute("Name"));
        if (SubFlow) {
            var nameXPDL = SubFlow.getAttribute("Name");
            if (nameXPDL.indexOf(".xpdl") > 0) {
                facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "filename", nameXPDL);
            }
            var processref = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "name");
            if (processref) {
                var oldValues=facilis.parsers.ParseInUtils.getSubNode(processref, "values");
                if (oldValues) {
                    oldValues.removeNode();
                }
                var values = this.parsedModel.ownerDocument.createElement( "values");
                values.setAttribute("value", this.toParseNode.getAttribute("Name"));
                var value = facilis.parsers.ParseInUtils.getParsedNode("<value value=\"" + this.toParseNode.getAttribute("Name") + "\"><level name=\"id\" type=\"label\" value=\"" + SubFlow.attributes.Id.value + "\" /><level name=\"name\" type=\"label\" value=\"" + this.toParseNode.getAttribute("Name") + "\" /></value>");
                values.appendChild(value);
                processref.attributes.value.value = this.toParseNode.getAttribute("Name");
                processref.appendChild(values);
            }
        }
    }

    element.getEntity=function() {
        var SubFlow = this.getToParseSubNode("SubFlow");
        if (SubFlow) {
            var entity = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "entity");
            if (entity && SubFlow.attributes.ProEleAttBusEntName.value && SubFlow.attributes.ProEleAttBusEntId.value) {
                var values = this.parsedModel.ownerDocument.createElement( "values");
                var value = facilis.parsers.ParseInUtils.getParsedNode("<value value=\"" + SubFlow.attributes.ProEleAttBusEntName.value + "\"><level name=\"id\" type=\"label\" value=\"" + SubFlow.attributes.ProEleAttBusEntId.value + "\" /><level name=\"name\" type=\"label\" value=\"" + SubFlow.attributes.ProEleAttBusEntName.value + "\" /></value>");
                values.appendChild(value);
                entity.setAttribute("value", SubFlow.attributes.ProEleAttBusEntName.value);
                entity.appendChild(values);
            }
        }
    }

    element.getFormsRef=function() {
        if (this.parsedModel.processforms!=null && this.parsedModel.entityforms!=null) {
            var FormsRef = this.getToParseSubNode("FormsRef");
            this.parsedModel.processforms=[];
			this.parsedModel.entityforms=[];
			var eForms=[];
			var pForms=[];
			
            var order;
            if (FormsRef) {
                for (var u = 0; u < FormsRef.children.length; u++ ) {
                    if (FormsRef.children[u].attributes.FrmType.value == "E") {
                        order = parseInt(FormsRef.children[u].attributes.ProEleFrmOrder.value);
                        var eValue = this.parseFormRef(FormsRef.children[u]);
                        eForms.push( { order:order, data:eValue } );
                        //eValues.appendChild(eValue);
                    }else {
                        order = parseInt(FormsRef.children[u].attributes.ProEleFrmOrder.value);
                        var pValue = this.parseFormRef(FormsRef.children[u]);
                        pForms.push( { order:order, data:pValue } );
                        //pValues.appendChild(pValue);
                    }
                }
                eForms.sort(function(a,b){ return a.order<b.order;});
                pForms.sort(function(a,b){ return a.order<b.order;});
                for (var e = 0; e < eForms.length; e++ ) {
                    this.parsedModel.entityforms.push(eForms[e].data);
                }
                for (var p = 0; p < pForms.length; p++ ) {
                    this.parsedModel.processforms.push(pForms[p].data);
                }
            }
        }
    }

    element.parseFormRef=function(form) {
        var value = {};
        value.id= form.getAttribute("FrmId");
        value.name= form.getAttribute("FrmName");
        value.readonly= form.getAttribute("ProEleFrmReadOnly");
        value.multiple= form.getAttribute("ProEleFrmMultiply");
        value.condition=form.getAttribute("ProEleFrmEvalCond");
        value.documentation=form.getAttribute("ConditionDoc");
        
        return value;
    }

    facilis.parsers.input.Subflow = facilis.promote(Subflow, "ActivityElement");
    
}());