let co  = 0.47;
let no2 = 360;
let o3  = 87;
let pm10 = 360;
let pm25  = 40;
let so2 = 190;
let ico  = 35;
let ino2 = 360;
let io3  = 87;
let ipm10 = 360;
let ipm25  = 40;
let iso2 = 190;

function calculateIValues() {
     io3 = calculateIo3(o3);
     ipm25 = calculatePm25(pm25);
     ipm10 = calculatePm10(pm10);
     ico = calculateCo(co);
     iso2 = calculateSo2(so2);
     ino2 = calculateNo2(no2);
     console.log(ico + " "+ ino2 +" "+ io3+" " + ipm10+" " + ipm25+" " + iso2+" ")
}

const btn = document.getElementById("btn");
const good = document.getElementById("good")

const socket = io();

socket.on('results', data => {
    console.log(data)

    co = data["CO"]
    so2 = data["SO2"]
    o3 = data["O3"]
    pm25 = data["PM25"]
    pm10 = data["PM10"]
    no2 = data["NO2"]

    calculateIValues()
})

let arrayFinished = [false, false, false, false, false, false]

btn.addEventListener("click", () => {

    animateValue("co", 0, ico, 4000, 1);
    animateValue("no2", 0, ino2, 4000, 2);
    animateValue("o3", 0, io3, 4000, 3);
    animateValue("pm10", 0, ipm10, 4000, 4);
    animateValue("pm25", 0, ipm25, 4000, 5);
    animateValue("so2", 0, iso2, 4000, 6);
    
})

function animateValue(id, start, end, duration, col) {
    if (start === end) {
        return;
    }
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        setColorToField(current, col);
        if (current >= end) {
            arrayFinished[col-1] = true;
            if (arrayFinished.every(x=>x)) {
                    res = calculateResult();
                    printResult(res);
            }
            clearInterval(timer);
        }
    }, stepTime);
}

function setColorToField(current, col) {
    var c = "col" + col;
    document.getElementById(c).classList.add(getColorForField(current))
}

function calculateResult() {
    console.log(ico + " "+ ino2 +" "+ io3+" " + ipm10+" " + ipm25+" " + iso2+" ")
    return (ico + ino2 + io3 + ipm10 + ipm25 + iso2) / 6
}

function calculateNo2(no2){
    const [clow,chigh, row] = calculateNo2Limits(no2) 
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (no2-clow) + ilow
}

function calculateSo2(so2){
    const [clow,chigh, row] = calculateSo2Limits(so2) 
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (so2-clow) + ilow
}

function calculateIo3(o3){
    const [clow,chigh, row] = calculateO3Limits(o3) 
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (o3-clow) + ilow
}

function calculateCo(co){
    const [clow,chigh, row] = calculateCoLimits(co) 
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (co-clow) + ilow
}


function calculatePm25(pm25){
    const [clow,chigh, row] = calculatePm25Limits(pm25)  
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (pm25-clow) + ilow
}

function calculatePm10(pm10){
    const [clow,chigh, row] = calculatePm10Limits(pm10)    
    const [ilow, ihigh] = calculateIndexLimits(row)
    return (ihigh-ilow)/(chigh-clow) * (pm10-clow) + ilow
}

function calculateNo2Limits(c){
    if (0<c && c<=53) return [0, 53, 1]
    else if(53<c && c<=100) return [53, 100, 2]
    else if(100<c && c<=360) return [100, 360, 3]
    else if(360<c && c<=649) return [360, 649, 4]
    else if(650<c && c<=1249) return [350, 1249, 5]
    else if(1249<c && c<=1649) return [1249, 1649, 6]
    else return [1650, 2049, 7]
}

function calculateCoLimits(c) {
    if (0<c && c<=4.4) return [0, 4.4, 1]
    else if(4.4<c && c<=9.4) return [4.4, 9.4, 2]
    else if(9.4<c && c<=12.4) return [9.4, 12.4, 3]
    else if(12.4<c && c<=15.4) return [12.4, 15.4, 4]
    else if(15.4<c && c<=30.4) return [15.4, 30.4, 5]
    else if(30.4<c && c<=40.4) return [30.4, 40.4, 6]
    else return[40.5, 50.4, 7]
}

