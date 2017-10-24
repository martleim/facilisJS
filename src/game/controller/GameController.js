(function() {

     function GameController() {
        if (!GameController.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        
        facilis.EventDispatcher.initialize(this);
        this.gameState = GameController.GAME_STOPPED;
		this.gameMode = GameController.MODE_DESCRIPTION;
		
		this.allItems=[];
		this.gameItems=[];
		this.answeredGameItems=[];
		
		this.currentElement=null;
		this.currentAnswer=null;
		this.score=0;
		
		this.processDescription="";
		
    }
    
    GameController.GAME_STOPPED = "GAME_STOPPED";
    GameController.GAME_ENDED = "GAME_ENDED";
    GameController.GAME_PLAYING = "GAME_PLAYING";
    GameController.GAME_PAUSED = "GAME_PAUSED";
    GameController.GAME_READY = "GAME_READY";
    GameController.GAME_NEXT = "GAME_NEXT";

    GameController.GAME_CORRECT = "GAME_CORRECT";
    GameController.GAME_BONUS = "GAME_BONUS";
    GameController.GAME_WRONG = "GAME_WRONG";

    GameController.INPECT_ELEMENT = "INPECT_ELEMENT";

    GameController.MODE_NAME = "MODE_NAME";
    GameController.MODE_DESCRIPTION = "MODE_DESCRIPTION";
    GameController.MODE_PERFORMER = "MODE_PERFORMER";


    GameController.allowInstantiation=false;
    GameController._instance;
    
    GameController.getInstance=function() {
        if (GameController._instance == null) {
            GameController.allowInstantiation = true;
            GameController._instance = new GameController();
            GameController.allowInstantiation = false;
        }
        return GameController._instance;
    }

    var element = facilis.extend(GameController, {});
    
    element.init=function() {
        facilis.MultiSelect.MULTISELECT_ENABLED = false;
        facilis.View.getInstance().addEventListener(facilis.View.ON_LOAD, this.viewLoad.bind(this));
        facilis.View.getInstance().addEventListener(facilis.View.ON_SELECT, this.elementSelect.bind(this));
    }
    
    element.play=function() {
        this.score = 0;
        this.answeredGameItems = [];
        this.gameItems = this.setShuffled(this.gameItems);
        this.resetElements();
        this.setNameVisibles((this.gameMode==facilis.game.GameController.MODE_DESCRIPTION || this.gameMode==facilis.game.GameController.MODE_PERFORMER));
        this.gameState = facilis.game.GameController.GAME_PLAYING;
        this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_PLAYING));
        this.nextElement();
    }

    Object.defineProperty(element, 'remaining', {
        get: function() {
            return this.gameItems.length;
        }
    });
    
    element.resetElements=function() {
        var items = this.gameItems;
        var items2 = [];
        while (items.length > 0) {
            var item = items.shift();
            item.init();
            if (item.getGameTypeValue() && item.getGameTypeValue() != "") {
                items2.push(item);
            }else {
                this.answeredGameItems.push(item);
            }
        }
        this.gameItems = items2;
    }

    element.setNameVisibles=function(to) {
        for (var i = 0; i < this.allItems.length; i++ ) {
            if (to) {
                ((this.allItems[i]).element.getElement()).showName();
            }else{
                ((this.allItems[i]).element.getElement()).hideName();
            }
        }
    }

    element.end=function() {
        this.gameState = facilis.game.GameController.GAME_ENDED;
        this.score = facilis.game.ScoreCalculator.calculate(this.answeredGameItems);
        while(this.answeredGameItems.length>0) {
            this.gameItems.push(this.answeredGameItems.shift());
        }
        this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_ENDED));
    }

    element.stop=function() {
        this.gameState = facilis.game.GameController.GAME_STOPPED;
        this.score = facilis.game.ScoreCalculator.calculate(this.answeredGameItems);
        while(this.answeredGameItems.length>0) {
            this.gameItems.push(this.answeredGameItems.shift());
        }
        this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_STOPPED));
    }

    element.pause=function() {
        this.gameState = facilis.game.GameController.GAME_PAUSED;
        this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_PAUSED));
    }

    element.checkCorrectAnswers=function(el) {
        for (var i = 0; i < this.gameItems.length; i++){
            if ((this.gameItems[i]).element==el && (this.gameItems[i]).checkCorrect(this.currentElement)) {
                this.setCorrect(this.gameItems[i]);
                this.gameItems.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    element.getQuestion=function() {
        return this.currentElement.getGameTypeValue()
    }

    element.setShuffled=function(arr) {
        var random = [];
        var aux = [];

        for (var i = 0; i < arr.length; i++ )
            aux.push(arr[i]);

        while(aux.length > 0)
            random.push(aux.splice(Math.floor(Math.random()*aux.length), 1)[0]);


        return random;
    }

    element.nextElement=function() {
        facilis.View.getInstance().unselectAll();
        if (this.gameItems.length > 0) {
            this.currentElement = this.gameItems[0];
            if (this.currentElement.getGameTypeValue() && this.currentElement.getGameTypeValue() != "") {
                this.currentAnswer = new facilis.game.Answer();
                this.currentAnswer.start = (new Date()).getTime();
                this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_NEXT));
            }else {
                this.answeredGameItems.push(this.gameItems.shift());
                nextElement();
            }

        }else {
            this.end();
        }
    }

    element.setCorrect=function(el) {
        this.currentAnswer.end = (new Date()).getTime();
        if (((this.currentAnswer.end - this.currentAnswer.start) < facilis.game.ScoreCalculator.timeForBonus) && el.answers.length == 0) {
            this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_BONUS));
            (el.element.getElement()).bonus();
        }else {
            this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_CORRECT));
        }
        this.currentAnswer.correct = true;
        el.addAnswer(this.currentAnswer);
        this.currentAnswer = null;
        this.answeredGameItems.push(el);
        (el.element.getElement()).showName();
        (el.element.getElement()).showCorrect(true);
    }

    element.viewLoad=function(e) {
		this.currentElement=null;
        var mainProcData=facilis.View.getInstance().getMainProcessData();
        this.processDescription = mainProcData.documentation;
        this.processDescription = this.processDescription?this.processDescription:"";
        facilis.game.ScoreCalculator.processName= mainProcData.name? mainProcData.name:"";
        this.allItems = [];
        var els = facilis.View.getInstance().getElements();
        for (var i = 0; i < els.length; i++ ) {
            if ((els[i]).elementType=="task" || (els[i]).elementType=="esubflow" || (els[i]).elementType=="csubflow") {
                var gameItem = new facilis.game.GameItem(els[i]);
                this.allItems.push(gameItem);
            }
        }
        this.setNameVisibles((this.gameMode==facilis.game.GameController.MODE_DESCRIPTION || this.gameMode==facilis.game.GameController.MODE_PERFORMER));
        this.gameItems=this.setShuffled(this.allItems);			
        this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_READY));
    }

    element.elementSelect=function(e) {
        var el = facilis.View.getInstance().getSelectedElements()[0];
        if(el && el.getElement && (el.getElement() instanceof facilis.ActivityElement)){
            if (this.gameState==facilis.game.GameController.GAME_PLAYING) {
                if (el === this.currentElement.element) {
                    this.setCorrect(this.gameItems.shift());
                    this.nextElement();
                }else if (this.checkCorrectAnswers(el)) {
                    this.nextElement();
                }else {
                    this.currentAnswer.end = (new Date()).getTime();
                    this.currentAnswer.correct = false;
                    this.currentElement.addAnswer(this.currentAnswer);
                    this.currentAnswer = new facilis.game.Answer();
                    this.currentAnswer.start = (new Date()).getTime();
                    facilis.View.getInstance().unselectAll();
                    (el.getElement()).tiltWrong();
                    this.dispatchEvent(new facilis.Event(facilis.game.GameController.GAME_WRONG));
                }
            }else {
                for (var i = 0; i < this.gameItems.length; i++){
                    if ((this.gameItems[i]).element==el) {
                        this.currentElement = (this.gameItems[i]);
                        this.dispatchEvent(new facilis.Event(facilis.game.GameController.INPECT_ELEMENT));
                        return;
                    }
                }
            }
        }else {
            if (this.gameState != facilis.game.GameController.GAME_PLAYING) {
                this.currentElement = null;
                this.dispatchEvent(new facilis.Event(facilis.game.GameController.INPECT_ELEMENT));
            }
        }
    }
    
    element.forceEndGame=function(e) {
        this.end();
    }

    facilis.game.GameController = facilis.promote(GameController, "Object");
    
}());