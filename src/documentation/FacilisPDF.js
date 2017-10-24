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
