function msToDisplayTime(msTime){
    const minutes = Math.floor(msTime / 60000);
    msTime -= minutes * 60000;

    let seconds = Math.floor(msTime / 1000);
    msTime -= seconds * 1000;

    seconds = seconds.toString();

    if(minutes && seconds.length === 1){
        seconds = '0' + seconds;
    }

    msTime = msTime / 10;

    let miliseconds = msTime.toString().slice(0, 2);

    if(miliseconds.length === 1){
        miliseconds = '0' + miliseconds;
    }
    
    return (minutes) ? `${minutes}:${seconds}.${miliseconds}` : `${seconds}.${miliseconds}`;
}


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

        const lastDigit = parseInt(ctime.toString().at(-1));
    
        if(lastDigit >= 5){
            ctime += (10 - lastDigit);
        }
        else{
            ctime -= lastDigit;
        }
    
        return ctime;
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
const timerArea = document.querySelector('.timer-area');
const statsContainer = document.querySelector('.stats-content');
const bestSingleText = document.querySelector('.best-single');
const bestAo5Text = document.querySelector('.best-ao5');

let latestAo5;
let latestAo5Text;
let latestTd;
let latestH3;
let allTimes = [];
let currAo5 = [];
let bestSingle = Infinity;
let bestAo5 = Infinity;

async function newAo5(){
    const hr = document.createElement('hr');
    hr.classList.add('break');

    const table = document.createElement('table');
    table.classList.add('stats-table');

    const tr = document.createElement('tr');
    tr.classList.add('ao5-times');

    const td = [];

    for(let i=0; i<5; i++){
        td.push(document.createElement('td'));
    }

    const h3 = document.createElement('h3');
    h3.classList.add('ao5-summary');

    const span1 = document.createElement('span');
    span1.classList.add('ao5-text');
    span1.innerText = 'ao5: ';

    const span2 = document.createElement('span');
    span2.classList.add('ao5-value');

    statsContainer.appendChild(hr);

    table.appendChild(tr);

    for(let i=0; i<5; i++){
        tr.appendChild(td[i]);
    }

    statsContainer.appendChild(table);

    h3.appendChild(span1);
    h3.appendChild(span2);
    statsContainer.appendChild(h3);
    statsContainer.appendChild(hr);

    return [table, h3];
};

async function calculateAo5(){
    let maxVal;
    let minVal;
    let DNFCount = 0;
    let sum = 0;

    if(currAo5.length < 5){
        return '---';
    }
    else{ 
        for(let i=0; i<5; i++){
            if(currAo5[i] === 'DNF'){
                currAo5[i] = Infinity;
                DNFCount++;

                if(DNFCount > 1){
                    return 'DNF';
                }
            }
        }

        maxVal = Math.max(...currAo5);
        minVal = Math.min(...currAo5);

        for(let a of currAo5){

            if(a === maxVal){
                maxVal = -1;
            }
            else if(a === minVal){
                minVal = -1;
            }
            else{
                sum += a;
            }
        }

        let av = (sum/3).toFixed();

        return av;

    }
};

async function calculateAo100(){
    //ao100 calculation TODO
};

async function addTime(res){
    
    prevNumberOfTimes = allTimes.length;
    allTimes.push(res);

    if(bestSingle > res){
        bestSingle = res;

        bestSingleText.innerText = msToDisplayTime(bestSingle);
    }

    displayTime = msToDisplayTime(res);
    
    if(prevNumberOfTimes % 5 === 0){
        currAo5.length = 0;
        [latestAo5, latestH3] =  await newAo5();

        latestTd = latestAo5.querySelector('td');

        latestTd.innerText = displayTime;
        currAo5.push(res);

        latestAo5Value = latestH3.querySelector('.ao5-value');
    }
    else{
        latestTd = latestTd.nextSibling;

        latestTd.innerText = displayTime;
        currAo5.push(res);
    }

    const ao5MsFormat = await calculateAo5();
    let ao5DisplayFormat;

    if(ao5MsFormat !== 'DNF' && ao5MsFormat !== '---'){
        ao5DisplayFormat = msToDisplayTime(ao5MsFormat);

        if(bestAo5 > ao5MsFormat){
            bestAo5 = ao5MsFormat;
    
            bestAo5Text.innerText = ao5DisplayFormat;
        }
    }
    else{
        ao5DisplayFormat = ao5MsFormat;
    }

    
    latestAo5Value.innerText = ao5DisplayFormat;
    statsContainer.scrollTo(0, statsContainer.scrollHeight);

};

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
            this.displayText.innerText = msToDisplayTime(Timer.time);
        }, 10)
    },
    async stopDisplay(){
        Timer.stop();
        clearInterval(this.currInterval);
        this.displayText.innerText = msToDisplayTime(Timer.time); //ensuring reading is accurate
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
        checkIcon.classList.remove('no-display'); //changing icon on the button to a checkmark

        welcomeButton.disabled = true; //disabling the button just in case
        welcomeScreen.classList.add('hide-animation'); 
        mainPage.classList.add('show-animation');
        nameText.innerText = userName;
        setScramble();


        window.addEventListener('keyup', async (evt) => {
            if(evt.key === ' '){
                //start breathing

                let result;

                if(Display.state === 'idle'){
                    timerArea.style.fontSize = '12rem';
                    await Display.startInspection();
                }
                else if(Display.state === 'inspection'){
                    await Display.stopInspection();
                    await Display.startDisplay();

                }
                else if(Display.state === 'timer'){
                    await Display.stopDisplay();
                    let result;

                    if(Display.penalty === '+2'){
                        const oldTime = Timer.time;
                        
                        let newTime = oldTime;
                        newTime += 2000;

                        addTime(newTime);
                        

                        timerArea.style.fontSize = '11rem';
                        Display.displayText.innerText = `${msToDisplayTime(oldTime)}+2`;
                    }
                    else if(Display.penalty === 'none'){
                        addTime(Timer.time);
                    }
                    else if(Display.penalty === 'DNF'){
                        result = `DNF(${msToDisplayTime(Timer.time)})`;
                        addTime('DNF');

                        timerArea.style.fontSize = '10rem';
                        Display.displayText.innerText = result;
                    }

                    
                    setScramble();
                } 
            }
        });
    }
    else{ //if the name input is empty, it just gets in focus again
        welcomeInput.focus(); 
    }
});

