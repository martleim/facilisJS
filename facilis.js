function isIE(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
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
    
    facilis.baseUrl="bin/";
	facilis.View.getInstance().rootPath="bin/";
	//facilis.Drag.dragDisable=true;
    loadLabels();
}


function loadLabels(selectedLanguage){
    //facilis.LabelManager.getInstance().addEventListener(facilis.LabelManager.LABELS_LOADED, function(e) { 
        initFacilis();
        
    /*} );
    facilis.LabelManager.getInstance().loadLabels(facilis.game.gameAssetsUrl+"labels_en.json");*/
}


function initFacilis() {
    document.getElementById("facilisCanvas").width = window.innerWidth-30;
    document.getElementById("facilisCanvas").height = window.innerHeight-30; 
	
	//createjs.Ticker.setFPS(10);

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

    setTimeout(function(){
    stage.update();  

    createjs.Ticker.on("tick", stage);

    },1200);
  return;
}

function loadXpdl(xpdl){
    facilis.View.getInstance().loadModelString(xpdl);
}