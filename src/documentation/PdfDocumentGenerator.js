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