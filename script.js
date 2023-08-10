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
        let prev = ctime;

    
        const minutes = Math.floor(ctime / 60000);
        ctime -= minutes * 60000;

        const seconds = Math.floor(ctime / 1000);
        ctime -= seconds * 1000;

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
    isRunning : false,
    async startDisplay(){
        this.isRunning = true;
        Timer.start();

        this.currInterval = setInterval(() => {
            this.displayText.innerText = Timer.time;
        }, 10)
    },
    async stopDisplay(){
        Timer.stop();
        clearInterval(this.currInterval);
        this.displayText.innerText = Timer.time; //ensuring reading is accurate
        this.isRunning = false;
    }, //kocham Emilię Lizurek najbardziej na świecie!!!!
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


                //start inspection
                //start timer
            }
            
        });
    }
    else{ //if the name input is empty, it just gets in focus again
        welcomeInput.focus(); 
    }
});

