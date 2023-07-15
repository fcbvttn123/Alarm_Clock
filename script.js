// Libraries 

// import {v4} from "uuid";




// HTML Elements 

let hourDOM = document.querySelector(".hour")
let minuteDOM = document.querySelector(".minute")
let secondDOM = document.querySelector(".second")
let hourInput = document.querySelector("#input-hour")
let minuteInput = document.querySelector("#input-minute")
let addAlarmBtn = document.querySelector(".add-alarm-btn")
let alarmListDOM = document.querySelector(".alarm-list")
let removeIcon = Array.from(document.querySelectorAll(".remove-icon"))
let alarmTimeList = getAlarmTimeFromLocalStorage() || []
let ringTone = new Audio("./ringtone.mp3")


// Get current time 

let currentTime = new Date();

let currentYear = currentTime.getFullYear()

let currentMonth = currentTime.getMonth()

let currentDay = currentTime.getDay()

let currentHour = currentTime.getHours()

let currentMinute = currentTime.getMinutes()




// Functions: update clock

let timerId = setInterval(() => {

    currentTime = new Date()

    printCurrentTime(currentTime)

    // Clock goes off 

    clockGoOff(currentTime)

}, 1000);




// Functions: Print current time 

function printCurrentTime(currentTime) {

    hourDOM.innerText = currentTime.getHours() < 10 ? `0${currentTime.getHours()} :` : `${currentTime.getHours()} :`

    minuteDOM.innerText = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()} :` : `${currentTime.getMinutes()} :`

    secondDOM.innerText = currentTime.getSeconds() < 10 ? `0${currentTime.getSeconds()}` : `${currentTime.getSeconds()}`

}




// Update hour and minute input

hourInput.value = currentTime.getHours()

minuteInput.value = currentTime.getMinutes()

// Set min and max value for hour and minute input

minuteInput.min = 0

minuteInput.max = 59

hourInput.min = 0

hourInput.max = 23




// Function: add alarm time

function addAlarmTime(alarmTime) {

    let temp = document.getElementsByTagName("template")[0];

    let clon = temp.content.cloneNode(true);

    clon.querySelector(".alarm-time").innerText = `${alarmTime.hourTime} : ${alarmTime.minuteTime}`

    clon.querySelector("li").dataset.id = alarmTime.id;

    // Add remove event to each remove icon

    clon.querySelector(".remove-icon").addEventListener("click", e => {
    
        // e.target.closest("li").remove();

        removeAlarm(e.target);
        
    })

    // Add check tick to input 

    if(alarmTime.check) {

        clon.querySelector("input").checked = true

    } else {

        clon.querySelector("input").checked = false

    }

    // Add check event to each item

    clon.querySelector("input").addEventListener("input", e => {

        let itemId = e.target.closest("li").dataset.id

        alarmTimeList.forEach(listItem => {

            if(!listItem) {

                return

            }

            if(listItem.id == itemId) {

                listItem.check = e.target.checked

            }

        })

        localStorage.setItem("ALARM_STORAGE", JSON.stringify(alarmTimeList))

    })

    // Append template into alarm list

    alarmListDOM.appendChild(clon)

}

alarmTimeList.forEach(e => {

    if(!e) {

        return

    }

    addAlarmTime(e)

})

addAlarmBtn.addEventListener("click", e => {

    addAlarmTimeToLocalStorage(hourInput.value, minuteInput.value);

    alarmListDOM.innerHTML = ""

    alarmTimeList.forEach(e => {

        if(!e) {
    
            return
    
        }
    
        addAlarmTime(e)
    
    })

})




// Function: get alarm time from local storage 

function getAlarmTimeFromLocalStorage() {

    let alarmTimeArray = JSON.parse(localStorage.getItem("ALARM_STORAGE"))

    return alarmTimeArray

}

// Function: add alarm time to local storage and array

function addAlarmTimeToLocalStorage(hour, minute) {

    // let id = v4()

    let id = new Date().valueOf().toString()

    alarmTimeList.push({

        hourTime: hour, 

        minuteTime: minute, 

        id: id, 

        check: false

    })

    localStorage.setItem("ALARM_STORAGE", JSON.stringify(alarmTimeList))

}

// Function: remove alarm time from local storage and array

function removeAlarm(removeIcon) {

    alarmTimeList = alarmTimeList.filter(e => e.id != removeIcon.closest("li").dataset.id)

    localStorage.setItem("ALARM_STORAGE", JSON.stringify(alarmTimeList))

    alarmListDOM.innerHTML = ""

    alarmTimeList.forEach(e => {

        if(!e) {
    
            return
    
        }
    
        addAlarmTime(e)
    
    })

}




// Function: catch time to let clock goes off 

function clockGoOff(currentTime) {

    // Get all li tag

    let liTag = Array.from(document.querySelectorAll("li"))

    // Run through each li tag to check which box is checked

    liTag.forEach(liTagItem => {

        let checkBox = liTagItem.querySelector("input")

        if(checkBox.checked) {

            // Get id of alarm checked

            let itemId = liTagItem.dataset.id

            
            alarmTimeList.forEach(alarmTime => {

                if(alarmTime.id == itemId) {

                    // Get check alarm from array

                    if(currentTime.getHours() == alarmTime.hourTime && currentTime.getMinutes() == alarmTime.minuteTime) {

                        // startGoingOff

                        ringTone.play();

                    }

                }

            })

        } else {

            ringTone.pause()

            return

        }

    })

}




// Add 0 to input number 

hourInput.addEventListener("input", e => {

    hourInput.value = hourInput.value < 10 ? `0${hourInput.value}` : `${hourInput.value}`

})

minuteInput.addEventListener("input", e => {

    minuteInput.value = minuteInput.value < 10 ? `0${minuteInput.value}` : `${minuteInput.value}`

})













