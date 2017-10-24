            
function init(){
	facilis.Drag.dragDisable=true;
    facilis.game.WindowManager.getInstance().openModal( { closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/languagePicker.html", title:"Language Selection", footer:'<button type="button" class="btn btn-danger" onclick="closeLanguagePickerModal()">Ok</button>' } );
}

function showWhiteBoardWindow(){
    facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px",closeButton:true, contentUrl:facilis.game.gameAssetsUrl+"screens/WhiteboardScoreWindow.html", title:"SCORE" } );
}

function loadLabels(selectedLanguage){
    facilis.LabelManager.getInstance().addEventListener(facilis.LabelManager.LABELS_LOADED, function(e) { 
        facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px",closeButton:true, contentUrl:facilis.game.gameAssetsUrl+"screens/WhiteboardInitWindow.html", title:"Welcome" } );
        initNotepad();
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


function initFacilis2() {
    /*document.getElementById("facilisCanvas").width = window.innerWidth-30;
    document.getElementById("facilisCanvas").height = window.innerHeight-30; 

    var stage = new createjs.Stage("facilisCanvas");
    stage.enableMouseOver();
    stage.mouseMoveOutside = true;
    createjs.Touch.enable(stage);*/
    
    var stage = new PIXI.Container();
    var renderer = new PIXI.WebGLRenderer(window.innerWidth-30, window.innerHeight-30);

    document.body.appendChild(renderer.view);
    
    renderer.view.id="facilisCanvas";
    
    
   
    facilis.ElementAttributeController.getInstance();
    facilis.IconManager.getInstance();

    stage.addChild(facilis.View.getInstance());

    facilis.View.getInstance().init(stage);

    facilis.ElementAttributeController.getInstance();

    setTimeout(function(){
    //stage.update();  

    //createjs.Ticker.on("tick", stage);
        window.requestAnimationFrame(animate);
    
    },1200);
    
    function animate() {
        
        bunny.rotation += 0.01;
        
        renderer.render(stage);

	    window.requestAnimationFrame(animate);
    }
    
  return;
}

function initFacilis(){

    
    var renderer = new PIXI.WebGLRenderer(window.innerWidth-30, window.innerHeight-30,{backgroundColor:0xFFFFFF});

    document.body.appendChild(renderer.view);
    renderer.view.id="facilisCanvas";
    var stage = new PIXI.Container();

    var bunnyTexture = PIXI.Texture.fromImage("http://www.goodboydigital.com/pixijs/examples/snake/snake.png");
    var bunny = new PIXI.Sprite(bunnyTexture);

    bunny.position.x = 400;
    bunny.position.y = 300;

    bunny.scale.x = 2;
    bunny.scale.y = 2;

    stage.addChild(bunny);
    
    facilis.ElementAttributeController.getInstance();
    facilis.IconManager.getInstance();

    /*stage.addChild(facilis.View.getInstance());
    
    facilis.View.getInstance().init(stage);

    facilis.ElementAttributeController.getInstance();
    */

    requestAnimationFrame(animate);

    function animate() {
        bunny.rotation += 0.01;

        renderer.render(stage);

        requestAnimationFrame(animate);
    }

}


function loadXpdl(xpdl){
    facilis.View.getInstance().loadModelString(xpdl);
}