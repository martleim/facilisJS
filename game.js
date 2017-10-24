//function setRootPath(){
	
	facilis.baseUrl="bin/";
	facilis.View.getInstance().rootPath="bin/";
	
//}
//setRootPath();


function isIE(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1 || userAgent.indexOf("Windows NT 10") > -1;
} 

function isFF(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.toLowerCase().indexOf('firefox') > -1;
} 


function init(){
	
    
    if(isIE()){

        function setExtensions(p){
            Object.defineProperty(p,"children",{
                get:function(){

                    var c=[];
                    for(var i=0;i<this.childNodes.length;i++){
                        if(this.childNodes[i].nodeType==1)
                            c.push(this.childNodes[i]);
                    }
                    return c;
                }
            });

            Object.defineProperty(p,"outerHTML",{

                get:function(){
                    var div=document.createElement("div");
                    div.appendChild(this.cloneNode(true));
                    return div.innerHTML;
                }

            });

            Object.defineProperty(p,"firstElementChild",{

                get:function(){
                    return this.children[0];
                }

            });
        }
        setExtensions(XMLDocument.prototype);
        setExtensions(Element.prototype);
    }
    
	facilis.Drag.dragDisable=true;
    loadXpdlExamples();
    facilis.game.WindowManager.getInstance().openModal( { closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/languagePicker.html", title:"Language Selection", footer:'<button type="button" class="btn btn-danger" onclick="closeLanguagePickerModal()">Ok</button>' } );
}

function showWhiteBoardWindow(){
    openedModal=facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px",closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/WhiteboardScoreWindow.html", title:"SCORE", footer:'<button type="button" class="btn btn-danger" onclick="closeMe(this)">'+facilis.LabelManager.getInstance().getLabel("lbl_continue")+'</button>', onLoad:function(modal){
				modal.find("button").attr("modalId",facilis.game.WindowManager.getInstance().lastOpenedModalId);
			} } );
}

var openedModal;
function loadLabels(selectedLanguage){
    facilis.LabelManager.getInstance().addEventListener(facilis.LabelManager.LABELS_LOADED, function(e) { 
        openedModal=facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px",closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/WhiteboardInitWindow.html", title:"Welcome", onClose:function(){
                                                             initNotepad();
                                                        } } );
        initFacilis();
        
    } );
    facilis.LabelManager.getInstance().loadLabels(facilis.game.gameAssetsUrl+"labels_"+selectedLanguage+".json");
}

function initNotepad(){
    $.get(facilis.game.gameAssetsUrl+"screens/notePad.html", null,
        function(data){
            $('body').append($(data.firstChild.outerHTML));
            $('#notePad')[0].style.position="absolute";    
            $('#notePad')[0].style.top="0px";
            $('#notePad').draggable({
                handle: "#handle"
            });
        },
    'xml');

}


function initFacilis() {
    document.getElementById("facilisCanvas").width = window.innerWidth-30;
    document.getElementById("facilisCanvas").height = window.innerHeight-30; 

    var stage = new createjs.Stage("facilisCanvas");
    stage.enableMouseOver(5);
    stage.mouseMoveOutside = true;
    stage.snapToPixelEnabled=true;
    createjs.Touch.enable(stage);

    facilis.ElementAttributeController.getInstance();
    facilis.IconManager.getInstance();

    stage.addChild(facilis.View.getInstance());

    facilis.View.getInstance().init(stage);

    facilis.ElementAttributeController.getInstance();
	
    facilis.game.GameController.getInstance().init();
		

    setTimeout(function(){
    stage.update();  

    createjs.Ticker.on("tick", stage);

    },1200);
  return;
}

function loadXpdl(xpdl){
    facilis.View.getInstance().loadModelString(xpdl);
}
var xpdlExamples={};
function loadXpdlExamples(){
	$.get( "xpdlExamples.json" , function( data ) {
		if(Object.prototype.toString.call(data) !== '[object Array]')
			data=JSON.parse(data);
		
	  xpdlExamples=data;
	});
}

var UrlXpdlLoaded=false;
function loadXpdlUrl(url){
	$.get( url , function( data ) {
		UrlXpdlLoaded=true;
	  facilis.View.getInstance().loadModelString(data);
		if(openedModal)
			facilis.game.WindowManager.getInstance().closeModal(openedModal.attr("id"));
	});
}

function openSampleProcesses(){
	openedModal=facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px",closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/WhiteboardInitWindow.html", title:"Welcome", 						onClose:function(){
    } } );
}