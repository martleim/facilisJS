(function() {

    function FacilisPDF() {
        //this.jsPDF_constructor();
        //this=new jsPDF();
        
        this.pdf=new jsPDF('p', 'pt', 'letter');
        
        //this.pdf.setFont("arial");
        
        
        for(var m in this.pdf)
            this[m]=this.pdf[m];
        
        facilis.EventDispatcher.initialize(this);
        
        //this.margins={bottom:15,top:15,left:15,width:200};
        
        this.margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 550
        }
        
        this.actualPage = 0;
		
		this.isWrapRow = false; 
		this.row = true; 
		this.column = []; 
		this.rowX = 0; 
		this.rowY = 0; 
		this.maxY = 0;
		this.headerCustomImage=null;
		
        /*super(Orientation.PORTRAIT, Unit.MM, Size.A4);
        this.setFontSize(9);
        this.addEventListener(PageEvent.ADDED, addHeaderFooter);*/
        
    }

    var element = facilis.extend(FacilisPDF, {});
    
    element.saveDocument=function(str){
        this.pdf.save(str);
    }
    element.addHeaderFooter=function(e) {
        actualPage++;
        //this.setFont ( new CoreFont(FontFamily.HELVETICA), 10);
        var col = new RGBColor(0x999999);
        
        this.textStyle(col);
        this.addText(actualPage, 195, 290 );
        this.addText("Facilis Documentation", 5, 5);
        col.r = 0;
        col.g = 0;
        col.b = 0;
        this.textStyle(col);
        if (headerCustomImage) {
            var bmp = new Bitmap(headerCustomImage);
            var x = 195 - (bmp.width*.25);
            this.addImage(bmp,null,x,-9,bmp.width*.25,bmp.height*.25,0,.8);
        }
    }

    element.wrapRow=function(){ 
        this.isWrapRow = true; 
        this.row = new Array(0); 
        this.rowX = this.x; 
        this.rowY = this.y; 
        this.maxY = 0; 
    }
    element.addRowie=function(pHeight) { 
        var column; 
        //get the max height 
        for( column in this.row){ 
            var colH  = column.length * pHeight; 
            this.maxY = Math.max(this.maxY,colH); 
        } 
        //check for new page 
        if( this.y + this.maxY > this.pageBreakTrigger && !this.inFooter && this.acceptPageBreak() ) { 
            this.addPage(this.currentOrientation, this.defaultUnit, this.defaultFormat ,currentPage.rotation); 
            this.rowY = this.y; 
        } 
        //set x,y 
        this.x = this.rowX; 

        for(column in this.row){ 
            this.y = this.rowY; 
            for( var cell in column){ 
                    //set styles 
                    cell.addCell(this); 
            } 
            this.x += (column[0]).pWidth; 
        } 

        this.x = this.lMargin; 
        this.y += this.maxY;// + pHeight; 
        this.isWrapRow = false; 
    } 

    element.addWrappedCell=function( pWidth, pHeight, pText, pBorder, pLn, pAlign, pFill, pLink ){ 
        if(this.isWrapRow){ 
            this.column = new Array(0); 
            this.addMultiCell(pWidth, pHeight, pText, pBorder, 'L', pFill); 
            //if this is the last column in a row 
            if( pLn == 1 ){ 
                    this.addRow(pHeight); 
            } 
        } 
    }
    //I wrapped the current addCell calls (in addMutliCell method) into if then statements like this: 
    //override element.addCell2(width = 0, height = 0, text, border = 0, ln = 0, align, fill = 0, link:ILink  = null){
    element.addCell2=function(pWidth, pHeight, b, ln, pFill){
        if(isWrapRow){ 
                var cell  = new PdfCell(pWidth,pHeight,s.substr(j,i-j),b,2,pAlign,pFill); 
                this.column.push( cell ); 
        }else{ 
                this.addCell(pWidth,pHeight,s.substr(j,i-j),b,2,pAlign,pFill); 
        }
        
    }

    element.setCustomImage=function(img) {
        headerCustomImage = img;
    }
    
    element.startHeight=20;
    element.currentHeight=element.startHeight;
    element.lastPage=0;
    element.addMultiCell=function(width, height, text,border,align,filled){
        console.log("this.actualPage "+this.actualPage);
        if(this.currentPage!=this.actualPage){
            this.currentPage=this.actualPage;
            element.currentHeight=element.startHeight;
        }
            
        this.text(20,element.currentHeight,text);
        
        if(height)
            element.currentHeight+=height;
        
    }
    
    element.centeredText = function(txt){
        var fontSize = this.internal.getFontSize();

        var pageWidth = this.internal.pageSize.width;

        var txtWidth = this.getStringUnitWidth(txt)*fontSize/this.internal.scaleFactor;

        var x = ( pageWidth - txtWidth ) / 2;
        var y = this.internal.pageSize.height/2;

        this.text(txt,x,y);
    }
    
    

    facilis.documentation.FacilisPDF = facilis.promote(FacilisPDF, "Object");
    
}());


