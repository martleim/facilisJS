(function() {

    function GameItem(_element) {
        
        this.name="";
		this.performers=[];
		this.description="";
		
		this._answers=[];
		
		this.element=_element;
        
        this.parseInfo(_element.getData());
    }
    
    //static public//
    
    
    var element = facilis.extend(GameItem, {});
    
    element.init=function() {
        this._answers = [];	
        this.element.getElement().showCorrect(false);
    }

    element.parseInfo=function(data) {
        this.performers = [];
        this.data = data;
		this.name = this.data.name||this.data.nameChooser;
		this.description = this.data.documentation;
		this.performers = this.data.performers||[];
		this.performers.sort(function(a,b){
			return a.name>b.name;
		});
    }

    element.checkCorrect=function(value) {
        return this.getGameTypeValue() == value.getGameTypeValue();
    }

    element.getGameTypeValue=function() {
        if (facilis.game.GameController.getInstance().gameMode==facilis.game.GameController.MODE_NAME) {
            return this.name;
        }
        if (facilis.game.GameController.getInstance().gameMode==facilis.game.GameController.MODE_DESCRIPTION) {
            return this.description;
        }
        if (facilis.game.GameController.getInstance().gameMode==facilis.game.GameController.MODE_PERFORMER) {
            return this.getPerformersString();
        }
    }
	
	element.getPerformersString=function() {
		var perfs=[];
		for(var i=0;i<this.performers.length;i++){
			perfs.push(this.performers[i].name);
		}
		return perfs.join(", ");
	}

    Object.defineProperty(element, 'answers', {
        get: function() {
            return this._answers;
        }
    });

    element.addAnswer=function(value) 
    {
        this._answers.push(value);
    }


    facilis.game.GameItem = facilis.promote(GameItem, "Object");
    
}());