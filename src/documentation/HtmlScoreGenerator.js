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