(function() {

    function AbstractDocumentator() {
        facilis.EventDispatcher.initialize(this);
        
		this.x = 10000;
		this.y = 10000;
		this.x2 = 0;
		this.y2 = 0;
        
        this.headerImage;
    }
    
    AbstractDocumentator.EXTENDED_DOC = true;
		
		
		
    var element = facilis.extend(AbstractDocumentator, {});
    
    element.getTitle=function() {
        var d = facilis.View.getInstance().getMainProcessData();
		
		if(d)
			return (d.nameChooser || d.name || "");
		
        return "";

    }
    
    element.getMainPoolDoc=function() {
        var d = facilis.View.getInstance().getMainProcessData();
        return this.getDataDocumentation(d);

    }

    element.getElementName=function(el) {
        var d = el.getData();
        if (d) {
            return d.name||d.nameChooser;
        }
        return "";
    }

    element.getElementDocumentation=function(el) {
        var d = el.getData();
        return this.getDataDocumentation(d);
    }
    element.getDataDocumentation=function(d) {
        if (d) {
            var documentationNode=d.documentation;
            var formsNode=(AbstractDocumentator.EXTENDED_DOC)?d.forms:null;
            var eventsNode=(AbstractDocumentator.EXTENDED_DOC)?d.events:null;
            var ttype = d.taskType;
            var tperformers=d.performers;
			return this.getDoc(documentationNode, tperformers, formsNode, eventsNode,ttype);
			
        }
        return "";
    }

    element.getPerformers=function(perfs) {
        var perfomers = new Array();
        if (perfs && perfs.children.length>0) {
            for (var i = 0; i < perfs.children.length; i++ ) {
                if(perfs.children[i].nodeName=="values"){
                    var values = perfs.children[i];
                    for (var v = 0; v < values.children.length; v++ ) {
                        if (values.children[v].firstElementChild && values.children[v].firstElementChild.getAttribute("value") && values.children[v].firstElementChild.getAttribute("value") != "") {
                            perfomers.push(values.children[v].firstElementChild.getAttribute("value"));
                        }
                    }
                }
            }
        }
        return perfomers;
    }

    element.getElementType=function(type) {
        switch(type) {
            case "task":
            type = "Task";
            break;
            case "csubflow":
            type = "Collapsed Sub-Process";
            break;
            case "startevent":
            type = "Start Event";
            break;
            case "middleevent":
            type = "Intermediate Event";
            break;
            case "endevent":
            type = "End Event";
            break;
            case "endevent":
            type = "End Event";
            break;
            case "dataobject":
            type = "Data Object";
            break;
            case "group":
            type = "Group";
            break;
            case "textannotation":
            type = "Text Annotation";
            break;
            case "gateway":
            type = "Gateway";
            break;
            case "pool":
            type = "Pool";
            break;
            case "swimlane":
            type = "Lane";
            break;
            case "sflow":
            type = "Sequence Flow";
            break;
            case "association":
            type = "Association";
            break;
            case "back":
            type = "Workflow Process";
            break;
            default:
            type = "";
            break;
        }
        return type;
    }

    element.getOrder=function(type) {
        var order = 0;
        switch(type) {
            case "back":
            order = 1;
            break;
            case "pool":
            order = -1;
            break;
            case "swimlane":
            order = 0;
            break;
            case "task":
            order = 2;
            break;
            case "csubflow":
            order = 3;
            break;
            case "startevent":
            order = 4;
            break;
            case "middleevent":
            order = 5;
            break;
            case "endevent":
            order = 6;
            break;
            case "endevent":
            order = 7;
            break;
            case "dataobject":
            order = 8;
            break;
            case "group":
            order = 9;
            break;
            case "textannotation":
            order = 10;
            break;
            case "gateway":
            order = 11;
            break;
            case "sflow":
            order = 12;
            break;
            case "association":
            order = 13;
            break;
            default:
            order = 14;
            break;
        }
        return order;
    }

	element.canGenerate=function(){
		
		 return facilis.View.getInstance().getElements().length>0;
		
	}
	
    element.generateImageFile=function() {
        facilis.View.getInstance().unselectAll();
        var elements = facilis.View.getInstance().getElements();
        var actualEl = elements[0];
        x = 10000;
        y = 10000;
        x2 = 0;
        y2 = 0;
        elements = elements.concat(facilis.View.getInstance().getLineView().getElements());
        for (var i = 0; i < elements.length; i++ ) {
            if ((elements[i]) instanceof facilis.LineObject) {
                var l = (elements[i]);
                var lx = l.getLineX();
                var lx2 = lx+l.getLineWidth();
                var ly = l.getLineY();
                var ly2 = ly + l.getLineHeight();
                if (x > lx) {
                    x = lx;
                }
                if (y > ly) {
                    y = ly;
                }
                if (x2 < lx2) {
                    x2 = lx2;
                }
                if (y2 < ly2) {
                    y2 = ly2;
                }
            }else if ((elements[i]).elementType != "swimlane") {
                if (x > elements[i].x-(elements[i]._width/2)) {
                    x = elements[i].x-(elements[i]._width/2);
                }
                if (y > elements[i].y-(elements[i]._height/2)) {
                    y = elements[i].y-(elements[i]._height/2);
                }
                if (x2 < (elements[i].x+(elements[i]._width/2))) {
                    x2 = (elements[i].x+(elements[i]._width/2));
                }
                if (y2 < (elements[i].y+(elements[i]._height/2))) {
                    y2 = (elements[i].y+(elements[i]._height/2));
                }
            }
            elements[i].visible = true;
        }
        var imgWidth = (x2 + 20) - x;
        var imgHeight = (y2 + 40) - y;
        x -= 10;
        y -= 10;

        /*var logo = LibraryManager.getInstance().getInstancedObject("BPMNDesignerLogo");
        facilis.View.getInstance().getElementView().addChild(logo);

        logo.scaleX = .5;
        logo.scaleY = .5;
        if (imgWidtht < logo.width) {
            imgWidtht = logo.width + 30;
        }*/
        
        var b=facilis.View.getInstance()._stage.getBounds();
        //facilis.View.getInstance()._stage.cache(b.x,b.y,b.width,b.height);
        facilis.View.getInstance()._stage.cache(x,y,imgWidth,imgHeight);
        var imgData=facilis.View.getInstance()._stage.getCacheDataURL();
        this.generateDocumentationImage({data:imgData,width:imgWidth,height:imgHeight});
        facilis.View.getInstance()._stage.uncache();
        
    }
    element.generateDocumentationImage=function(img) {
    }

    element.getDoc=function(doc,performers, forms, events, type) {
        var objDoc = { };
        if (doc) {
            objDoc.documentation = doc;
        }
        if (type!="" && type!="None") {
            objDoc.type = type;
        }
        if (performers && performers.length>0) {
            objDoc.performers = performers;
        }
        if (forms) {
            objDoc.forms=this.parseFormsDoc(forms);
        }
        if (events) {
            objDoc.events=this.parseEventDoc(events);
        }
        return objDoc;
    }

    element.addedForms=null;

    element.parseFormsDoc=function(forms) {
        var steps = forms;
        var forms = [];
        if (steps) {
            for (var f = 0; f < steps.length; f++ ) {
                var step = steps[f];
				for(var fs in step){
					if(fs.indexOf("forms")>=0)
                		forms=forms.concat(this.parseFormDoc(step[fs]));
				}
            }
        }
        return forms;
    }

    element.parseFormDoc=function(forms) {
        var ret=[];

		if (forms) {
			for (var f = 0; f < forms.length; f++ ) {
				var form = forms[f];
				form = this.getFormElement(form);
				if (form) {
					var formNode = {};
					formNode.name=form.formName;
					formNode.description=form.formDesc;

					if (form.doc) {
						var docValues=form.doc;
						var attsArray = new Array();
						formNode.documentation=[];
						for (var d = 0; d < docValues.length; d++ ) {
							var fieldDoc = docValues[d];

							formNode.documentation.push({

								name:fieldDoc.fname,
								description:fieldDoc.description,
								datatype:fieldDoc.datatype,
								fieldtype:fieldDoc.fieldtype,
								rules:fieldDoc.rules,
								tooltip:fieldDoc.tooltip,
								grid:fieldDoc.grid 
							}
							);

						}
					}

					var evts = this.parseEventDoc(form.frmEvents);
					if (evts) {
						formNode.events=evts;
					}
					ret.push(formNode);
				}
			}
		}

        return ret;
    }

    element.checkAdded=function(el, forms) {
        var id = el.firstElementChild.getAttribute("value");
        for (var i = 0; i < forms.children.length;i++ ) {
            if (forms.children[i].firstElementChild.getAttribute("value") == id) {
                return true;
            }
        }
        return false;

    }

    element.parseEventDoc=function(events){
		if (events) {
			var ret=[];
			for (var e = 0; e < events.length; e++ ) {
				var event = events[e];
				if (event) {
					
					ret.push({
						name:event.evtName,
						description:event.clsDesc,
						className:event.clsName
						
					});
					
				}
			}
			return ret;
		}

        return null;
    }

    element.getSubNodeValue=function(n,name) {
        var node = this.getSubNode(n, name);
        if (node && node.getAttribute("value") && node.getAttribute("value")!="" && node.getAttribute("value")!=undefined && node.getAttribute("value")!="undefined") {
            return node.getAttribute("value");
        }
        return null;
    }

    element.getSubNode=function(n, name){
        for (var i = 0; i < n.children.length;i++ ) {
            if (((n.children[i]).getAttribute("name")==name || (n.children[i]).nodeName==name) && ( (n.children[i]).getAttribute("disabled") != "true" ) ) {
                return (n.children[i]);
            }
            if (((n.children[i]).getAttribute("name") == name || (n.children[i]).nodeName == name) && ( (n.children[i]).getAttribute("disabled") == "true" ) ) {
                return null;
            }
        }
        i = 0;
        for (i = 0; i < n.children.length; i++ ) {
            if(n.children[i].nodeName!="subElements" && ( (n.children[i]).getAttribute("disabled") != "true" ) ){
                var subNode = this.getSubNode((n.children[i]), name);
                if (subNode) {
                    return subNode;
                }
            }
        }
        return null;
    }

    element.parseMainPoolDoc=function() {
        var mpDoc = this.getMainPoolDoc();
        if (mpDoc && ((mpDoc.documentation && mpDoc.documentation!="" && mpDoc.documentation!="undefined") || mpDoc.events)) {
            var title = this.getTitle();
            var title = ((title && title != "" && title != "undefined")?title:"Unnamed Workflow Process");
            return { elementType:"back", name:title, documentation:mpDoc.documentation, events:mpDoc.events };
        }
    }

    element.sortElements=function(elements) {
        var elAux = new Array();
        for (var i = 0; i < elements.length; i++ ) {
            var elType = (elements[i]).elementType;
            var name = this.getElementName((elements[i]));
            var doc = this.getElementDocumentation((elements[i]));
            var docObj = { elementType:elType, name:name };
            if (doc && (doc.documentation || doc.forms || doc.events) && name!="") {
                if(doc.documentation){
                    docObj.documentation = doc.documentation;
                }
                if (doc.forms) {
                    docObj.forms = doc.forms;
                }
                if (doc.events) {
                    docObj.events = doc.events;
                }
                if (doc.type) {
                    docObj.type = doc.type;
                }
                if (doc.performers) {
                    docObj.performers = doc.performers;
                }
                if ((docObj.documentation && docObj.documentation != "" && (docObj.documentation + "" != "undefined")) || docObj.forms || docObj.events){
                    elAux.push( docObj );
                }
            }
        }
        var tmp=this;
        elAux.sort(function(a, b) {
            if (tmp.getOrder(a.elementType) == tmp.getOrder(b.elementType)) {
                return (a.name.localeCompare(b.name));
            }
            return (tmp.getOrder(a.elementType)-tmp.getOrder(b.elementType));
        } );
        return elAux;
    }

    element.testDocumentation=function() {
        if (facilis.View.getInstance().getElements().length == 0) {
            var mpDoc = this.getMainPoolDoc();
            if (mpDoc && (mpDoc.documentation || mpDoc.events)) {
                return true;
            }
            return false;
        }
        return true;
    }

    element.setHeaderImage=function(img) {
        headerImage = img;
    }


    element.getFormElement=function(frm) {
        var id = frm.formId;
        var form = facilis.controller.FormResources.getInstance().getResource(id);
        if (form) {
            return facilis.clone(form,true);
        }
        return null;
    }
    
    

    facilis.documentation.AbstractDocumentator = facilis.promote(AbstractDocumentator, "Object");
    
}());

