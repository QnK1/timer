const Timer = {
    currTime : 0, //currently stored time
    currInterval : 0, //id of currently running setInterval

    async start(){
        this.currTime = 0; //settin the timer to 0

        let startingPoint = Date.now(); //current time in ms
        let delta; //ms since last tick
        
        this.currInterval = setInterval(() => {
            /* this avoids setInterval innacuracy */
            
            delta = Date.now() - startingPoint;
            startingPoint = Date.now();
            this.currTime += delta;
        }, 1);
    },

    async stop(){
        clearInterval(this.currInterval);
    },

    get time(){
        let ctime = this.currTime;
    
        const minutes = Math.floor(ctime / 60000);
        ctime -= minutes * 60000;

        const seconds = Math.floor(ctime / 1000);
        ctime -= seconds * 1000;

        const miliseconds = ctime;

        return (minutes) ? `${minutes}:${seconds}.${miliseconds}` : `${seconds}.${miliseconds}`;
    },
};