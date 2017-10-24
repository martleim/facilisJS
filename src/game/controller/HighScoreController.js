(function() {

    function HighScoreController() {
        if (!HighScoreController.allowInstantiation) {
            
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }
        this._highScoreModel={};
        this._highScores=[];
        this.loadHighScoreModel();
    }
    
    
    HighScoreController.allowInstantiation=false;
    HighScoreController._instance=null;
    
    HighScoreController.getInstance=function() {
        if (HighScoreController._instance == null) {
            HighScoreController.allowInstantiation = true;
            HighScoreController._instance = new HighScoreController();
            HighScoreController.allowInstantiation = false;
        }
        return HighScoreController._instance;
    }
    
    
    var element = facilis.extend(HighScoreController, {});
    
    element.addHighScore=function(game,score) {
        game=(!game||game=="")?"empty":game;
        this.loadHighScores(game);
        this._highScores.push(score);
        this._highScores.sort(function(a, b){return b.score-a.score});
        if (this._highScores.length > 10) {
            this._highScores.pop();
        }
        this.saveHighScores(game);
    }

    Object.defineProperty(element, 'highScores', {
        get: function() {
            return this._highScores;
        }
    });

    element.loadHighScores=function(game) {
        this._highScores =[];
        if(this._highScoreModel[game]){
            this._highScores = this._highScoreModel[game];
        }

    }
    
    element.loadHighScoreModel=function() {
        this._highScoreModel ={};
        if(localStorage["facilis.game.HighScore"]){
            this._highScoreModel = JSON.parse(localStorage["facilis.game.HighScore"]);
        }

    }

    element.saveHighScores=function(game) {
        this._highScoreModel[game]=this._highScores;
        localStorage["facilis.game.HighScore"] = JSON.stringify(this._highScoreModel);

    }


    facilis.game.HighScoreController = facilis.promote(HighScoreController, "Object");
    
}());
