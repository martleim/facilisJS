(function() {

    function DocManager() {
    }
    
    
    var element = facilis.extend(DocManager, {});
    
    element.generatePDF(extended, img) {
        var gen = new facilis.documentation.PdfDocumentGenerator();
        if (!gen.testDocumentation()) {
            facilis.AbstractMain.hideWaitMessage();
            facilis.AbstractMain.message("Nothing To Document");
            return;
        }
        facilis.documents.AbstractDocumentator.EXTENDED_DOC = extended;
        facilis.documents.AbstractMain.showWaitMessage();
        if(img){
            gen.setHeaderImage(img);
        }
        setTimeout(function() { 
            gen.getDocumentation();
        }, 500);
    }

    /*public function generateRTF(extended:Boolean, img:BitmapData = null) {
        var gen:RtfDocumentGenerator = new RtfDocumentGenerator();
        if (!gen.testDocumentation()) {
            AbstractMain.hideWaitMessage();
            AbstractMain.message("Nothing To Document");
            return;
        }
        AbstractDocumentator.EXTENDED_DOC = extended;
        if(img){
            gen.setHeaderImage(img);
        }
        AbstractMain.showWaitMessage();
        var timer:Timer = new Timer(500, 1);
        timer.addEventListener(TimerEvent.TIMER_COMPLETE, function(e:TimerEvent) { 
            gen.getDocumentation();
        } );
        timer.start();
    }*/

    facilis.documents.DocManager = facilis.promote(DocManager, "Object");
    
}());