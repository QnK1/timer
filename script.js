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

        const seconds = Math.floor(ctime / 1000);
        ctime -= seconds * 1000;

        let miliseconds = ctime;

        if(miliseconds.toString().length > 2){
            miliseconds = miliseconds.toString();
            miliseconds = miliseconds.slice(0, 2);
            miliseconds = parseInt(miliseconds);
        }

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

let userName;


const Display = {
    displayText : document.querySelector('.timer-text'),
    currInterval : 0,
    async startDisplay(){
        Timer.start();

        this.currInterval = setInterval(() => {
            this.displayText.innerText = Timer.time;
        }, 10)
    },
    async stopDisplay(){
        Timer.stop();
        this.displayText.innerText = Timer.time; //ensuring reading is accurate
    }
};

welcomeButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    if(welcomeInput.value){
        userName = welcomeInput.value;
        playIcon.classList.add('no-display');
        checkIcon.classList.remove('no-display'); //changin icon on the button to a checkmark

        welcomeButton.disabled = true; //disabling the button just in case
        welcomeScreen.classList.add('hide-animation'); 
        mainPage.classList.add('show-animation');

        nameText.innerText = userName;

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

