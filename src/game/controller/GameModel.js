(function() {

    function Answer() {
        
    }

    var element = facilis.extend(Answer, {});
    
    element.start=null;
    element.end=null;
    element.correct=null;


    facilis.game.Answer = facilis.promote(Answer, "Object");
    
}());

(function() {

    function HighScore() {
        
    }

    var element = facilis.extend(HighScore, {});
    
    element.name=null;
    element.date=null;
    element.score=null;


    facilis.game.HighScore = facilis.promote(HighScore, "Object");
    
}());