(function() {

    function PdfDocumentGenerator() {
        this.AbstractDocumentator_constructor();
        
        this.pdf;//:FacilisPDF;
        this.pdfBA;//;
		
		this.formatType = "normal";
        this.baseFont = "helvetica";
        
        this.htmlDoc="";
    }
    

    var element = facilis.extend(PdfDocumentGenerator, facilis.documentation.AbstractDocumentator);
    
    
    element.getDocumentation=function() {
        facilis.View.getInstance().resetZoom();
        //pdf = new FacilisPDF();
        this.pdf=new facilis.documentation.FacilisPDF();
        if (this.headerImage) {
            this.pdf.setCustomImage(this.headerImage);
        }
        var title = this.getTitle();
        this.pdf.setProperties({
            title: (title||'Facilis PDF Documentation'),
            subject: 'Facilis PDF Documentation',		
            author: "Facilis BPMN",
            keywords: "Facilis BPMN",
            creator: "Facilis BPMN"
        });
        /*this.pdf.addEventListener(PageEvent.ADDED, onPageAdded);
        this.pdf.setAuthor("Facilis BPMN");
        this.pdf.setDisplayMode(Display.FULL_PAGE);*/
        //this.pdf.addPage();
        
        this.pdf.setFontSize ( 35 );
        //this.pdf.addMultiCell( 180, 8, ("\n\n\n\n\n\n\n\nDocumentation\n\n" ),0,"center");
        //this.pdf.centeredText("\n\n\n\n\n\n\n\nDocumentation\n\n" );
        this.pdf.centeredText("Documentation");
        this.pdf.addPage();
        //this.htmlDoc+="<br /><br /><br /><br /><br /><br /><br /><br /><br /><center style='font-size:40px'>Documentation</center><p style='page-break-before: always' ></p>";
        var mpDoc = this.getMainPoolDoc();
        if (title && title != "") {
            //this.pdf.setFontSize ( 25 );
            //this.pdf.addMultiCell( 180, 8, (title + "\n" ), 0, "center");
            
        }
        //this.pdf.addPage();
        if (facilis.View.getInstance().getElements().length == 0) {
            if (mpDoc && (mpDoc.documentation || mpDoc.events)) {
                //this.pdf.addPage();
                
                this.htmlDoc+="<center style='font-size:30px'>"+(this.getElementType("back") + "es" )+"</center>";
                title = ((title && title != "" && title != "undefined")?title:"Unnamed Workflow Process");
                //this.generateElementDoc( { elementType:"back", name:title, documentation:mpDoc } );
                this.generateElementDoc( { elementType:"back", name:title, documentation:mpDoc.documentation, events:mpDoc.events } );
                this.savePdf();
                return;
            }
            //Main.hideWaitMessage();
            //Main.message("Nothing To Document");
            return;
        }
        if(facilis.View.getInstance().getElements().length>0){
            this.generateImageFile();
        }else {
            this.savePdf();
        }
    }

    element.generateDocumentationImage=function(img) {
        
        var imgData=img.data;
        var imgW=img.width;
        var imgH=img.height;
        
        var x=0;
        var y=0;
        var w=this.pdf.internal.pageSize.width;
        var h=this.pdf.internal.pageSize.height;
        var angle=0;
        
        if(imgH<imgW){
            //var angle=-90;
            /*imgH=img.width;
            imgW=img.height;*/
        }
        
        //imgH=((imgW*w)/imgH)*(w/h);
        imgH=((w/imgW)*imgH);
        imgW=w;
        
        var b=facilis.View.getInstance()._stage.getBounds();
        
        /*h=b.height*200/b.width;*/
        //var angle=-90;
        y=(h-imgH)/2;
        
        
        this.pdf.addImage({
            imageData : imgData,
            angle     : angle,
            x         : x,
            y         : y,
            w         : imgW,
            h         : imgH
        });
        
        var elements = facilis.View.getInstance().getElements();
        var elAux = new Array();
        if (elements.length > 0) {
            var pageAdded = false;

            var mainDoc = this.parseMainPoolDoc();
            if (mainDoc) {
                elAux.push(mainDoc);
                
                this.pdf.addPage();
                pageAdded = true;
            }

            elAux=elAux.concat(this.sortElements(elements));

            if (elAux.length > 0 && !pageAdded ) {
                this.pdf.addPage();
            }
            elType = "";
            for (i = 0; i < elAux.length; i++ ) {
                if ( elAux[i].elementType != elType ) {
                    elType = elAux[i].elementType;
                    //this.pdf.addMultiCell( 180, 8, "\n");
                    this.htmlDoc+="<br />";
                    /*
                    this.pdf.addMultiCell( 180, 8, (this.getElementType(elType) + ((elType=="back" || elType=="csubflow")?"es":"s") ), 0, "center");*/
                    this.htmlDoc+="<h1>"+(this.getElementType(elType) + ((elType=="back" || elType=="csubflow")?"es":"s") )+"</h1><br />";
                }
                this.generateElementDoc(elAux[i]);
            }
        }

        var lines = facilis.View.getInstance().getLineView().getElements();

        if (lines.length > 0) {
            i = 0;
            elAux=this.sortElements(lines);

            var elType = "";
            for (i = 0; i < elAux.length; i++ ) {
                if ( elAux[i].elementType != elType ) {
                    elType = elAux[i].elementType;
                    //this.pdf.addMultiCell( 180, 8, "\n", 0, "center");
                    this.htmlDoc+="<br />";
                    /*
                    this.pdf.addMultiCell( 180, 8, (this.getElementType(elType) + "s" ), 0, "center");*/
                    this.htmlDoc+="<h1>"+(this.getElementType(elType) + "s" )+"</h1>";
                    this.htmlDoc+="<br />";
                }
                this.generateElementDoc(elAux[i]);
            }
        }
        //this.pdf.end();
        //this.savePdf();
        var tmp=this;
        
        var baseFont=this.baseFont;
        
        this.pdf.setFont(baseFont);
        var div=document.createElement("div");

        div.innerHTML=this.htmlDoc;
        document.body.appendChild(div);
        
        var specialElementHandlers = {
            'TABLE': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-size"]="10px";
                renderer.pdf.setFont(baseFont);
            },
            'TD': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-size"]="10px";
                renderer.pdf.setFont(baseFont);
            },
            'TH': function (element, renderer) {
                alert("TH");
                element.style["font-family"]=baseFont;
                element.style["font-size"]="10px";
                renderer.pdf.setFont(baseFont);
            },
            'P': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-size"]="14px";
                renderer.pdf.setFont(baseFont);
            },
            'H1': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-style"]="bold";
                element.style["font-size"]="28px";
                renderer.pdf.setFont(baseFont);
            },
            'H2': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-style"]="bold";
                element.style["font-size"]="22px";
                renderer.pdf.setFont(baseFont);
            },
            'H3': function (element, renderer) {
                element.style["font-family"]=baseFont;
                element.style["font-style"]="";
                element.style["font-size"]="20px";
                renderer.pdf.setFont(baseFont);
            }
        };
        this.pdf.cellInitialize();
        this.pdf.fromHTML(div,
                          this.pdf.margins.left,
                          this.pdf.margins.top,{
                    'width':this.pdf.margins.width,
                    'elementHandlers': specialElementHandlers
        },
        function (dispose) {
            $.each(tmp.pdf.internal.pages, function (index, value) {
                if (value) {
                    $.each(value, function (innerIndex, innerValue) {
                        var continueAfterThis = true;
                        if (innerValue.indexOf('$page$') > -1) {
                            value[innerIndex] = innerValue.replace('$page$', index);
                            continueAfterThis = false;
                        }
                        return continueAfterThis;
                    });
                }
            });
            document.body.removeChild(div);
            tmp.pdf.saveDocument('Documentation.pdf');
            facilis.View.getInstance()._stage.uncache();
          },
        this.pdf.margins);
        //this.pdf.save('test.pdf');
    }

    element.savePdf=function() {
        var ba = this.pdf.save(Method.LOCAL, "", "", "documentacion.pdf");
        var fileTo = new FileReference();
        facilis.AbstractMain.hideWaitMessage();
        fileTo.addEventListener(Event.COMPLETE, function(e) {
            facilis.AbstractMain.hideWaitMessage();
            facilis.AbstractMain.message("Documentation Generated OK");
        });
        fileTo.addEventListener(Event.CANCEL, function(e) {
            facilis.AbstractMain.hideWaitMessage();
            facilis.AbstractMain.message("Documentation Not Saved");
        });
        fileTo.addEventListener(IOErrorEvent.IO_ERROR, function(e) {
            facilis.AbstractMain.hideWaitMessage();
            facilis.AbstractMain.message("Error writing the File: check if it's been closed.");
        });
        facilis.AbstractMain.showWaitMessage();
        fileTo.save(ba, "documentation.pdf");
    }

    element.getGeneratedPDF=function() {
        return this.pdf;
    }

    element.generateElementDoc=function(el) {
        
        if(el){
            var type = this.getElementType(el.elementType);
            if (type == "") {
                return;
            }
            //var name = getElementName(el);
            //var doc = getElementDocumentation(el);
            var name = el.name;
            var doc = el.documentation;
            var forms = el.forms;
            var events = el.events;
            var tType = el.type;
            var tPerformers = el.performers;
            if (((doc && doc != "" && (doc + "" != "undefined")) || forms || events) && (name && name!="")) {
                this.htmlDoc+="<br />";
                //this.htmlDoc+="<div>";
                this.htmlDoc+="<div><h2>"+(" - " + ((name && name!="")?name:"Unnamed "+type)   )+"</h2></div>";
                this.htmlDoc+="<br />";
				if(tType)
                	this.htmlDoc+="<h3>"+("Type: "+tType)+"</h3>";
				
                if (tPerformers) {
                    if (tPerformers && tPerformers.length > 0) {
                        for (var p = 0; p < tPerformers.length; p++ ) {
                            this.htmlDoc+="<h4>"+("Performer: "+tPerformers[p].name)+"</h4>";
                        }
                    }
                }
                
                if((doc && doc != "" && (doc + "" != "undefined"))){
                    this.htmlDoc+="<br />";
                    var lines = doc.split("\n"/*String.fromCharCode(13)*/);
                    for (var i = 0; i < lines.length;i++ ) {
                        //this.htmlDoc+="<b>"+(lines[i])+"</b>";
                        var b=document.createElement("p");
                        //b.innerText=lines[i];
                        b.appendChild(document.createTextNode(lines[i]));
                        this.htmlDoc+=b.outerHTML;
                    }
                }
                
                if (forms) {
                    this.drawFormGrid(forms);
                }
                if (events) {
                    this.drawEventGrid(events);
                }
                
                //this.htmlDoc+="</div>";
                
            }
        }
    }

    element.drawFormGrid=function(forms) {
        if (forms && forms.length > 0) {
            
            this.htmlDoc+="<div><h3>Forms:</h3></div><br />";
                        
            
            for (var i = 0; i < forms.length; i++ ) {
                var form = forms[i];
                var name = form.name;
                var desc = form.description;
                this.htmlDoc+="<div>Name:"+name+"</div><br />";
                this.htmlDoc+="<div>Title: "+desc+"</div><br /><br />";
                
				if(form.documentation){
					var data=[];
					for (var d = 0; d < form.documentation.length; d++ ) {
						data.push({
							name:this.encodeHTML(form.documentation[d].name),
							description:this.encodeHTML(form.documentation[d].description),
							tooltip:this.encodeHTML(form.documentation[d].tooltip),
							fieldtype:this.encodeHTML(form.documentation[d].fieldtype),
							datatype:this.encodeHTML(form.documentation[d].datatype),
							rules:this.encodeHTML(form.documentation[d].rules),
							grid:this.encodeHTML(form.documentation[d].grid),
						});
					}


					this.addGrid(data, 180, [{name:"name",label:"Attribute Name"},{name:"description",label:"Label"},{name:"tooltip",label:"Tooltip"},{name:"fieldtype",label:"Field Type"},{name:"datatype",label:"Data Type"},{name:"rules",label:"Regular Expression"},{name:"grid",label:"Grid"}], [16,14,14,14,14,14,14]);
				}
				var evts=form.events;
                if(evts){
                    this.drawEventGrid(evts, "");
                }
            }
        }
    }
    
    element.addGrid=function(data,width, cols,colWidths) {
        var html="";
        
        html+="<table>";
        var htmlCols="<colgroup>";
        var ths="<thead>";
        var body="<tbody>";
        
        if (data && data.length > 0) {
            var columns = new Array();
            for (var i = 0; i < cols.length; i++ ) {
                htmlCols+="<col width='"+colWidths[i]+"%' />"
                ths+="<th>"+cols[i].label+"</th>";
            }
            htmlCols+="</colgroup>";
            for(var i=0;i<data.length;i++){
                body+="<tr>";
                
                var tr=data[i];
                for (var col = 0; col < cols.length; col++ ) {
                    body+="<td>"+tr[cols[col].name]+"</td>";
                }
                
                body+="</tr>";
            }
            
            ths+="</thead>";
            body+="</tbody>";
            html+=htmlCols+ths+body+"</table>";
        }
        this.htmlDoc+=html;
    }

    element.drawEventGrid=function(events,title) {
        title=title||"Events";
        if (events.length > 0) {
            if (title != "") {
                this.htmlDoc+="<div><h3>"+title+"</h3></div><br /><br />";
            }
            

            var data=events;

            this.addGrid(data, 200, [{name:"name",label:"Event"},{name:"className",label:"Business Class"},{name:"description",label:"Business Class Description"}], [20, 20, 60]);
            
            //this.htmlDoc+="<br />";
        }
    }
    
    element.encodeHTML=function(value){
        return document.createElement( 'a' ).appendChild( document.createTextNode( value ) ).parentNode.innerHTML;
    }

    
    facilis.documentation.PdfDocumentGenerator = facilis.promote(PdfDocumentGenerator, "AbstractDocumentator");
    
}());

