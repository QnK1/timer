//timer object
const Timer = {
    currTime : 0, //currently stored time
    currInterval : 0, //id of currently running setInterval
    isRunning : false,

    async start(){
        if(!this.isRunning){
            this.isRunning = true;
            
            this.currTime = 0; //settin the timer to 0

            let startingPoint = Date.now(); //current time in ms
            let delta; //ms since last tick
            
            this.currInterval = setInterval(() => {
                /* this avoids setInterval innacuracy */
                
                delta = Date.now() - startingPoint;
                startingPoint = Date.now();
                this.currTime += delta;
            }, 1);
        }
    },

    async stop(){
        clearInterval(this.currInterval);
        this.isRunning = false;
    },

    get time(){
        
        let ctime = this.currTime;

    
        const minutes = Math.floor(ctime / 60000);
        ctime -= minutes * 60000;

        let seconds = Math.floor(ctime / 1000);
        ctime -= seconds * 1000;
        seconds = seconds.toString();

        if(minutes && seconds.length === 1){
            seconds = '0' + seconds;
        }


        let miliseconds = ctime;
        miliseconds = miliseconds.toString()

        if(miliseconds.length === 2){
            miliseconds = '0' + miliseconds;
        }
        else if(miliseconds.length === 1){
            miliseconds = '00' + miliseconds;
        }

        miliseconds = miliseconds.slice(0, 2);

        return (minutes) ? `${minutes}:${seconds}.${miliseconds}` : `${seconds}.${miliseconds}`;
    },

    get seconds(){
        let ctime = this.currTime;
        const seconds = Math.floor(ctime / 1000);

        return seconds;
    },
};

const welcomeButton = document.querySelector('.name-button');
const welcomeInput = document.querySelector('.name-input');
const welcomeScreen = document.querySelector('.welcome-screen');
const playIcon = document.querySelector('.fa-play');
const checkIcon = document.querySelector('.fa-check');
const mainPage = document.querySelector('.main-page');
const nameText = document.querySelector('.name-text');
const scrambleArea = document.querySelector('.scramble-area');

let userName;

async function generateScramble(){
    const faces = ['U', 'D', 'R', 'L', 'F', 'B'];
    const moves = ["", "'", "2"];
    let scramble = "";
    const len = Math.floor(Math.random() * 3)+20;
    let prevFace = 'A';
    let currRandom;
    let currFace;

    for(let i=0; i<len; i++){
        
        currRandom = Math.floor(Math.random() * faces.length);
        currFace = faces[currRandom];

        while(currFace === prevFace){
            currRandom = Math.floor(Math.random() * faces.length);
            currFace = faces[currRandom];
        }

        scramble += currFace;
        prevFace = currFace;

        currRandom = Math.floor(Math.random() * moves.length);
        scramble += moves[currRandom];

        scramble += " ";
    }

    return scramble;
};

async function setScramble(){
    const scramble = await generateScramble();

    scrambleArea.innerText = scramble;
};

const Display = {
    displayText : document.querySelector('.timer-text'),
    currInterval : 0,
    state : 'idle',
    penalty : 'none',
    async startDisplay(){
        this.state = 'timer';
        Timer.start();

        this.currInterval = setInterval(() => {
            this.displayText.innerText = Timer.time;
        }, 10)
    },
    async stopDisplay(){
        Timer.stop();
        clearInterval(this.currInterval);
        this.displayText.innerText = Timer.time; //ensuring reading is accurate
        this.state = 'idle';
    }, //kocham Emilię Lizurek najbardziej na świecie!!!!
    async startInspection(){
        this.state = 'inspection';
        this.penalty = 'none';
        Timer.start();

        this.displayText.innerText = '0';
        let currSeconds = 0;

        this.currInterval = setInterval(() => {
            if(Timer.seconds > currSeconds){
                currSeconds += 1;

                if(currSeconds <= 15){
                    this.displayText.innerText = currSeconds;
                    this.penalty = 'none';
                }
                else if(currSeconds <= 17){
                    this.displayText.innerText = '+2';
                    this.penalty = '+2';
                }
                else if(currSeconds > 17){
                    this.displayText.innerText = 'DNF';
                    this.penalty = 'DNF';
                } 
            }
        }, 100)
    },
    stopInspection(){
        clearInterval(this.currInterval);
        Timer.stop();
    }

};

welcomeButton.addEventListener('click', async (evt) => {
    evt.preventDefault();

    if(welcomeInput.value){
        userName = welcomeInput.value;
        playIcon.classList.add('no-display');
        checkIcon.classList.remove('no-display'); //changin icon on the button to a checkmark

        welcomeButton.disabled = true; //disabling the button just in case
        welcomeScreen.classList.add('hide-animation'); 
        mainPage.classList.add('show-animation');

        nameText.innerText = userName;
        setScramble();


        window.addEventListener('keyup', (evt) => {
            if(evt.key === ' '){
                //start breathing

                let result;

                if(Display.state === 'idle'){
                    Display.startInspection();
                }
                else if(Display.state === 'inspection' && Display.penalty !== 'DNF'){
                    Display.stopInspection();
                    Display.startDisplay();

                   
                }
                else if(Display.state === 'inspection' && Display.penalty === 'DNF'){
                    Display.stopInspection();
                    Display.startDisplay();
                    
                }
                else if(Display.state === 'timer'){
                    Display.stopDisplay();
                    let result;

                    if(Display.penalty === '+2'){
                        const oldTime = Timer.time;
                        let newTime;
                        
                        if(oldTime.length === 4){
                            let secs = parseInt(oldTime.slice(0, 1));
                            
                            secs += 2;

                            newTime = `${secs}${oldTime.slice(1, 4)}`;
                        }
                        else if(oldTime.length > 4){
                            let secs = parseInt(oldTime.slice(-5, -3));

                            secs += 2;

                            if(oldTime.length > 5){
                                secs = '0' + secs.toString();
                            }

                            newTime = `${oldTime.slice(0, -5)}${secs}.${oldTime.slice(-2)}`;
                        }

                        result = newTime;

                        Display.displayText.innerText = `${oldTime}+2`;
                    }
                    else if(Display.penalty === 'none'){
                        result = Display.displayText.innerText;
                        //console.log(result);
                    }
                    else if(Display.penalty === 'DNF'){
                        result = `DNF(${Timer.time})`;

                        Display.displayText.innerText = result;
                    }
                    console.log(result);

                    setScramble();
                }

                
            }
            
        });
    }
    else{ //if the name input is empty, it just gets in focus again
        welcomeInput.focus(); 
    }
});

