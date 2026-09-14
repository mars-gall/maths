// ANSI color escape codes
const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

console.log(yellow + 'hello world! Input hours:minutes:seconds' + yellow);

var prompt = require("prompt-sync")();

while (true) {

    var hour = "";
    var minute = "";
    var seconds = "";

    var time = prompt(blue + "enter time: " + reset);
    time = time.split('');
    
    //create hour
    for (var i = 0; i < 3; i++) {
        if (time[0] !== ":") {
            hour += time[0];
            //pop time[0]
            time.splice(0, 1);
        } else {
            time.splice(0, 1);
            break;
        }
    }
    //for military time
    hour %= 12;
    //create minute
    for (var i = 0; i < 3; i++) {
        if (time[0] !== ":") {
            minute += time[0];
            time.splice(0, 1);
        } else {
            time.splice(0, 1);
        }
    }
    //create seconds
    for (var i = 0; i < time.length; i++) {
        seconds += time[i];
    }

    //integize (lol)
    hour = parseInt(hour);
    minute = parseInt(minute);
    seconds = parseInt(seconds);

    var sA;
    var mA;
    var hA;

    //degrees of seconds hand:
    //for every second there is 6 degrees
    sA = seconds * 6;
    
    //degrees of minute hand:
    //for every minute there is 6 degrees 
    //plus 0.1 degrees for each second
    mA = minute * 6;
    mA += (seconds/10);

    //degrees of hour hand:
    //for every hour there is 30 degrees
    //plus 0.5 degrees for each minute
    hA = hour * 30;
    hA += (minute/2);

    //FIND 3 ANGLES FOR EACH PAIR OF HANDS

    // hour-minute
    console.log(green + Math.abs(mA%360 - hA%360).toFixed(1) + " degrees" + red + " (hour/minute)" + reset);
    // minute-seconds
    console.log(green + Math.abs(sA%360 - mA).toFixed(1) + " degrees" + red + " (minute/seconds)" + reset);
    //second-hour
    console.log(green + Math.abs(sA%360 - hA).toFixed(1) + " degrees" + red + " (hour/seconds)" + reset);
}