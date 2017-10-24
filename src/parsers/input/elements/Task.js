(function() {

    function Task() {
        this.ActivityElement_constructor();
        this.parseFunctions.push(this.getType);
        this.parseFunctions.push(this.getFormsRef);
        //this.parseFunctions.push(this.getApiaTskPools);
        this.parseFunctions.push(this.getRoleRef);
        this.parseFunctions.push(this.getApiaTskEvents);
        this.parseFunctions.push(this.getApiaTskStates);
        this.parseFunctions.push(this.getTaskService);
        this.parseFunctions.push(this.getTaskUser);
        this.parseFunctions.push(this.getTaskSend);
        this.parseFunctions.push(this.getTaskReceive);
        this.parseFunctions.push(this.getTaskName);
        this.parseFunctions.push(this.getApiaHighlightComments);
        this.parseFunctions.push(this.getTaskSchedule);
        this.parseFunctions.push(this.getSkipCondition);
        this.parseFunctions.push(this.getProEleId);
    }
    
    var element = facilis.extend(Task, facilis.parsers.input.ActivityElement);

    element.getType=function () {
		var taskTypeValue=null;
        var implementation = this.getToParseSubNode("Implementation");
        if (implementation && implementation.firstElementChild && implementation.firstElementChild.firstElementChild) {
            var taskType = implementation.firstElementChild.firstElementChild.localName;
            taskTypeValue=taskType.split("Task")[1];
        }else {
            taskTypeValue="None";
        }
		if(this.parsedModel.taskType!=null)
			this.parsedModel.taskType=taskTypeValue;
    }

    element.getFormsRef=function () {
        if(this.parsedModel.steps!=null){
            var FormsRef = this.getToParseSubNode("FormsRef");
            if (FormsRef && FormsRef.firstElementChild && FormsRef.firstElementChild.nodeName != "Step") {
                var FormsRefClone = this.toParseNode.ownerDocument.createElement( "FormsRef");
				
				
				
                var forms = new Array();
                for (var i = 0; i < FormsRef.children.length; i++ ) {
                    var stepId = FormsRef.children[i].getAttribute("ProEleFrmStepId");
                    var frmOrder = FormsRef.children[i].getAttribute("ProEleFrmOrder");
                    forms.push( {order:stepId, frmOrder:frmOrder, form:FormsRef.children[i].cloneNode(true)} );
                }
                //forms.sortOn("order", Array.NUMERIC);
                forms.sort(function(a, b) {
                    if (parseInt(a.order) == parseInt(b.order)) {
                        return parseInt(a.frmOrder)-parseInt(b.frmOrder);
                    }
                    return (parseInt(a.order) - parseInt(b.order));
                } );
                var actual = null;
				var acutalStep = 0;
                i = 0;
                for (i = 0; i < forms.length; i++ ) {
                    if (actual != forms[i].order) {
						
						//Agregar huecos de steps
						for (var j = acutalStep + 1; j < forms[i].order; j++) {
							FormsRefClone.appendChild(this.toParseNode.ownerDocument.createElement("Step"));
						}

						acutalStep = parseInt(forms[i].order);

						//Agregar step actual
						
                        actual = forms[i].order;
                        var Step = this.toParseNode.ownerDocument.createElement( "Step");
                        FormsRefClone.appendChild(Step);
                    }
                    Step.appendChild(forms[i].form);
                }
                if (FormsRefClone.children.length > 0) {
                    FormsRef = FormsRefClone;
                }
            }
            
            var step=(this.parsedModel.steps.length)?this.parsedModel.steps[0]:{entityforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}],processforms:[{id:"",name:"",readonly:"",multiple:"",condition:"",documentation:""}]};
			this.parsedModel.steps=[];
            if (FormsRef) {
                for (var u = 0; u < FormsRef.children.length; u++ ) {
                    var value = this.parseStep(FormsRef.children[u],step);
                    this.parsedModel.steps.push(value);
                }
            }
        }
    }

    element.parseStep=function (step,stepObj) {
		var i;
        var value = facilis.clone(stepObj);			
		var pForms=[];
		var eForms=[];

        value.nodeName = "value";
        for (var i = 0; i < step.children.length; i++ ) {
            var fValue={};
            
            fValue.id=step.children[i].getAttribute("FrmId");
            fValue.name=step.children[i].getAttribute("FrmName");
            fValue.readonly=step.children[i].getAttribute("ProEleFrmReadOnly");
            fValue.multiple=step.children[i].getAttribute("ProEleFrmMultiply");
            if (step.children[i].getAttribute("ProEleFrmEvalCond")) {
				fValue.condition=step.children[i].getAttribute("ProEleFrmEvalCond");
            }
            if (step.children[i].getAttribute("ConditionDoc")) {
                fValue.documentation=step.children[i].getAttribute("ConditionDoc");
            }
			
			if (step.children[i].getAttribute("FrmType") == "E") {
                eForms.push(fValue);
            }else {
                pForms.push(fValue);
            }
			
        }
		
		for (var n in value ) {
			if (n == "stepformse" || n == "entityforms") {
				value[n]=eForms;
				console.log("stepformse en Task");
			} else if (n == "stepformsp"|| n == "processforms") {
				value[n]=pForms;
				console.log("stepformsp en Task");
			}
		}
		
        return value;
    }

    element.getApiaTskPools=function () {
        var groups = this.getParsedSubNode("groups");
        var data = this.getData(groups);
        var ApiaTskPools = this.getToParseSubNode("ApiaTskPools");
        var values = this.parsedModel.ownerDocument.createElement("values");
        groups.appendChild(values);

        if (ApiaTskPools) {
            for (var u = 0; u < ApiaTskPools.children.length; u++ ) {
                var value = data.cloneNode(true);
                value.nodeName = "value";
                values.appendChild(value);
                facilis.parsers.ParseInUtils.getSubNode(value, "id").setAttribute("value",ApiaTskPools.children[u].getAttribute("PoolId"));
                facilis.parsers.ParseInUtils.getSubNode(value, "name").setAttribute("value",ApiaTskPools.children[u].getAttribute("PoolName"));
                if (ApiaTskPools.children[u].getAttribute("ProElePoolEvalCond")) {
                    var condVals= this.parsedModel.ownerDocument.createElement( "values");
                    var condVal = this.parsedModel.ownerDocument.createElement( "value");
                    condVals.appendChild(condVal);
                    condVal.appendChild(ApiaTskPools.children[u].firstElementChild.cloneNode(true));
                    facilis.parsers.ParseInUtils.getSubNode(value, "condition").appendChild(condVals);
                }
            }
        }
    }

    element.getApiaTskStates=function () {
		var values=[];
        if(this.parsedModel.taskstates!=null){
            var ApiaTskStates = this.getToParseSubNode("ApiaTskStates");
            if(ApiaTskStates){
                for (var i = 0; i < ApiaTskStates.children.length; i++ ) {
                    var ApiaTskState = this.parseApiaTskState(ApiaTskStates.children[i]);
                    values.push(ApiaTskState);
                }
            }
        }
		return values;
    }

    element.parseApiaTskState=function (ApiaTskState) {
		var value={};
        value.evtid=ApiaTskState.getAttribute("EvtId");
        value.clsid=ApiaTskState.getAttribute("EntStaId");
        value.evtname=ApiaTskState.getAttribute("EvtName");
        value.clsname= ApiaTskState.getAttribute("StaName");
        if (ApiaTskState.getAttribute("ProEleBusEntStaEvalCond") && ApiaTskState.getAttribute("ProEleBusEntStaEvalCond")!="") {
            var cond = ApiaTskState.getAttribute("ProEleBusEntStaEvalCond");
			value.condition=cond;

        }
        if (ApiaTskState.getAttribute("ConditionDoc") && ApiaTskState.getAttribute("ConditionDoc")!="") {
            var doc = ApiaTskState.getAttribute("ConditionDoc");
			value.documentation=doc;
        }

        return value;
    }

    element.getApiaTskEvents=function () {
        var ApiaTskEvents = this.getToParseSubNode("ApiaEvents");
        if (ApiaTskEvents && this.parsedModel.bussinessclasses!=null) {
            this.parsedModel.bussinessclasses=this.parseEvents(ApiaTskEvents);
        }
    }

    element.getRoleRef=function () {
        var RoleRef = this.getToParseSubNode("RoleRef");

        if (RoleRef && this.parsedModel.role) {
            var values = this.parsedModel.ownerDocument.createElement( "values");
            var value = this.parsedModel.ownerDocument.createElement( "value");
            values.appendChild(value);
            var role=new facilis.model.Role();
            
			role.id=RoleRef.getAttribute("RoleId");
            role.name = RoleRef.getAttribute("RoleName");
			this.parsedModel.role=role;
        }
    }


    element.getValues=function (node) {
        for (var i = 0;i< node.children.length; i++ ) {
            if (node.children[i].nodeName=="values") {
                return node.children[i];
            }
        }
    }


    element.getTaskService=function () {
        var TaskService = this.getToParseSubNode("TaskService");
        if (TaskService && this.parsedModel.service!=null) {
			
			var taskservice=new facilis.model.Service();

            var MessageIn = facilis.parsers.ParseInUtils.getSubNode(TaskService, "MessageIn");
            var MessageOut = facilis.parsers.ParseInUtils.getSubNode(TaskService, "MessageOut");

            taskservice.inmessageref=this.getMessage(MessageIn, new facilis.model.Inmessageref());
            taskservice.outmessageref=this.getMessage(MessageOut, new facilis.model.Outmessageref());

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskService, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, taskservice.inmessageref);
            }

            this.parseWebServiceThrowNode(null, taskservice.outmessageref);
			this.parsedModel.service=taskservice;

        }
    }
    element.getTaskReceive=function () {
        var TaskReceive = this.getToParseSubNode("TaskReceive");
        if (TaskReceive && this.parsedModel.receive!=null) {
        	var taskreceive = new facilis.model.Receive();
			
            var Message = facilis.parsers.ParseInUtils.getSubNode(TaskReceive, "Message");

            //var WebServiceCatchNode = facilis.parsers.ParseInUtils.getSubNode(TaskService, "WebServiceCatch");
            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskReceive, "WebServiceMapping");
            taskreceive.messageref=this.getMessage(Message, new facilis.model.Message());
			
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                //this.parseWebServiceCatchNode(WebServiceCatchNode, messagein);
                this.parseWebServiceCatchNode(WebServiceMapping, taskreceive.messageref);
            }

            taskreceive.instantiate=TaskReceive.getAttribute("Instantiate");
			this.parsedModel.receive=taskreceive;
        }
    }
    element.getTaskSend=function () {
        var TaskSend = this.getToParseSubNode("TaskSend");
        if (TaskSend && this.parsedModel.send!=null) {
			var tasksend = (facilis.model.Send)?new facilis.model.Send():null;
			
            tasksend.messageref = (facilis.model.User)?new facilis.model.Messageref():null;
            var Message = facilis.parsers.ParseInUtils.getSubNode(TaskSend, "Message");

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskSend, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, tasksend.messageref);
            }

            this.parseWebServiceThrowNode(null, tasksend.messageref);

            tasksend.messageref=this.getMessage(Message, tasksend.messageref);
            
			tasksend.instantiate=TaskSend.getAttribute("Instantiate");
			this.parsedModel.send=tasksend;
        }

    }
    element.getTaskUser=function () {
        var TaskUser = this.getToParseSubNode("TaskUser");
        if (this.parsedModel.user!=null && TaskUser) {
        	var taskuser = (facilis.model.User)?new facilis.model.User():null;
			
            var MessageIn = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "MessageIn");
            var MessageOut = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "MessageOut");
			
            taskuser.messagein=this.getMessage(MessageIn, new facilis.model.Inmessageref());
            taskuser.messageout=this.getMessage(MessageOut, new facilis.model.Outmessageref());

            var WebServiceMapping = facilis.parsers.ParseInUtils.getSubNode(TaskUser, "WebServiceMapping");
            if (WebServiceMapping/*WebServiceCatchNode*/) {
                this.parseWebServiceCatchNode(WebServiceMapping, taskuser.messagein);
            }

            this.parseWebServiceThrowNode(null, taskuser.messageout);
			this.parsedModel.user=taskuser;
        }
    }
    element.getTaskManual=function () {
        /*var taskmanual = this.getToParseSubNode("manual");
        if (taskmanual) {
            var TaskManual = this.parsedModel.ownerDocument.createElement( "TaskManual");
        }*/
    }


    element.getMessage=function (Message,message) {
        if(Message){
            message.name=Message.getAttribute("Name");
            //var properties = facilis.parsers.ParseInUtils.getSubNode(message, "properties");
            var Properties = facilis.parsers.ParseInUtils.getSubNode(Message , "Properties");
            message.properties=this.parsePropertiesNode(Properties);
        }
		return null;
    }

    element.getTaskName=function () {
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", this.toParseNode.getAttribute("Name"));
        facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "nameChooser", this.toParseNode.getAttribute("Name"));
        TaskNode = this.getToParseSubNode("Task");
        if (TaskNode && TaskNode.getAttribute("TskName")) {
            //facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", TaskNode.getAttribute("TskName"));
            var tsk_title = TaskNode.getAttribute("TskTitle") ? TaskNode.getAttribute("TskTitle") : TaskNode.getAttribute("TskName");
			var tsk_name = TaskNode.getAttribute("TskName");
			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "name", tsk_title);
			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "tname", tsk_name);

			facilis.parsers.ParseInUtils.setSubNodeValue(this.parsedModel, "nameChooser", TaskNode.getAttribute("TskName"));
			
			var values = "<values><value value=\""+TaskNode.getAttribute("TskName")+"\"><level name=\"id\" value=\"" + TaskNode.getAttribute("TskId") + "\" /><level name=\"name\" value=\"" + tsk_name + "\" /><level name=\"label\" value=\"" + tsk_title + "\" /></value></values>"
			var valuesNode = facilis.parsers.ParseInUtils.getParsedNode(values);
			var chooser = facilis.parsers.ParseInUtils.getSubNode(this.parsedModel, "nameChooser");
			chooser.getAttribute("value") = TaskNode.getAttribute("TskName");
			if (chooser) {
                chooser.setAttribute("value", TaskNode.getAttribute("TskName"));
                var oldValues=facilis.parsers.ParseInUtils.getSubNode(chooser, "values");
                if (oldValues) {
                    oldValues.removeNode();
                }
                chooser.appendChild(valuesNode);
            }
        }
    }

    element.getApiaHighlightComments=function () {
        if (TaskNode && this.parsedModel.highlightcomments!=null) {
             this.parsedModel.highlightcomments= TaskNode.getAttribute("highlight_comments");
        }
    }

    element.getTaskSchedule=function () {
        //var TASK_SCHEDULER = this.getToParseSubNode("TASK_SCHEDULER");
        var TASK_SCHEDULER = TaskNode;
        if (this.parsedModel.scheduledTask!=null && TASK_SCHEDULER) {
            this.parsedModel.scheduledTask = {
				tsk_sch_id:TASK_SCHEDULER.getAttribute("TskSchId"),
				asgn_type:TASK_SCHEDULER.getAttribute("AsignType"),
				active_tsk_id:TASK_SCHEDULER.getAttribute("ActiveTskId"),
				active_prc_id:TASK_SCHEDULER.getAttribute("ActivePrcId"),
				active_prc_name:TASK_SCHEDULER.getAttribute("ActivePrcName")
			}
			
        }
    }

    element.getSkipCondition=function () {
        if (TaskNode.getAttribute("SkipTskCond") && this.parsedModel.skipcondition!=null) {
			this.parsedModel.skipcondition=skipCondition;
        }
    }

    element.getProEleId=function () {
        if (this.parsedModel.proeleid!=null) {
            if(this.toParseNode.getAttribute("ProEleId")) {
                this.parsedModel.proeleid= this.toParseNode.getAttribute("ProEleId");
            }else {
                this.parsedModel.proeleid= this.toParseNode.getAttribute("Id");
            }
        }
    }
    
    facilis.parsers.input.Task = facilis.promote(Task, "ActivityElement");
    
}());
