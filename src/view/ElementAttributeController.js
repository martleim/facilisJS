(function() {

    function ElementAttributeController() {
        //this.url=facilis.baseUrl+"model/elements.json";
        this.url=facilis.View.getInstance().rootPath+"model/elements.xml";
        if (!ElementAttributeController.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

        this.setup();
    }
    
    ElementAttributeController._instance=null;
    ElementAttributeController.allowInstantiation=false;
    ElementAttributeController.getInstance=function(){
        if (facilis.ElementAttributeController._instance == null) {
            ElementAttributeController.allowInstantiation = true;
            ElementAttributeController._instance = new facilis.ElementAttributeController();
            //this._instance.appendMe();
            ElementAttributeController.allowInstantiation = false;
        }
        return ElementAttributeController._instance;
    }
    
    var element = facilis.extend(ElementAttributeController, {});
	
    
    element.setup = function() {
        //this.BaseClassSetup();

    };

	
	element.getElementModel=function(name) {
		var model;
			switch (name){
			case "textannotation":
			model = new facilis.model.TextAnnotation();
			break;
			case "task":
			model = new facilis.model.Task();
			break;
			case "swimlane":
			model = new facilis.model.SwimLane();
			break;
			case "startevent":
			model = new facilis.model.StartEvent();
			break;
			case "sflow":
			model = new facilis.model.Sflow();
			break;
			case "pool":
			model = new facilis.model.Pool();
			break;
			case "baseelement":
			model = new facilis.model.Performer();
			break;
			case "middleevent":
			model = new facilis.model.MiddleEvent();
			break;
			case "mflow":
			model = new facilis.model.Mflow();
			break;
			case "group":
			model = new facilis.model.Group();
			break;
			case "gateway":
			model = new facilis.model.Gateway();
			break;
			case "form":
			model = new facilis.model.Form();
			break;
			case "event":
			model = new facilis.model.Event();
			break;
			case "esubflow":
			model = new facilis.model.ESubflow();
			break;
			case "endevent":
			model = new facilis.model.EndEvent();
			break;
			case "datastore":
			model = new facilis.model.DataStore();
			break;
			case "dataoutput":
			model = new facilis.model.DataOutput();
			break;
			case "dataobject":
			model = new facilis.model.DataObject();
			break;
			case "datainput":
			model = new facilis.model.DataInput();
			break;
			case "csubflow":
			model = new facilis.model.CSubflow();
			break;
			case "esubflow":
			model = new facilis.model.BaseModel();
			break;
			case "baseelement":
			model = new facilis.model.BaseElement();
			break;
			case "back":
			model = new facilis.model.Back();
			break;
			case "association":
			model = new facilis.model.Association();
			break;
		}
		return model;
	}
    

    facilis.ElementAttributeController = facilis.promote(ElementAttributeController, "Object");
    
}());