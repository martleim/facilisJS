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