(function() {

    function HtmlDocumentGenerator() {
        this.AbstractDocumentator_constructor();
		
		this.formatType = "normal";
        this.baseFont = "helvetica";
        
        this.rawHtmlDoc="";
		this.htmlDoc="";
    }
    

    var element = facilis.extend(HtmlDocumentGenerator, facilis.documentation.AbstractDocumentator);
    
    
    element.getDocumentation=function() {
        facilis.View.getInstance().resetZoom();
        var title = this.getTitle();
		
		var mpDoc = this.getMainPoolDoc();

		if (facilis.View.getInstance().getElements().length == 0) {
            if (mpDoc && (mpDoc.documentation || mpDoc.events)) {
                this.rawHtmlDoc+="<center style='font-size:30px'>"+(this.getElementType("back") + "es" )+"</center>";
                title = ((title && title != "" && title != "undefined")?title:"Unnamed Workflow Process");
                this.generateElementDoc( { elementType:"back", name:title, documentation:mpDoc.documentation, events:mpDoc.events } );
                return;
            }
            return;
        }
        if(facilis.View.getInstance().getElements().length>0){
            this.generateImageFile();
        }
    }

    element.generateDocumentationImage=function(img) {
        
        var imgData=img.data;
        var imgW=img.width;
        var imgH=img.height;
		
		//this.rawHtmlDoc+="<div style='page-break-after: always; ' class='page'><div><h1 style='text-align:center;'>"+facilis.LabelManager.getInstance().getLabel("lbl_documentation")+"<h1></div></div>";
		
		var printStyle="<style>@media print { html, body, .page { height: 100%; padding: 0; margin: 0;  } } .page {  width: 100%;  display: table;  vertical-align: middle;  border: 0px solid; } .centered {  vertical-align: middle;  display: table-cell; } .content { text-align:center; margin: auto;  border: 0px solid; } img { width:100% } th { background-color: grey; border: 1px solid black; } td { border: 1px solid black; } table { border-spacing: 0px; } </style>";
		
		this.rawHtmlDoc+=printStyle;
		
		this.rawHtmlDoc+='<div class="page"><div class="centered"><div class="content"><h1>'+facilis.LabelManager.getInstance().getLabel("lbl_documentation")+'<h1></div></div></div>';
		
		this.rawHtmlDoc+='<div class="page"><div class="centered"><div class="content"><img class="docImage" src="'+img.data+'" /></div></div></div>';
		
		var elements = facilis.View.getInstance().getElements();
        var elAux = new Array();
        if (elements.length > 0) {
            var pageAdded = false;

            var mainDoc = this.parseMainPoolDoc();
            if (mainDoc) {
                elAux.push(mainDoc);
                
                pageAdded = true;
            }

            elAux=elAux.concat(this.sortElements(elements));

            elType = "";
            for (i = 0; i < elAux.length; i++ ) {
                if ( elAux[i].elementType != elType ) {
                    elType = elAux[i].elementType;
                    this.rawHtmlDoc+="<br>";
                    this.rawHtmlDoc+="<h1>"+(this.getElementType(elType) + ((elType=="back" || elType=="csubflow")?"es":"s") )+"</h1><br>";
                }
                this.generateElementDoc(elAux[i]);
            }
        }

        var lines = facilis.View.getInstance().getLineView().getElements();

        if (lines.length > 0) {
            i = 0;
            elAux=this.sortElements(lines);

            var elType = "";
            for (i = 0; i < elAux.length; i++ ) {
                if ( elAux[i].elementType != elType ) {
                    elType = elAux[i].elementType;
                    this.rawHtmlDoc+="<br>";
                    this.rawHtmlDoc+="<h1>"+(this.getElementType(elType) + "s" )+"</h1>";
                    this.rawHtmlDoc+="<br>";
                }
                this.generateElementDoc(elAux[i]);
            }
        }
        
        
        
		this.htmlDoc=document.createElement("div");

        this.htmlDoc=this.rawHtmlDoc;
        
        
    }


    element.getGeneratedHtml=function() {
        return this.htmlDoc;
    }

    element.generateElementDoc=function(el) {
        
        if(el){
            var type = this.getElementType(el.elementType);
            if (type == "") {
                return;
            }
            //var name = getElementName(el);
            //var doc = getElementDocumentation(el);
            var name = el.name;
            var doc = el.documentation;
            var forms = el.forms;
            var events = el.events;
            var tType = el.type;
            var tPerformers = el.performers;
            if (((doc && doc != "" && (doc + "" != "undefined")) || forms || events) && (name && name!="")) {
                this.rawHtmlDoc+="<br />";
                //this.rawHtmlDoc+="<div>";
                this.rawHtmlDoc+="<div><h2>"+(" - " + ((name && name!="")?name:"Unnamed "+type)   )+"</h2></div>";
                this.rawHtmlDoc+="<br />";
				if(tType)
                	this.rawHtmlDoc+="<h3>"+("Type: "+tType)+"</h3>";
				
                if (tPerformers) {
                    if (tPerformers && tPerformers.length > 0) {
                        for (var p = 0; p < tPerformers.length; p++ ) {
                            this.rawHtmlDoc+="<h4>"+("Performer: "+tPerformers[p].name)+"</h4>";
                        }
                    }
                }
                
                if((doc && doc != "" && (doc + "" != "undefined"))){
                    this.rawHtmlDoc+="<br />";
                    var lines = doc.split("\n"/*String.fromCharCode(13)*/);
                    for (var i = 0; i < lines.length;i++ ) {
                        //this.rawHtmlDoc+="<b>"+(lines[i])+"</b>";
                        var b=document.createElement("p");
                        //b.innerText=lines[i];
                        b.appendChild(document.createTextNode(lines[i]));
                        this.rawHtmlDoc+=b.outerHTML;
                    }
                }
                
                if (forms) {
                    this.drawFormGrid(forms);
                }
                if (events) {
                    this.drawEventGrid(events);
                }
                
                //this.rawHtmlDoc+="</div>";
                
            }
        }
    }

    element.drawFormGrid=function(forms) {
        if (forms && forms.length > 0) {
            
            this.rawHtmlDoc+="<div><h3>Forms:</h3></div><br />";
                        
            
            for (var i = 0; i < forms.length; i++ ) {
                var form = forms[i];
                var name = form.name;
                var desc = form.description;
                this.rawHtmlDoc+="<div>Name:"+name+"</div><br />";
                this.rawHtmlDoc+="<div>Title: "+desc+"</div><br /><br />";
                
				if(form.documentation){
					var data=[];
					for (var d = 0; d < form.documentation.length; d++ ) {
						data.push({
							name:this.encodeHTML(form.documentation[d].name),
							description:this.encodeHTML(form.documentation[d].description),
							tooltip:this.encodeHTML(form.documentation[d].tooltip),
							fieldtype:this.encodeHTML(form.documentation[d].fieldtype),
							datatype:this.encodeHTML(form.documentation[d].datatype),
							rules:this.encodeHTML(form.documentation[d].rules),
							grid:this.encodeHTML(form.documentation[d].grid),
						});
					}


					this.addGrid(data, 180, [{name:"name",label:"Attribute Name"},{name:"description",label:"Label"},{name:"tooltip",label:"Tooltip"},{name:"fieldtype",label:"Field Type"},{name:"datatype",label:"Data Type"},{name:"rules",label:"Regular Expression"},{name:"grid",label:"Grid"}], [16,14,14,14,14,14,14]);
				}
				var evts=form.events;
                if(evts){
                    this.drawEventGrid(evts, "");
                }
            }
        }
    }
    
    element.addGrid=function(data,width, cols,colWidths) {
        var html="";
        
        html+="<table>";
        var htmlCols="<colgroup>";
        var ths="<thead>";
        var body="<tbody>";
        
        if (data && data.length > 0) {
            var columns = new Array();
            for (var i = 0; i < cols.length; i++ ) {
                htmlCols+="<col width='"+colWidths[i]+"%' />"
                ths+="<th>"+cols[i].label+"</th>";
            }
            htmlCols+="</colgroup>";
            for(var i=0;i<data.length;i++){
                body+="<tr>";
                
                var tr=data[i];
                for (var col = 0; col < cols.length; col++ ) {
                    body+="<td>"+tr[cols[col].name]+"</td>";
                }
                
                body+="</tr>";
            }
            
            ths+="</thead>";
            body+="</tbody>";
            html+=htmlCols+ths+body+"</table>";
        }
        this.rawHtmlDoc+=html;
    }

    element.drawEventGrid=function(events,title) {
        title=title||"Events";
        if (events.length > 0) {
            if (title != "") {
                this.rawHtmlDoc+="<div><h3>"+title+"</h3></div><br /><br />";
            }
            

            var data=events;

            this.addGrid(data, 200, [{name:"name",label:"Event"},{name:"className",label:"Business Class"},{name:"description",label:"Business Class Description"}], [20, 20, 60]);
            
            //this.rawHtmlDoc+="<br />";
        }
    }
    
    element.encodeHTML=function(value){
        return document.createElement( 'a' ).appendChild( document.createTextNode( value ) ).parentNode.innerHTML;
    }

    
    facilis.documentation.HtmlDocumentGenerator = facilis.promote(HtmlDocumentGenerator, "AbstractDocumentator");
    
}());

