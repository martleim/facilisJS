(function() {

    function MainGameController() {
        if (!MainGameController.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        this.setup();
        this.gameAssetsUrl="gameAssets/";
    }
    
    //static public//
    
    MainGameController.allowInstantiation=false;
    MainGameController._instance;
    
    MainGameController.getInstance() {
        if (MainGameController._instance == null) {
            MainGameController.allowInstantiation = true;
            MainGameController._instance = new MainGameController();
            MainGameController.allowInstantiation = false;
        }
        return MainGameController._instance;
    }
    
    
    var element = facilis.extend(MainGameController, {});
    
    element.setup = function() {
        
    };

           
    element.init=function(){
        $.get(gameAssetsUrl+"screens/languagePicker.html", null,
            function(data){
                $(data.firstChild.outerHTML).appendTo("body");
                $('#languagePicker').modal({
                    show: true,
                    truebackdrop: 'static', 
                    keyboard: false
                });
                $('#languagePicker').on('hidden', function () {
                    $(this).remove();
                });
            },
        'xml');
    }

    function loadLabels=function(selectedLanguage){
        facilis.LabelManager.getInstance().addEventListener(facilis.LabelManager.LABELS_LOADED, function(e) { 
            $('#languagePicker').modal('hide');
            initNotepad();
            initFacilis();
        } );
        facilis.LabelManager.getInstance().loadLabels(gameAssetsUrl+"labels_"+selectedLanguage+".json");
    }

    function initNotepad=function(){
        $.get(gameAssetsUrl+"screens/notePad.html", null,
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

    function initLabels=function(){

    /*var modal = new LanguageWindow();
    modal.addEventListener(AbstractModal.ON_CLOSE, languageModalClose);
    var win:Window = WindowManager.getInstance().openModal( { width:300, height:200, centered:true, content:modal, title:"" } );
    win.setDragbarHeight(0);
    win.removeClose();
    win.removeMinimize();
    */
    //loadLabels();
    }

    function initFacilis=function() {
    document.getElementById("demoCanvas").width = window.innerWidth-30;
    document.getElementById("demoCanvas").height = window.innerHeight-30; 

    var stage = new createjs.Stage("demoCanvas");
    //var stage = new createjs.SpriteStage("demoCanvas",false,false);
    stage.enableMouseOver();
    stage.mouseMoveOutside = true;
    createjs.Touch.enable(stage);

    facilis.ElementAttributeController.getInstance();
    facilis.IconManager.getInstance();

    stage.addChild(facilis.View.getInstance());

    facilis.View.getInstance().init(stage);

    facilis.ElementAttributeController.getInstance();

    setTimeout(function(){
        stage.update();  

        facilis.Ticker.on("tick", stage);

    },1200);
    return;
    }

    function loadXpdl=function(xpdl){
        facilis.View.getInstance().loadModelString(xpdl);
    }
    

    facilis.game.MainGameController = facilis.promote(MainGameController, "Object");
    
}());