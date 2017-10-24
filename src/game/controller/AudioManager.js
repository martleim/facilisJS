(function() {
    
    function AudioManager(){}
    
    AudioManager._disabled = false;
		
    AudioManager.correct=function() {
        AudioManager.play("correct");
    }

    AudioManager.error=function() {
        AudioManager.play("error");
    }

    AudioManager.bonus=function() {
        AudioManager.play("bonus");
    }

    AudioManager.music=function() {
        AudioManager.play("music");
    }

    AudioManager.score=function() {
        AudioManager.play("score");
    }

    
    Object.defineProperty(AudioManager, 'enable', {
        set: function(b) {
            createjs.Sound.setMute(!b);
        }
    });

    AudioManager.play=function(s) {
        if (!AudioManager._disabled) {
            createjs.Sound.play(s);
        }
    }
    

    AudioManager.handleSoundLoaded=function(event) {
        console.log("Preloaded:", event.id, event.src);
    }
    
    AudioManager.init=function() {
        createjs.Sound.addEventListener("fileload", this.handleSoundLoaded);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.registerSounds(
            [{id:"correct", src:"correct.mp3"},
            {id:"error", src:"error.mp3"},
            {id:"bonus", src:"bonus.mp3"},
            {id:"score", src:"score.mp3"},
            {id:"music", src:"music.mp3"}]
        , facilis.game.gameAssetsUrl+"audio/");

    }
    setTimeout(function(){
        AudioManager.init();
        }, 500);
    
    
    facilis.game.AudioManager=AudioManager;
    
})();