function calculateSo2Limits(c){
    if (0<c && c<=35) return [0, 35, 1]
    else if(35<c && c<=75) return [35, 75, 2]
    else if(75<c && c<=185) return [75, 185, 3]
    else if(185<c && c<=304) return [185, 304, 4]
    else if(304<c && c<=604) return [304, 604, 5]
    else if(604<c && c<=804) return [604, 804, 6]
    else return [805, 1004, 7]
}


function calculatePm10Limits(c) {
    if (0<c && c<=54) return [0, 54, 1]
    else if(54<c && c<=154) return [54, 154, 2]
    else if(154<c && c<=254) return [154, 254, 3]
    else if(254<c && c<=354) return [254, 354, 4]
    else if(354<c && c<=424) return [324, 454, 5]
    else if(424<c && c<=504) return [424, 504, 6]
    else return [505, 604, 7]
}


function calculatePm25Limits(c) {
    if (0<c && c<=12) return [0, 12, 1]
    else if(12.1<c && c<=35.4) return [12.1, 35.4, 2]
    else if(35.4<c && c<=55.4) return [35.5, 55.4, 3]
    else if(55.4<c && c<=150.4) return [55.5, 150.4, 4]
    else if(150.4<c && c<=250.4) return [150.5, 250.4, 5]
    else if(250.4<c && c<=350.4) return [250.4, 350.4, 6]
    else return [350.5, 500.4, 7]
}

function calculateO3Limits(o3, row){
    if (0<o3 && o3<=60) return [0, 60, 1]
    else if(60<o3 && o3<=125) return [61, 125, 2]
    else if(125<o3 && o3<=164) return [125, 164, 3]
    else if(164<o3 && o3<=204) return [165, 204, 4]
    else if(204<o3 && o3<=404) return [205, 404, 5]
    else if(404<o3 && o3<=504) return [405, 504, 6]
    else return [505, 604, 7]
}

function calculateIndexLimits(row) {
    let arr = [[0, 50], [51,100], [101,150], [151,200], [201,300], [301,400], [401,500]]
    return arr[row-1]
}

function printResult(res) {
    console.log(res)
    /*
    const col = document.getElementById("col-result")
    const row = document.createElement("div")
    row.classList.add("service-item")
    row.classList.add(getColorForField(res))
    
    const h4 = document.createElement("h4")
     h4.innerHTML = "Air Quality Index is " + Math.round(res * 100) / 100 
    row.appendChild(h4)
    col.appendChild(row)
    */
    
    const section = document.createElement('section')
    section.setAttribute("id", "about")
    section.classList.add("page-section")
    section.innerHTML = `<div class="container-fluid">
                <div class="row">
                    <div id="col-result"class="col-md-12">
                    
                        <div id="row-result" class="service-item ${getColorForField(res)}">
                            <h4 id="result">Air Polution Index is : ${Math.round(res * 100) / 100}</h4>
                        </div>
                    
                    </div>
                </div>
            </div>`
    document.getElementsByTagName("BODY")[0].appendChild(section) 
}

function getColorForField(res) {
    if (res <= 25) {
        return 'one-service'
    } else if (res <= 50) {
        return 'two-service'
    } else if (res <= 75) {
        return 'three-service'
    } else if (res <= 100) {
        return 'four-service'
    } else if (res <= 125) {
        return 'five-service'
    } else if (res <= 150) {
        return 'six-service'
    } else if (res <= 175) {
        return 'seven-service' 
    } else if (res <= 200) {
        return 'eight-service' 
    } else if (res <= 250) {
        return 'nine-service'
    } else if (res <= 300) {
        return 'ten-service'
    } else {
        return'eleven-service'
    }
}

