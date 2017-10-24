(function() {

    function ScoreCalculator() {
    }
    
    ScoreCalculator.timeForBonus = 4000;
		
    ScoreCalculator.bonusTime = -10000;
    ScoreCalculator.penaltyTime = 10000;

    ScoreCalculator.score=0;
    ScoreCalculator.bonus=0;
    ScoreCalculator.incorrect = 0;
    ScoreCalculator.correct = 0;
    ScoreCalculator.avgTime = 0;
    ScoreCalculator.totalTime = 0;

    ScoreCalculator.userName = "";
    ScoreCalculator.processName = "";
    ScoreCalculator.details=[];

    ScoreCalculator.highScores={};
    
    ScoreCalculator.calculate=function(els) {
        ScoreCalculator.score=0;
        ScoreCalculator.bonus=0;
        ScoreCalculator.incorrect=0;
        ScoreCalculator.avgTime= 0;
        ScoreCalculator.totalTime = 0;
        ScoreCalculator.correct = 0;
        ScoreCalculator.details=new Array();
        var totalTime=0;
        for (var i = 0; i < els.length; i++ ) {
            var el = els[i];
            var answers = el.answers;
            var detail = new Object();
            detail[facilis.LabelManager.getInstance().getLabel("lbl_element")] = el.name;
            var correct = 0;
            var incorrect = 0;
            var bonus = 0;
            for (var a = 0; a < answers.length; a++ ) {
                var answer = answers[a];
                var time = answer.end - answer.start;
                facilis.game.ScoreCalculator.totalTime += time;
                if (!answer.correct) {
                    time += facilis.game.ScoreCalculator.penaltyTime;
                    facilis.game.ScoreCalculator.incorrect++;
                    incorrect++;
                }else if (time < facilis.game.ScoreCalculator.timeForBonus && incorrect == 0) {
                    facilis.game.ScoreCalculator.bonus++;
                    bonus++;
                    correct++;
                    time += ScoreCalculator.bonusTime;
                    ScoreCalculator.correct++;
                }else { 
                    correct++;
                    ScoreCalculator.correct++;
                }
                totalTime += time;
            }

            detail[facilis.LabelManager.getInstance().getLabel("lbl_correct")] =  correct;
            detail[facilis.LabelManager.getInstance().getLabel("lbl_errors")] =  incorrect;
            detail[facilis.LabelManager.getInstance().getLabel("lbl_bonus")] =  bonus;
            facilis.game.ScoreCalculator.details.push(detail);
        }

        if (totalTime<0) {
            totalTime = 1;
        }

        facilis.game.ScoreCalculator.totalTime = facilis.game.ScoreCalculator.totalTime / 1000;
        facilis.game.ScoreCalculator.score = (1 / facilis.game.ScoreCalculator.totalTime) * 1000000;
        if (!isFinite(facilis.game.ScoreCalculator.score)) {
            facilis.game.ScoreCalculator.score = 0;
        }
        facilis.game.ScoreCalculator.avgTime = facilis.game.ScoreCalculator.totalTime / els.length;
        facilis.game.ScoreCalculator.addHighScore();
        
        facilis.game.ScoreCalculator.score=Math.round(facilis.game.ScoreCalculator.score);
        
        return facilis.game.ScoreCalculator.score;
    }



    ScoreCalculator.addHighScore=function() {
        var hs={
            score:facilis.game.ScoreCalculator.score,
            name:facilis.game.ScoreCalculator.userName
        }
        
        facilis.game.HighScoreController.getInstance().addHighScore(facilis.game.ScoreCalculator.processName,hs);
    }
    
    ScoreCalculator.isHighScore=function() {
        var hs={
            score:facilis.game.ScoreCalculator.score,
            name:facilis.game.ScoreCalculator.userName
        }
        
        var highScores=facilis.game.HighScoreController.getInstance().highScores;
        if(parseInt(highScores[0].score)<=hs.score){
		    return true;
        }
        return false;
    }

    ScoreCalculator.getHighScore=function() {
        if (facilis.game.HighScoreController.getInstance().highScores) {
            return facilis.game.HighScoreController.getInstance().highScores;
        }
        return null;
    }
    
    ScoreCalculator.formatTime =function (input)   {
        input=parseInt(input);
        if(input==0)
            return 0;
        
        var hrs = (input > 3600 ? Math.floor(input / 3600) + ":" : "00:");
        var mins = (hrs && input % 3600 < 600 ? "0" : "") + Math.floor(input % 3600 / 60) + ":";
        var secs = (input % 60 < 10 ? "0" : "") + input % 60;
        return (hrs +"" + mins +"" + secs);
    }
    
    ScoreCalculator.formatScore=function(num){
        var n = num.toString(), p = n.indexOf('.');
        return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
            return p<0 || i<p ? ($0+'.') : $0;
        });
    }

    facilis.game.ScoreCalculator = facilis.promote(ScoreCalculator, "Object");
    
}());