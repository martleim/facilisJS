(function() {
    
    function Timer(){
        facilis.EventDispatcher.initialize(this);
        var scope=this;
        this.interval=null;
        this.lastTick=0;
        this.start=function(){
            this.interval=setInterval(
                function(){
                    scope.lastTick++;
                    scope.dispatchEvent(new facilis.Event(Timer.TIMER));
                }
                ,300);
        }
        
        this.stop=function(){
            clearInterval(this.interval);
        }
        
        this.getLastTick=function(){
            return this.lastTick;
        }
    }
    Timer.TIMER="timer_timer"

    function CountdownTimer(container) {
        this.container=container;
        
        this.isFinished =false;
		this.paused  = true;
		this._currentTime;
		this._lastTime=0;
		//this._myTimerClip : MovieClip
		this._recentTimePassed=0;
		this._startTime=0;
		this._totalTimeInMilliseconds=0;
		this._totalTimeInSeconds=0;
		this._totalTimePassed=0;
		this._whenFinishedCallBack = null;
		this.minutesLeft=0;
		this.secondsLeft=0;
		this.tensOfSecondsLeft=0;
		this.timeSecondsLeft=1000;
		
        this.countTo=-1;
        
		this.minutes;
		this.seconds;
		
		this.timer;
		
		this.displayRemaining = true;
        
        
        facilis.EventDispatcher.initialize(this);
    
        this.setup();
    }
    
    //static public//
    
    
    var element = facilis.extend(CountdownTimer, {});
    
    
    
    element.TIMER_ENDED="TIMER_ENDED";
    
    element.setup = function() {
        this.container.innerHTML="";
        this.container.style.display="table";
        this.minutes = document.createElement("div");
        this.minutes.style.display="table-cell";
        this.minutes.style.width="40%";
        this.minutes.style.textAlign="right";
        this.container.appendChild(this.minutes);
        //this.minutes.width = 12;
        this.dots = document.createElement("div");
        this.dots.style.display="table-cell";
        this.dots.style.width="20%";
        this.dots.style.textAlign="center";
        this.container.appendChild(this.dots);
        this.dots.innerText=" : ";
        this.seconds = document.createElement("div");
        this.seconds.style.display="table-cell";
        this.seconds.style.width="40%";
        this.seconds.style.textAlign="left";
        //this.seconds.width = 12;
        this.container.appendChild(this.seconds);
        this.timer = new Timer(300);
        this.timer.addEventListener(Timer.TIMER, this.loop.bind(this));
    }


    element.continueTimer=function() {
        this._lastTime = this.getTimer();
        this.paused = false;
    }

    element.dispose=function() {
        stopTimer()
        removeChild(_myTimerClip)
        _myTimerClip = null
        this._whenFinishedCallBack = null
    }

    element.initialise=function(_timerClip) {
        _myTimerClip = _timerClip

    }
    element.pauseTimer=function() {
        console.log("pausing timer")
        this.paused = true;
    }

    element.startTimer=function(_seconds,_callBack) {
        console.log("starting timer for " + _seconds + " seconds")
        this._totalTimeInSeconds = _seconds;
        this._whenFinishedCallBack = _callBack;
        this._totalTimeInMilliseconds = _seconds * 1000;
        this.timer.start();
        this._startTime = this.getTimer();
        this._lastTime = this._startTime;
        this._totalTimePassed = 0;
        this.paused = false;
        this.isFinished = false;
    }

    element.stopTimer=function() {
        this.timer.stop()
    }

    element.updateTimeDisplay=function() {
        this._currentTime = this.getTimer();
        this._recentTimePassed = this._currentTime - this._lastTime;
        this._lastTime = this._currentTime;
        this._totalTimePassed += this._recentTimePassed;
        // work out how much time to display
        this.timeSecondsLeft = Math.ceil((this._totalTimeInMilliseconds - this._totalTimePassed) / 1000);
        if (this.timeSecondsLeft < 1) {
            // this.timer has finished
            this.isFinished = true
        }
        var displayTime = this.timeSecondsLeft;
        if (!this.displayRemaining) {
            displayTime = this._totalTimeInSeconds - displayTime;
        }
        this.minutesLeft = parseInt(displayTime / (60));
        displayTime -= this.minutesLeft * 60;
        this.tensOfSecondsLeft = parseInt(displayTime / (10));
        displayTime -= this.tensOfSecondsLeft * 10;
        this.secondsLeft = displayTime;
        if (this.minutes.innerText != this.minutesLeft) {
            this.minutes.innerText = this.minutesLeft;
        }
        //if (tensof.text != String(this.tensOfSecondsLeft)) {
            //tensof.text = String(this.tensOfSecondsLeft);
        /*}
        if (seconds.text != String(this.secondsLeft)) {*/
            this.seconds.innerText = this.tensOfSecondsLeft+""+this.secondsLeft;
        //}
    }


    element.timerFinished=function() {
        console.log("timer has finished countdown");
        this.dispatchEvent(new facilis.Event(facilis.game.CountdownTimer.TIMER_ENDED));

        this.stopTimer();
        if (this._whenFinishedCallBack != null) {
            this._whenFinishedCallBack.call()
        }
    }

    element.loop=function(event) {
        if (!this.paused) {
            this.updateTimeDisplay();
            if (this.isFinished) {
                this.timerFinished()
            }
        }
    }
	
	element.clear=function(){
		this.seconds.innerText="";
		this.minutes.innerText="";
	}
    
    element.getTimer=function(){
        //return this.timer.getLastTick();
        return (new Date()).getTime();
    }


    facilis.game.CountdownTimer = facilis.promote(CountdownTimer, "Object");
    
}());

        
		
		