(function() {

    function PdfScoreGenerator() {
        this.BaseElement_constructor();

        this.pdf;
        this.htmlDoc="";
        
        this.setup();
    }
    
    
    
    var element = facilis.extend(PdfScoreGenerator, {});

    element.setup = function() {
        //this.BaseClassSetup();
    };
    
    element.saveScorePDF=function(name, scoreDiv, details) {
        
        this.details=details;
        this.name=name;

        this.pdf=new facilis.documentation.FacilisPDF();
        if (this.headerImage) {
            this.pdf.setCustomImage(this.headerImage);
        }
        
        this.pdf.setProperties({
            title: ('Facilis PDF Documentation'),
            subject: 'Facilis PDF Documentation',		
            author: "Facilis BPMN",
            keywords: "Facilis BPMN",
            creator: "Facilis BPMN"
        });

        
        this.generateDocumentationImage(scoreDiv);
        
    }
    
    element.generateDocumentationImage=function(div) {

		
		var imgW=750;//div.clientWidth;
        var imgH=560;//div.clientHeight;

        



        var canvas=document.createElement("canvas");
        canvas.width=imgW;
        canvas.height=imgH;
        document.body.appendChild(canvas);
        
		var context = canvas.getContext('2d');
		var tmp=this;

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
            context.drawImage(this, 0, 0);
			
			var titleLabel=div.querySelector("#titleLabel");
			var scoreTable=div.querySelectorAll(".scoreTable tr");
			var totalTable=div.querySelectorAll(".totalTable td");
			var y = 160;
			var x = 100;
			
			context.fillStyle="#0000FF";
			context.font="32px PassingNotes";
			
			context.fillText(titleLabel.innerHTML,x,80);
			
			x+=35;
			context.font="22px PassingNotes";
			context.fillText(facilis.LabelManager.getInstance().getLabel("lbl_playername") +": "+facilis.game.ScoreCalculator.userName,x,120);
			
			context.font="28px PassingNotes";
			for(var t =0;t<scoreTable.length;t++){
				var tr=scoreTable[t];
				var tds=tr.querySelectorAll("td");
				var scoreText="";
				for(var t2=0;t2<tds.length;t2++){
					var td=tds[t2];
					scoreText+=td.innerHTML+"   ";
				}
					
				context.fillText(scoreText,x,y);
				y+=30;
			}
			y+=30;
			
			for(var t =0;t<totalTable.length;t++){
				var td=totalTable[t];
				context.fillText(td.innerHTML,x,y);
				y+=40;
			}
			
			




			tmp.documentationImageReady({data:canvas.toDataURL("image/png"), width:imgW, height:imgH});
			document.body.removeChild(canvas);
			
        };

        imageObj.src = "gameAssets/gameover.png";
		

        


        return;
        
    }
        
    element.documentationImageReady=function(img){
        
		
        var imgW=img.width;
        var imgH=img.height;
        var imgData=img.data;
        
        var x=0;
        var y=0;
        var w=this.pdf.internal.pageSize.width;
        var h=this.pdf.internal.pageSize.height;
        var angle=0;
        
        imgH=((w/imgW)*imgH);
        imgW=w;
        
        var b=facilis.View.getInstance()._stage.getBounds();
        
        y=(h-imgH)/2;
        
        
        this.pdf.addImage({
            imageData : imgData,
            angle     : angle,
            x         : x,
            y         : y,
            w         : imgW,
            h         : imgH
        });
        
        this.savePdf();
    }

    element.getMode=function() {
        if (facilis.game.GameController.getInstance().gameMode == facilis.game.GameController.MODE_DESCRIPTION) {
            return facilis.LabelManager.getInstance().getLabel("lbl_taskDesc");
        }
        if (facilis.game.GameController.getInstance().gameMode == facilis.game.GameController.MODE_NAME) {
            return facilis.LabelManager.getInstance().getLabel("lbl_taskName");
        }
        return facilis.LabelManager.getInstance().getLabel("lbl_taskPerf");

    }

    element.savePdf=function() {
        this.pdf.addPage();

        this.htmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_process") + ": " + (this.getProcessName() || "Unnamed Process")+"</p>";
        this.htmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_mode")+": "+this.getMode()+"</p>";

        this.drawGrid(this.details);
        
        var div=document.createElement("div");

        div.innerHTML=this.htmlDoc;
        document.body.appendChild(div);
        var tmp=this;
        
        var specialElementHandlers = {
            '#editor': function( element, renderer ) {
                return true;
            }
        };
        
        this.pdf.fromHTML(div,this.pdf.margins.left,
                          this.pdf.margins.top,{
            width:180,
            elementHandlers: specialElementHandlers
        },
        function (dispose) {
            document.body.removeChild(div);
            tmp.pdf.saveDocument('Score.pdf');
          },
        this.pdf.margins);
    }

    element.getGeneratedPDF=function() {
        return this.pdf;
    }

    element.drawGrid=function(details) {
        
        //this.pdf.addMultiCell( 180, 8, (facilis.LabelManager.getInstance().getLabel("lbl_answers")+"\n" ), 0, Align.LEFT);
        this.htmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_answers")+": </p>";
        var data = facilis.game.ScoreCalculator.details;
        if (data.length > 0) {
            this.addGrid(data, 180, [facilis.LabelManager.getInstance().getLabel("lbl_element"), facilis.LabelManager.getInstance().getLabel("lbl_correct"), facilis.LabelManager.getInstance().getLabel("lbl_errors"), facilis.LabelManager.getInstance().getLabel("lbl_bonus")], [90, 30, 30, 30]);
        }
        //this.pdf.addMultiCell( 180, 8, "\n");
    }

    element.addGrid=function(data,width, cols,colWidths) {
        var html="";
        
        html+="<div><table>";
        var htmlCols="<colgroup>";
        var ths="<thead>";
        var body="<tbody>";
        
        if (data && data.length > 0) {
            var columns = new Array();
            for (var i = 0; i < cols.length; i++ ) {
                htmlCols+="<col width='"+colWidths[i]+"%' />"
                ths+="<th>"+cols[i]+"</th>";
            }
            htmlCols+="</colgroup>";
            for(var i=0;i<data.length;i++){
                body+="<tr>";
                
                var tr=data[i];
                for (var col = 0; col < cols.length; col++ ) {
                    body+="<td>"+tr[cols[col]]+"</td>";
                }
                
                body+="</tr>";
            }
            
            ths+="</thead>";
            body+="</tbody>";
            html+=/*htmlCols+*/ths+body+"</table></div>";
        }
        this.htmlDoc+=html;
    }

    element.onPageAdded=function(e) {

    }

    element.getProcessName=function() {
        return facilis.game.ScoreCalculator.processName;
    }


    facilis.documentation.PdfScoreGenerator = facilis.promote(PdfScoreGenerator, "BaseElement");
    
}());

