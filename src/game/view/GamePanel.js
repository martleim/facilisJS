(function() {

    function GamePanel(config) {
        this.actions=config.actions;
        
        this.loadBtn=config.loadButton;
        this.playStopButton=config.startStopButton;

        this.questionLabel=config.questionLabel;

        //this.radioGroup;
        this.taskName=config.taskName;
        this.taskDescription=config.taskDescription;
        this.taskPerformer=config.taskPerformer;
        
        this.nameInput=config.nameInput;

        this.countdownEl=config.countdown;
        
        this.printerButton=config.printerButton;
        
        this.counter=config.counter;

        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(GamePanel, {});
    
    /*
        element.BaseClassSetup=element.setup;
    */
    element.setup = function() {
        //this.BaseClassSetup();
        	
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_PAUSED, this.onGamePause.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_PLAYING, this.onGamePlaying.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_READY, this.onGameReady.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_STOPPED, this.onGameStop.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_ENDED, this.onGameEnd.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_NEXT, this.onGameNext.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_CORRECT, this.onGameCorrect.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_WRONG, this.onGameWrong.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_BONUS, this.onGameBonus.bind(this));
		
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.INPECT_ELEMENT, this.onInspectElement.bind(this));
        facilis.game.GameController.getInstance().addEventListener(facilis.game.GameController.GAME_READY, this.onInspectElement.bind(this));
		
		this.onInspectElement();
        
        
        this.loadBtn.addEventListener("change", this.loadGameFile.bind(this));

        this.playStopButton.addEventListener("click", this.startStopClick.bind(this));
        this.playStopButton.disabled = true;

        this.taskDescription.addEventListener("click", this.radioChecked.bind(this));
        this.taskDescription.checked=true;
        
        this.taskPerformer.addEventListener("click", this.radioChecked.bind(this));
        this.taskPerformer.checked=false;
        
        this.taskName.addEventListener("click", this.radioChecked.bind(this));
        this.taskName.checked=false;
        
        this.countdown = new facilis.game.CountdownTimer(this.countdownEl);
        this.countdown.displayRemaining = false;
        this.countdown.x = 5;
        this.countdown.y = 5;
        this.countdown.scaleX = 2;
        this.countdown.scaleY = 2;
        
        this.countdown.addEventListener(facilis.game.CountdownTimer.TIMER_ENDED,function(){
            facilis.game.GameController.getInstance().end();
        });

        this.questionLabel.disabled = true;
        this.questionLabel.visible = false;
        
        this.nameInput.addEventListener("change", this.nameInputChanged.bind(this));
        
        this.printerButton.addEventListener("click", this.printDocumentation.bind(this));

        this.checkPlayButton();
    };
    
    element.onGamePlaying=function(e) {
        this.loadBtn.disabled = true;
        this.playStopButton.disabled = true;
        //this.endButton.disabled = false;
        this.countdown.startTimer(3600,  null);
        this.checkPlayButton();
        
        this.playStopButton.playing=true;
        this.nameInput.disabled  = true;
        
        this.taskName.disabled = true;
        this.taskDescription.disabled = true;
        this.taskPerformer.disabled = true;
        
        this.questionLabel.visible = true;
        this.countdown.visible = true;
    }

    element.onGameReady=function(e) {
        this.loaded=true;
        this.loadBtn.disabled = false;
        this.playStopButton.disabled = false;
        //this.endButton.disabled = true;

        this.taskName.disabled = false;
        this.taskDescription.disabled = false;
        this.taskPerformer.disabled = false;
        
        this.playStopButton.playing=false;

        this.setQuestionText(this.getProcessName()+"\n"+ facilis.game.GameController.getInstance().processDescription);
        this.countdown.visible = false;
        this.checkPlayButton();
    }

    element.onGameEnd=function(e) {
		this.counter.innerText=" ";
		this.counter.textContent=" ";
		
        this.loadBtn.disabled = false;
        this.playStopButton.disabled = false;
        //this.endButton.disabled = true;
        this.checkPlayButton();
        
        this.taskName.disabled = false;
        this.taskDescription.disabled = false;
        this.taskPerformer.disabled = false;
        
        this.playStopButton.playing=false;
        this.nameInput.disabled  = false;
        
        this.countdown.stopTimer();
		this.countdown.clear();
		
        this.countdown.visible = false;
        this.questionLabel.visible = true;
        this.setQuestionText(facilis.game.GameController.getInstance().processDescription);
        //AbstractMain.message(facilis.game.GameController.getInstance().score);
        
        /*var modal = new WhiteboardScoreWindow();
        var win = facilis.game.WindowManager.getInstance().openModal( { width:700, height:520, centered:true, content:modal, title:"" } );
        win.setDragbarHeight(0);
        win.removeClose();
        win.removeMinimize();*/
        showWhiteBoardWindow();
    }


    element.onGameStop=function(e) {
        this.loadBtn.disabled = false;
        this.playStopButton.disabled = false;
        this.playStopButton.playing=false;
        //this.endButton.disabled = true;
        this.checkPlayButton();
        
        this.taskName.visible = true;
        this.taskDescription.visible = true;
        this.taskPerformer.visible = true;
        
        this.nameInput.disabled  = false;
        
        this.countdown.stopTimer();
        this.countdown.visible = false;
        this.questionLabel.visible = true;
        this.setQuestionText(facilis.game.GameController.getInstance().processDescription);

    }

    element.onGameNext=function(e) {
        var str = facilis.game.GameController.getInstance().getQuestion();
        this.setQuestionText(str);
        this.counter.innerText=facilis.LabelManager.getInstance().getLabel("lbl_remaining") +" "+ facilis.game.GameController.getInstance().remaining;
		this.counter.textContent=facilis.LabelManager.getInstance().getLabel("lbl_remaining") +" "+ facilis.game.GameController.getInstance().remaining;
    }

    element.onGameCorrect=function(e) {
        facilis.game.AudioManager.correct();
        //AbstractMain.message("Correct!!!");
    }

    element.onGameWrong=function(e) {
        facilis.game.AudioManager.error();
        //AbstractMain.message("Wrong!!!");
    }

    element.onGameBonus=function(e) {
        facilis.game.AudioManager.bonus();
        //AbstractMain.message("Wrong!!!");
    }

    element.startStopClick=function(e) {
        if(this.playStopButton.playing){
            facilis.game.GameController.getInstance().play();
        }else{
            facilis.game.GameController.getInstance().stop();
        }
    }

    element.endClick=function(e) {
        facilis.game.GameController.getInstance().stop();
    }
    
    element.loadClick=function(e) {
        //this.actions.loadXPDL();
    }


    element.radioChecked=function(el) {
        if(el.target.disabled)
            return;
        
        if (this.taskDescription==el.target) {
            facilis.game.GameController.getInstance().gameMode = facilis.game.GameController.MODE_DESCRIPTION;
            this.taskPerformer.checked=false;
            this.taskName.checked=false;
        }else if (this.taskPerformer==el.target) {
            facilis.game.GameController.getInstance().gameMode = facilis.game.GameController.MODE_PERFORMER;
            this.taskDescription.checked=false;
            this.taskName.checked=false;
        }else if (this.taskName==el.target) {
            facilis.game.GameController.getInstance().gameMode = facilis.game.GameController.MODE_NAME;
            this.taskPerformer.checked=false;
            this.taskDescription.checked=false;
        }

    }

    element.onGamePause=function(e) {

    }



    element.onInspectElement=function(e) {
        var txt;
        if(facilis.game.GameController.getInstance().processDescription){
            txt =this.getProcessName()+"\n"+ facilis.game.GameController.getInstance().processDescription;
        }
        if(facilis.game.GameController.getInstance().currentElement){
            var gameItem = facilis.game.GameController.getInstance().currentElement;
            if(gameItem.name)
                txt = facilis.LabelManager.getInstance().getLabel("lbl_taskName") + ":  " + gameItem.name;
            
            if(gameItem.description)
                txt += "\n" +facilis.LabelManager.getInstance().getLabel("lbl_taskDesc") + ":  " + gameItem.description;
            
            if(gameItem.performers && gameItem.performers.length>0)
                txt += "\n" +facilis.LabelManager.getInstance().getLabel("lbl_taskPerf") + ":  " + gameItem.getPerformersString();
        }
        this.setQuestionText(txt);
    }

    element.setQuestionText=function(str) {
        this.questionLabel.value = str;
        //this.questionLabel.updateScrolls();
    }


    element.getProcessName=function() {
        var d = facilis.View.getInstance().getMainProcessData();
        if (d) {
            return d.name;
        }
        return "UnNamed";

    }

    element.nameInputChanged=function(e) {
        facilis.game.ScoreCalculator.userName=this.nameInput.value;
        this.checkPlayButton();
    }
    
    element.checkPlayButton=function() {
        this.playStopButton.disabled = !((this.nameInput.value != "\r" && this.nameInput.value != "") && (this.loaded || UrlXpdlLoaded));
        this.playStopButton.title="";
        if (this.playStopButton.disabled) {
            var tt =  facilis.LabelManager.getInstance().getLabel("lbl_mustprovide");
            var provide = "";
            if (!this.loaded) {
                provide = facilis.LabelManager.getInstance().getLabel("lbl_agamefile");
            }
            if ((this.nameInput.value == "\r" || this.nameInput.value == "") && !this.loaded) {
                provide += ", ";
            }
            if (this.nameInput.value == "\r" || this.nameInput.value == "") {
                provide += facilis.LabelManager.getInstance().getLabel("lbl_aplayername");
            }
            tt=tt.replace("*", provide);
            this.playStopButton.title=tt;
        }
    }
    
    element.printDocumentation=function(){
        //(new facilis.documentation.PdfDocumentGenerator()).getDocumentation();
		
		if(!(new facilis.documentation.AbstractDocumentator()).canGenerate())
			return;
		
		facilis.game.WindowManager.getInstance().openModal( { width:"700px",height:"600px", closeButton:false, contentUrl:facilis.game.gameAssetsUrl+"screens/ProcessDocumentationWindow.html", title: facilis.LabelManager.getInstance().getLabel("lbl_generatedocumentation") , footer:'<button type="button" class="btn btn-danger" onclick="printDocumentation()">Print</button> <button type="button" class="btn btn-danger" onclick="generateHtml()">Html</button> <button type="button" class="btn btn-danger" onclick="generatePdf()">Pdf</button> <button type="button" class="btn btn-danger" onclick="closeMe()">Close</button> ' } );
    }

    element.loadGameFile=function(e){

        var fr = new FileReader();
        var files=e.target.files;
        var total=files.length;
        if(files.length!=0){
            var f=files[0];
            var fr = new FileReader();
            fr.onload = function(){
                loadXpdl(this.result);
            };
            fr.readAsText(f,"utf-8");
        }
    
    }
    
    facilis.game.GamePanel = facilis.promote(GamePanel, "Object");
    
}());


		
		