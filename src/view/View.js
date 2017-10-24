(function() {

    function View() {
        this.AbstractMainView_constructor();
        
        if (!View.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

        this.jsCommandDisabled = false;
        this._inApia=false;
        this._offline=false;
        this.scaleWindow=false;

		this._proId="";
		this._proVerId="";
		this._proName="";
		this._envName="";
		
		
        this.copiedElements=[];

        this.mainProcessData=null;
        this._rootPath = "src/";
		
		this.langId="";
		this.bgColor="";

        this.uid = 0;
    }
    
    	
    View.VIEW_CLICK 		="viewClick";
    View.ON_SELECT  		="onSelected";
    View.ON_UNSELECT_ALL	="onUnSelectAll";
    View.ON_DELETE 			="onDeleted";
    View.ON_BEFORE_LOAD 	=	"onBeforeLoad";
    View.ON_LOAD		 	=	"onLoad";
    View.ON_CLEAR		 	=	"onClear";
    View.ON_ZOOM		 	=	"onZoom";
    View.ON_BEFORE_PASTE 	=	"onBeforePaste";
    View.ON_PASTE		 	=	"onPaste";

    View.canDelete = true;
    View.complexDoc = true;
    View.showCircles = false;
    View.importDisconnectedArtifacts = false;
    
    View.max_width=null;
	View.max_height=null;
		
    
    
    View._instance=null;
    View.allowInstantiation=false;
    View.getInstance=function(){
        if (facilis.View._instance == null) {
            View.allowInstantiation = true;
            View._instance = new facilis.View();
            //this._instance.appendMe();
            View.allowInstantiation = false;
        }
        return View._instance;
    }
    
    var element = facilis.extend(View, facilis.AbstractMainView);
    
    element.AbstractMainViewSetup=element.setup;
    element.setup = function() {
        this.AbstractMainViewSetup();
    };


    element.abstractInit=element.init;
    element.init=function(_stage) {
        if(this.stage && !_stage)
            _stage=this.stage;
        
        this.abstractInit(_stage);
		
		facilis.MultiDrag.getInstance().init(this._stage);
		
        if (View.showCircles) {
            /*var mc = new MovieClip();
            mc.graphics.beginFill(0x000000);
            mc.graphics.drawCircle(0, 0, 10);
            mc.graphics.endFill();
            _stage.addChild(mc);
            mc.x = 500;
            mc.addEventListener(MouseEvent.CLICK, function(e:MouseEvent) { 
                View.getInstance().resetElementIds();
                var model = Parser.getInstance().parseOut(View.getInstance().getExportXML());
                trace(model);
                jsCommand("modelOut('"+model+"')");
            } );

            var mc2 = new MovieClip();
            mc2.graphics.beginFill(0x004400);
            mc2.graphics.drawCircle(0, 0, 10);
            mc2.graphics.endFill();
            _stage.addChild(mc2);
            mc2.x = 600;
            mc2.addEventListener(MouseEvent.CLICK, function(e:MouseEvent) { 
                loadModel("model.xpdl");
            } );*/
        }
        
    }
    
    
    element.removeAnElement=function(el) {
        if(el){
            if (el.parent == this.getLaneView()) {
                this.getLaneView().removeElement(el);
            }else {
                this.getElementView().removeElement(el);
            }
        }
    }

    
    element.getUniqueId=function() {
        this.uid++;
        return this.uid;
    }

    
    element.getExportXML=function() { 
        resetElementIds();
        var els= facilis.ElementView.getInstance().getElements();
        var lanes = facilis.LaneView.getInstance().getElements();
        var parents = []
        for (var i = 0; i < els.length; i++ ) {
            var el = (els[i]);
            if (!el.getContainer()) {
                parents.push(el);
            }
        }
        i = 0;
        for (i = 0; i < lanes.length; i++ ) {
            el = (lanes[i]);
            if (!el.getContainer()) {
                parents.push(el);
            }
        }
        i = 0;
        var mainPoolNode = getMainProcessExportData();
        var mainSubElements;
        for (i = 0; i < mainPoolNode.children.length; i++ ) {
            if (mainPoolNode.children[i].nodeName=="subElements") {
                mainSubElements = mainPoolNode.children[i];
            }
        }
        if (!mainSubElements) {
            mainSubElements = new XMLNode(1, "subElements");
        }
        var deps;
        i = 0;
        var u;
        for (i = 0; i < parents.length; i++ ) {
            el = (parents[i]);
            if (el.elementType == "pool") {
                deps = getPoolDependencies(el);
                var poolNode = el.getExportData();
                var subElements = getSubNode(poolNode, "subElements");
                u = 0;
                for (u = 0; u < deps.length; u++ ) {
                    subElements.appendChild((deps[u]).getExportData());
                }
                mainSubElements.appendChild(poolNode);
            }
            //else {
                deps = getElementDepencencies(el);
                u = 0;
                for (u = 0; u < deps.length;u++ ) {
                    mainSubElements.appendChild((deps[u]).getExportData());
                }
                if (el.elementType != "pool") {
                    mainSubElements.appendChild(el.getExportData());
                }
            //}
        }
        mainPoolNode.appendChild(mainSubElements);
        return mainPoolNode;
    }

    element.getParsedModel=function() {
        return Parser.getInstance().parseOut(facilis.View.getInstance().getExportXML());
    }

    element.getPoolDependencies=function(el) {
        var deps = []
        for (var i = 0; i < el.getContents().length; i++) {
            var subEl = el.getContents()[i];
            if (subEl.elementType != "pool") {
                var lines = getElementDepencencies(subEl);
                for ( var u = 0; u < lines.length; u++ ) {
                    if(lines[u]){
                        deps.push(lines[u]);
                    }
                }
            }
        }
        return deps;
    }

    element.getElementDepencencies=function(el) {
        var deps = []
        var data= el.getData();
        var allDeps = facilis.LineView.getInstance().getLinesOf(el);

        var InputSet = new XMLNode(1, "InputSets");
        var OutputSet = new XMLNode(1, "OutputSets");
        var i = 0;
        for (i = 0; i < allDeps.length; i++ ) {
            var line = allDeps[i];
            if (line.getStartElement() == el) {
                var endType = (line.getEndElement()).elementType;
                if (endType == "group" || endType == "dataobject" || endType == "textannotation" ) {
                    var outputset = new XMLNode(1, "OutputSet");
                    var output = new XMLNode(1, "Output");
                    outputset.appendChild(output);
                    output.attributes.ArtifactId=(line.getEndElement()).getData().attributes.id;
                    OutputSet.appendChild(output);
                }
                deps.push(allDeps[i]);
            }else {
                var startType = (line.getStartElement()).elementType;
                if(startType=="group" || startType=="dataobject" || startType=="textannotation" ){
                    var inputset = new XMLNode(1, "InputSet");
                    var input = new XMLNode(1, "Input");
                    inputset.appendChild(input);
                    input.attributes.ArtifactId=(line.getStartElement()).getData().attributes.id;
                    InputSet.appendChild(inputset);
                }
            }
        }
        el.getData().appendChild(OutputSet);
        el.getData().appendChild(InputSet);
        i = 0;
        if (el.elementType != "pool") {
            for (i = 0; i < el.getContents().length; i++ ) {
                var lines = this.getElementDepencencies(el.getContents()[i]);
                for ( var u = 0; u < lines.length; u++ ) {
                    if(lines[u]){
                        deps.push(lines[u]);
                    }
                }
            }
        }
        return deps;
    }

    element.getMainProcessData=function() {
        if (!this.mainProcessData) {
            this.mainProcessData = facilis.ElementAttributeController.getInstance().getElementModel("back");
            this.mainProcessData.id = facilis.View.getInstance().getUniqueId();
            this.mainProcessData.process = facilis.View.getInstance().getUniqueId();
        }
        return this.mainProcessData;
    }

    element.setMainProcessAction=function(type) {
        var back = this.getMainProcessData();
        var bpmn=back.firstElementChild;
        for (var u = 0; u < bpmn.children.length; u++ ) {
            if (bpmn.children[u].getAttribute("name") == "protype") {
                bpmn.children[u].setAttribute("value",type);
            }
        }
        return this.mainProcessData;
    }


    element.resetMainProcessData=function() {
        this.mainProcessData = null;
        this.dispatchEvent(new facilis.Event(facilis.View.VIEW_CLICK));
    }

    element.setMainProcessData=function(main) {
        this.mainProcessData=main;
    }

    element.getMainProcessExportData=function() {
        var node = this.getMainProcessData().cloneNode(true);
        node.attributes.name = "pool";
        return node;
    }


    element.loadModel=function(url) {
        var loader = new createjs.LoadQueue();
        
          loader.addEventListener("fileload", this.loadXML.bind(this));
          loader.loadFile({src:url, type:createjs.AbstractLoader.XML});
        
        /*loader.addEventListener(Event.COMPLETE, loadXML); 
        loader.addEventListener(IOErrorEvent.IO_ERROR,onIOError);
        loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR,onSecurityError);
        loader.load(new URLRequest(url));*/
    }

    element.loadXML=function(evt) {
        this.dispatchEvent(new facilis.Event(facilis.View.ON_DELETE));
        this.dispatchEvent(new facilis.Event(facilis.View.ON_BEFORE_LOAD));
        this.clearAll();
        /*var xDoc = new XMLDocument();
        xDoc.ignoreWhite = true;
        var xml = new XML(evt.target.data);*/
        //var xml = removeNamespaces(evt.target.data);
        var xml = evt.result;
        
        //Parser.getInstance().parseIn(xDoc)
        var p=new facilis.parsers.ParserIn();
        var parsed=p.parse(xml);
        
        //xDoc.parseXML(xml.toString());
        var drawer = new facilis.ModelDrawer();
        drawer.drawModel(parsed);
        //drawer.drawModel(Parser.getInstance().parseIn(xDoc));
		this.selectedElements=[];
        this.dispatchEvent(new facilis.Event(facilis.View.ON_LOAD));
        //flashLoaded();
        //this.dispatchEvent(new facilis.Event(LOADED));

    }

    element.loading_xpdl = false;
		
    element.loadModelString=function(xmlStr) {
        this.dispatchEvent(new facilis.Event(facilis.View.ON_DELETE));
        this.dispatchEvent(new facilis.Event(facilis.View.ON_BEFORE_LOAD));
        this.clearAll();
        if (xmlStr != "") {
			this.loading_xpdl = true;
            /*var xDoc = new XMLDocument();
            xDoc.ignoreWhite = true;
            var xml = new XML(str);
            xDoc.parseXML(xml.toString());*/
            var doc=   ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
            var drawer = new facilis.ModelDrawer();
            //var parsed = Parser.getInstance().parseIn(doc.firstChild);
            
            var p=new facilis.parsers.ParserIn();
            var parsed=p.parse(doc);
            
            drawer.drawModel(parsed);
			this.loading_xpdl = false;
			this.selectedElements=[];
            this.dispatchEvent(new facilis.Event(facilis.View.ON_LOAD));
        }
        //this.flashLoaded();
    }

    element.jsCommand=function(comm) {
        if(!jsCommandDisabled){
            var url = 'javascript:'+comm;
            var request = new URLRequest(url);
            try {
                navigateToURL(request, '_self'); // second argument is target
            } catch (e) {
                trace("Error occurred!");
            }
            //ExternalInterface.call(comm);
        }
    }

    Object.defineProperty(element, 'rootPath', {
        get: function() { 
            return this._rootPath;
        },
        set: function(val) {
            this._rootPath=val;
        }
    });
    
    Object.defineProperty(element, 'inApia', {
        get: function() { 
            return this._inApia;
        },
        set: function(val) {
            this._inApia=val;
        }
    });

    
    Object.defineProperty(element, 'offline', {
        get: function() { 
            return this._offline;
        },
        set: function(val) {
            this._offline=val;
        }
    });
    
    Object.defineProperty(element, 'mainStage', {
        get: function() { 
            return this._mainStage;
        }
    });
	
	Object.defineProperty(element, 'proId', {
        get: function() { 
            return this._proId;
        },
        set: function(val) {
            this._proId=val;
        }
    });
	
	Object.defineProperty(element, 'proVerId', {
        get: function() { 
            return this._proVerId;
        },
        set: function(val) {
            this._proVerId=val;
        }
    });
	
	Object.defineProperty(element, 'proName', {
        get: function() { 
            return this._proName;
        },
        set: function(val) {
            this._proName=val;
        }
    });
	
	Object.defineProperty(element, 'envName', {
        get: function() { 
            return this._envName;
        },
        set: function(val) {
            this._envName=val;
        }
    });


    element.checkDrop=function(mc) {
        if (mc != null) {
            var pt = new facilis.Point(mc.x, mc.y);
            pt = mc.parent.localToGlobal(pt);
            var pt2 = new facilis.Point(mc.x, mc.y);
            pt2 = mc.stage.localToGlobal(pt2);
            for (var i = 0; i < _mainStage.numChildren; i++ ) {
                var test = _mainStage.getChildAt(i);
                if (_mainStage.getChildAt(i).hitTestPoint(pt.x,pt.y,true) &&
                    _mainStage.getChildAt(i)!=scroll
                ) {
                    return false;
                }
            }
            if (WindowManager.getInstance().hitTestPoint(pt.x, pt.y, true)) {
                return false;
            }
            return true;
        }
        return false;
    }

    element.clearAll=function() {
        facilis.LaneView.getInstance().clearAllElementEvents();
        facilis.ElementView.getInstance().clearAllElementEvents();
        facilis.LineView.getInstance().clearAllElementEvents();
        facilis.LaneView.getInstance().clear();
        facilis.ElementView.getInstance().clear();
        facilis.LineView.getInstance().clear();
        this.dispatchEvent(new facilis.Event(facilis.View.ON_CLEAR));
    }

    element.startMainPool=function() {
        /*mainPool= new Element("view.elements.lanes.BackElement");
        mainPool.elementType = "back";
        getLaneView().addElement(mainPool);
        drawBack();*/
        //this.addElement(mainPool);
    }

    element.checkDropIns=function(el) {
        var els=getLaneView().getElements();
        for (var i = 0; i < els.length; i++ ) {
            if ( (els[i]).hitTest(el) && facilis.validation.RuleManager.getInstance().getDropInRules().validate([els[i], el])) {
                return true;
            }
        }
        return false;
    }

    element.getNextElement=function(el) {
        var type = el.elementType;
        var count = 0;
        var els = _instance.getElementView().getElements();
        for (var i = 0; i < els.length;i++ ) {
            if ((els[i]).elementType == type) {
                count++;
            }
        }
        els = _instance.getLaneView().getElements();
        i = 0;
        for (i = 0; i < els.length;i++ ) {
            if ((els[i]).elementType == type) {
                count++;
            }
        }
        return count;
    }

    element.refreshElementAttributes=function() {
        this.dispatchEvent(new facilis.Event(facilis.View.VIEW_CLICK));
        this.dispatchEvent(new facilis.Event(AbstractElement.ELEMENT_CLICKED));
    }

    element.getElements=function() {
        var els = []
        for (var i = 0; i < facilis.ElementView.getInstance().getElements().length;i++ ) {
            els.push(facilis.ElementView.getInstance().getElements()[i]);
        }
        i = 0;
        for (i = 0; i < facilis.LaneView.getInstance().getElements().length;i++ ) {
            els.push(facilis.LaneView.getInstance().getElements()[i]);
        }
        return els;
    }

    element.getElementsAndLines=function() {
        var els = []
        els = els.concat(facilis.ElementView.getInstance().getElements());
        els = els.concat(facilis.LaneView.getInstance().getElements());
        els = els.concat(facilis.LineView.getInstance().getElements());

        return els;
    }

    element.resetElementIds=function() {
        uid = 0;
        var mainData = this.getMainProcessData();
        mainData.attributes.id = View.getInstance().getUniqueId();
        mainData.attributes.process = View.getInstance().getUniqueId();
        for (var i = 0; i < facilis.ElementView.getInstance().getElements().length;i++ ) {
            (facilis.ElementView.getInstance().getElements()[i]).resetId();
        }
        i = 0;
        for (i = 0; i < facilis.LaneView.getInstance().getElements().length;i++ ) {
            (facilis.LaneView.getInstance().getElements()[i]).resetId();
        }
        i = 0;
        for (i = 0; i < facilis.LineView.getInstance().getElements().length;i++ ) {
            (facilis.LineView.getInstance().getElements()[i]).resetId();
        }
    }

    element.copySelectedElements=function() {
        copiedElements = []
        var middleEvents = []
        var pools = []
        var lanes = []
        var data;
        for (var i = 0; i < this.selectedElements.length; i++ ) {
            if ((this.selectedElements[i]).elementType != "pool" &&
            (this.selectedElements[i]).elementType != "middleevent" &&
            (this.selectedElements[i]).elementType != "swimlane"
            ) {
                data = (this.selectedElements[i]).getData().cloneNode(true);
                copiedElements.push(data);
            }
            if ((this.selectedElements[i]).elementType == "middleevent") {
                data = (this.selectedElements[i]).getData().cloneNode(true);
                middleEvents.push(data);
            }
            if ((this.selectedElements[i]).elementType == "pool") {
                data = (this.selectedElements[i]).getData().cloneNode(true);
                pools.push(data);
            }
            if ((this.selectedElements[i]).elementType == "swimlane") {
                data = (this.selectedElements[i]).getData().cloneNode(true);
                lanes.push(data);
            }
        }
        i = 0;
        for (i = 0; i < middleEvents.length; i++ ) {
            copiedElements.push(middleEvents[i]);
        }
        i = 0;
        if(copiedElements.length>0){
            for (i = 0; i < this.selectedLines.length; i++ ) {
                data = (this.selectedLines[i]).getData().cloneNode(true);
                copiedElements.push(data);
            }
        }
        i = 0;
        for (i = 0; i < pools.length; i++ ) {
            copiedElements.push(pools[i]);
        }
        i = 0;
        for (i = 0; i < lanes.length; i++ ) {
            copiedElements.push(lanes[i]);
        }
    }

    element.pasteCopiedElements=function(x, y) {
        this.dispatchEvent(new facilis.Event(facilis.View.ON_BEFORE_PASTE));
        this.unselectAll();
        var els = []
        var toPasteElements = []
        var toPasteLines = []
        var ids = new {};
        var i = 0;
        if(this.copiedElements.length>0){
            var minx = parseInt(this.copiedElements[0].attributes.x) - (parseInt(this.copiedElements[0].attributes.width) / 2);
            var miny = parseInt(this.copiedElements[0].attributes.y) - (parseInt(this.copiedElements[0].attributes.height) / 2);
            for (i = 0; i < this.copiedElements.length; i++ ) {
                if (this.copiedElements[i].attributes.name != "sflow" && this.copiedElements[i].attributes.name != "swimlane" &&  this.copiedElements[i].attributes.name != "mflow" && this.copiedElements[i].attributes.name != "association") {
                    var elX = parseInt(this.copiedElements[i].attributes.x) - (parseInt(this.copiedElements[i].attributes.width) / 2);
                    var elY = parseInt(this.copiedElements[i].attributes.y) - (parseInt(this.copiedElements[i].attributes.height) / 2);
                    if (minx >= elX) {
                        minx = elX;
                    }
                    if (miny >= elY) {
                        miny = elY;
                    }
                }
            }
            var p = new facilis.Point(x, y);
            //p = target.parent.localToGlobal(p);
            p = View.getInstance().getElementView().globalToLocal(p);

            var xDif = (p.x) - (minx);
            var yDif = (p.y) - (miny);
            i = 0;
            for (i = 0; i < this.copiedElements.length; i++ ) {
                var clonedData = this.copiedElements[i].cloneNode(true);
                ids[clonedData.attributes.id] = _instance.getUniqueId();
                clonedData.attributes.id = ids[clonedData.attributes.id];
                if(clonedData.attributes.startid && clonedData.attributes.endid){
                    toPasteLines.push(clonedData);
                }else {
                    clonedData.attributes.x = parseInt(clonedData.attributes.x)+ xDif;
                    clonedData.attributes.y = parseInt(clonedData.attributes.y) + yDif;
                    toPasteElements.push(clonedData);
                }
            }
            var m = new ModelDrawer();
            i = 0;
            for (i = 0; i < toPasteElements.length; i++ ) {
                var el = m.draw(toPasteElements[i]);
                if (el) {
                    els.push(el);
                }
            }
            i = 0;
            for (i = 0; i < toPasteLines.length; i++ ) {
                var toPasteLine = toPasteLines[i];
                toPasteLine.attributes.startid = ids[toPasteLines[i].attributes.startid];
                toPasteLine.attributes.endid = ids[toPasteLines[i].attributes.endid];

                var vertex;
                var u = 0;
                for (u = 0; u < toPasteLine.children.length; u++ ) {
                    if (toPasteLine.children[u].localName=="vertex") {
                        vertex = toPasteLine.children[u];
                        break;
                    }
                }
                u = 0;
                if(vertex){
                    for (u = 0; u < vertex.children.length; u++ ) {
                        vertex.children[u].attributes.XCoordinate = parseInt(vertex.children[u].attributes.XCoordinate) + xDif;
                        vertex.children[u].attributes.YCoordinate = parseInt(vertex.children[u].attributes.YCoordinate) + yDif;
                    }
                }
                var ln = m.draw(toPasteLines[i]);
                if (ln) {
                    els.push(ln);
                }
            }
        }
        this.dispatchEvent(new facilis.Event(facilis.View.ON_PASTE));
        i = 0;
        for (i = 0; i < els.length; i++ ) {
            els[i].dispatchEvent(new facilis.Event(AbstractElement.ELEMENT_ADDED));
        }
        return els;
    }

    element.hasCopiedElements=function() { 
        if(this.copiedElements){
            return (this.copiedElements.length > 0);
        }
        return false;
    }

    element.selectAll=function() {
        var el;
        for (var e = 0; e < this.getElementView().getElements().length; e++ ) {
            el = this.getElementView().getElements()[e];
            el.select();
            this.select(el);
        }
        e = 0;
        for (e = 0; e < getLineView().getElements().length; e++ ) {
            el = this.getLineView().getElements()[e];
            el.select();
            this.select(el);
        }
        e = 0;
        for (e = 0; e < this.getLaneView().getElements().length; e++ ) {
            el = this.getLaneView().getElements()[e];
            el.select();
            this.select(el);
        }

    }

    element.getSubNode=function(n, name) {
        for (var i = 0; i < n.children.length;i++ ) {
            if (((n.children[i]).attributes.name==name || (n.children[i]).nodeName==name) && ( (n.children[i]).attributes.disabled != "true" ) ) {
                return (n.children[i]);
            }
            if (((n.children[i]).attributes.name == name || (n.children[i]).nodeName == name) && ( (n.children[i]).attributes.disabled == "true" ) ) {
                return null;
            }
        }
        i = 0;
        for (i = 0; i < n.children.length; i++ ) {
            if(n.children[i].nodeName!="subElements" && ( (n.children[i]).attributes.disabled != "true" ) ){
                var subNode = getSubNode((n.children[i]), name);
                if (subNode) {
                    return subNode;
                }
            }
        }
        return null;
    }


    element.getMaximizedWidth=function() {
        return this.max_width;
    }

    element.getMaximizedHeight=function() {
        return this.max_height;
    }

    element.setMaximizedWidth=function(m_width) {
        this.max_width = m_width;
    }

    element.setMaximizedHeight=function(m_height) {
        this.max_height = m_height;
    }
    
    
    
    
    facilis.View = facilis.promote(View, "AbstractMainView");
    
    
    
}());