(function() {

    function HtmlScoreGenerator() {
        this.BaseElement_constructor();

        this.rawHtmlDoc="";
		this.htmlDoc="";
        
		facilis.EventDispatcher.initialize(this);
        this.setup();
    }
    
	
	HtmlScoreGenerator.DOC_READY = "DOC_READY";
    
    var element = facilis.extend(HtmlScoreGenerator, {});

    element.setup = function() {
        //this.BaseClassSetup();
    };
    
    element.generateScoreHtml=function(name, scoreDiv, details) {
        
        this.details=details;
        this.name=name;

		this.generateDocumentationImage(scoreDiv);
        
    }
    
    element.generateDocumentationImage=function(div) {

		
		var imgW=750;//div.clientWidth;
        var imgH=560;//div.clientHeight;
        
        var canvas=document.createElement("canvas");
        canvas.width=imgW;
        canvas.height=imgH;
        document.body.appendChild(canvas);
        
		var context = canvas.getContext('2d');
		var tmp=this;

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
            context.drawImage(this, 0, 0);
			
			var titleLabel=div.querySelector("#titleLabel");
			var scoreTable=div.querySelectorAll(".scoreTable tr");
			var totalTable=div.querySelectorAll(".totalTable td");
			var y = 160;
			var x = 100;
			
			context.fillStyle="#0000FF";
			context.font="28px PassingNotes";
			
			context.fillText(titleLabel.innerHTML,50,80);
			
			x+=35;
			context.font="22px PassingNotes";
			context.fillText(facilis.LabelManager.getInstance().getLabel("lbl_playername") +": "+facilis.game.ScoreCalculator.userName,x,120);
			
			context.font="26px PassingNotes";
			for(var t =0;t<scoreTable.length;t++){
				var tr=scoreTable[t];
				var tds=tr.querySelectorAll("td");
				var scoreText="";
				for(var t2=0;t2<tds.length;t2++){
					var td=tds[t2];
					if(t2!=1)
						scoreText+=td.innerHTML+((t2==0)?" :  ":"");
					
				}
					
				context.fillText(scoreText,x,y);
				y+=30;
			}
			y+=30;
			
			for(var t =0;t<totalTable.length;t++){
				var td=totalTable[t];
				context.fillText(td.innerHTML,x,y);
				y+=40;
			}
			
			
			tmp.documentationImageReady({data:canvas.toDataURL("image/png"), width:imgW, height:imgH});
			document.body.removeChild(canvas);
			
        };

        imageObj.src = "gameAssets/gameover.png";
		
        
        return;
        
    }
        
    element.documentationImageReady=function(img){
        
		
        var imgW=img.width;
        var imgH=img.height;
        var imgData=img.data;
        
		var printStyle="<style>@media print { html, body, .page { height: 100%; padding: 0; margin: 0;  } } .page {  width: 100%;  display: table;  vertical-align: middle;  border: 0px solid; } .centered {  vertical-align: middle;  display: table-cell; } .content { text-align:center; margin: auto;  border: 0px solid; } img { width:100% } th { background-color: grey; border: 1px solid black; } td { border: 1px solid black; } table { border-spacing: 0px; } </style>";
		
		this.rawHtmlDoc+=printStyle;
		
		this.rawHtmlDoc+='<div class="page"><div class="centered"><div class="content"><img class="docImage" src="'+img.data+'" /></div></div></div>';
        

        this.rawHtmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_process") + ": " + (this.getProcessName() || "Unnamed Process")+"</p>";
        this.rawHtmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_mode")+": "+this.getMode()+"</p>";

        this.drawGrid(this.details);
        
        this.htmlDoc=document.createElement("div");

        this.htmlDoc.innerHTML=this.rawHtmlDoc;
		this.dispatchEvent(new facilis.Event(facilis.documentation.HtmlScoreGenerator.DOC_READY));
        
    }
	
	element.getGeneratedHtml=function() {
        return this.htmlDoc;
    }

	
	

    element.getMode=function() {
        if (facilis.game.GameController.getInstance().gameMode == facilis.game.GameController.MODE_DESCRIPTION) {
            return facilis.LabelManager.getInstance().getLabel("lbl_taskDesc");
        }
        if (facilis.game.GameController.getInstance().gameMode == facilis.game.GameController.MODE_NAME) {
            return facilis.LabelManager.getInstance().getLabel("lbl_taskName");
        }
        return facilis.LabelManager.getInstance().getLabel("lbl_taskPerf");

    }


    element.drawGrid=function(details) {
        
        this.rawHtmlDoc+="<p>"+facilis.LabelManager.getInstance().getLabel("lbl_answers")+": </p>";
        var data = facilis.game.ScoreCalculator.details;
        if (data.length > 0) {
            this.addGrid(data, 180, [facilis.LabelManager.getInstance().getLabel("lbl_element"), facilis.LabelManager.getInstance().getLabel("lbl_correct"), facilis.LabelManager.getInstance().getLabel("lbl_errors"), facilis.LabelManager.getInstance().getLabel("lbl_bonus")], [90, 30, 30, 30]);
        }

    }

    element.addGrid=function(data,width, cols,colWidths) {
        var html="";
        
        html+="<div><table>";
        var htmlCols="<colgroup>";
        var ths="<thead>";
        var body="<tbody>";
        
        if (data && data.length > 0) {
            var columns = new Array();
            for (var i = 0; i < cols.length; i++ ) {
                htmlCols+="<col width='"+colWidths[i]+"%' />"
                ths+="<th>"+cols[i]+"</th>";
            }
            htmlCols+="</colgroup>";
            for(var i=0;i<data.length;i++){
                body+="<tr>";
                
                var tr=data[i];
                for (var col = 0; col < cols.length; col++ ) {
                    body+="<td>"+tr[cols[col]]+"</td>";
                }
                
                body+="</tr>";
            }
            
            ths+="</thead>";
            body+="</tbody>";
            html+=/*htmlCols+*/ths+body+"</table></div>";
        }
        this.rawHtmlDoc+=html;
    }

    element.onPageAdded=function(e) {

    }

    element.getProcessName=function() {
        return facilis.game.ScoreCalculator.processName;
    }


    facilis.documentation.HtmlScoreGenerator = facilis.promote(HtmlScoreGenerator, "BaseElement");
    
}());

