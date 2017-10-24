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