function getInfectionData(duration) {
    const infectionLabels = Object.values(stateDt).slice(-duration);
    
    const datasets = [
        {
            label: '확진자',
            backgroundColor: 'rgb(132, 99, 255)',
            borderColor: 'rgb(132, 99, 255)',
            data: Object.values(decide).slice(-duration),
            pointRadius: 0,
            yAxisID: 'y1',
            borderWidth: 3,
        },
        {
            label: '사망자',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: Object.values(death).slice(-duration),
            pointRadius: 0,
            yAxisID: 'y2',
        },
    ];
    
    if(duration == 7) {
        
    } else if(duration == 31) {
        datasets[0]['borderWidth'] = 2;
        datasets[1]['borderWidth'] = 2;
    } else {
        datasets[0]['borderWidth'] = 1;
        datasets[1]['borderWidth'] = 1;
    }
    
    const infectionData = {
        labels: infectionLabels,
        datasets: datasets,
    };
    
    return infectionData;
}

function getInfectionConfig(duration) {

    const infectionConfig = {
        type: 'line',
        data: getInfectionData(duration),
        options: {
            scales: {
                y1: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: '확진자(명)',
                    },
                    position: 'left',
                },
                y2: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: '사망자(명)',
                    },
                    position: 'right',
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    return infectionConfig;
}

function getVaccinationData(duration) {
    
    const vaccinationLabels = Object.values(baseDate).slice(-duration);
    
    const datasets = [
        {
            label: '1차 접종',
            backgroundColor: 'rgba(0, 0, 127, 0.1)',
            borderWidth: 0,
            data: Object.values(totalFirstCntPercent).slice(-duration),
            pointRadius: 0,
            fill: true,
        },
        {
            label: '2차 접종',
            backgroundColor: 'rgba(0, 0, 127, 0.3)',
            borderWidth: 0,
            data: Object.values(totalSecondCntPercent).slice(-duration),
            pointRadius: 0,
            fill: true,
        },
        {
            label: '3차 접종',
            backgroundColor: 'rgba(0, 0, 127, 0.5)',
            borderWidth: 0,
            data: Object.values(totalThirdCntPercent).slice(-duration),
            pointRadius: 0,
            fill: true,
        },
    ];
    
    if(duration == 7) {
        
    } else if(duration == 31) {
        
    } else {
    }

    const vaccinationData = {
        labels: vaccinationLabels,
        datasets: datasets,
    };
    
    return vaccinationData;
}

function getVaccinationConfig(duration) {

    const vaccinationConfig = {
        type: 'line',
        data: getVaccinationData(duration),
        options: {
            scales: {
                x: {
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: '접종률(%)'
                    },
                },

            },
            plugins: {
                toolip: {
                    callbacks: {

                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        },
    };
    
     if(duration == 7) {
        
    } else if(duration == 31) {
        
    } else {
        vaccinationConfig['options']['scales']['y']['beginAtZero'] = true;
        vaccinationConfig['options']['scales']['y']['min'] = 0;
        vaccinationConfig['options']['scales']['y']['max'] = 100;
    }
    
    return vaccinationConfig;
}


function setInfection(duration) {
    infectionChart.data = getInfectionData(duration);
    infectionChart.update();  
}

function setVaccination(duration) {
    vaccinationChart.data = getVaccinationData(duration);
    vaccinationChart.update();
}

function getRadioValue(name) {
    const list = document.getElementsByName(name);
    
    let value;
    
    list.forEach((node) => {
        if(node.checked) {
            value = node.value;
        }
    })
    
    return value;
}

// CHART SETTING
const infectionDuration = getRadioValue('infection_duration');
const vaccinationDuration = getRadioValue('vaccination_duration');

const infectionChart = new Chart(document.getElementById('infectionChart'), getInfectionConfig(infectionDuration));
const vaccinationChart = new Chart(document.getElementById('vaccinationChart'), getVaccinationConfig(vaccinationDuration));


// FIGURE SETTING
const decideUp = document.getElementById("decideUp");
const decideDown = document.getElementById("decideDown");
const decideDelta = document.getElementById("decideDelta");

if(today.decideDelta[0] === "-") {
    decideUp.style.display = 'none';
    decideDown.style.display = 'inline';
    decideDown.style.fill = 'rgb(132, 99, 255)'
    decideDelta.style.color = 'rgb(132, 99, 255)'
} else {
    decideUp.style.display = 'inline';
    decideUp.style.fill = 'rgb(255, 99, 132)';
    decideDown.style.display = 'none';
    decideDelta.style.color = 'rgb(255, 99, 132)';
}

const deathUp = document.getElementById("deathUp");
const deathDown = document.getElementById("deathDown");

if(today.deathDelta[0] === "-") {
    deathUp.style.display = 'none';
    deathDown.style.display = 'inline';
    deathDown.style.fill = 'rgb(132, 99, 255)'
    deathDelta.style.color = 'rgb(132, 99, 255)'
} else {
    deathUp.style.display = 'inline';
    deathUp.style.fill = 'rgb(255, 99, 132)';
    deathDown.style.display = 'none';
    deathDelta.style.color = 'rgb(255, 99, 132)';
}

// MAP SETTING
function mixColor(color1, color2, ratio) {
    let r = Math.round(parseInt('0x'+color1.slice(1, 3)) * ratio + parseInt('0x'+color2.slice(1, 3)) * (1-ratio));
    let g = Math.round(parseInt('0x'+color1.slice(3, 5)) * ratio + parseInt('0x'+color2.slice(3, 5)) * (1-ratio));
    let b = Math.round(parseInt('0x'+color1.slice(5, 7)) * ratio + parseInt('0x'+color2.slice(5, 7)) * (1-ratio));
    
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    
    if(r.length == 1) {
        r = '0'+r;
    }
    if(g.length == 1) {
        g = '0'+g;
    }
    if(b.length == 1) {
        b = '0'+b;
    }
    
    const color = '#'+r+g+b;
    return color;
}

const oversea = sido['검역']['incDec'];
delete sido['검역'];
const sum = sido['합계'];
delete sido['합계'];

const incDec = [];
const qurRate = [];

for(const key in sido) {
    incDec.push(parseInt(sido[key]['incDec']));
    qurRate.push(parseInt(sido[key]['qurRate']));
}

const incDecRange = Math.max(...incDec) - Math.min(...incDec);
const qurRateRange = Math.max(...qurRate) - Math.min(...qurRate);

for(const key in sido) {
    const area = document.getElementById(key);
    const rate = ((sido[key]['qurRate'] - Math.min(...qurRate)) / qurRateRange) * 0.8 + 0.2;
    area.style.fill = mixColor('#ff6384', '#ffffff', rate);
    area.addEventListener("click", () => {
        const h4 = document.getElementById('sido_title');
        const p = document.getElementById('sido_figure');
        
        h4.innerHTML = key;
        p.innerHTML = '확진자: '+sido[key]['incDec']+'명<br>'
            +'10만명당 발생률: '+sido[key]['qurRate'];
    });
    area.addEventListener("mouseover", () => {
        const h4 = document.getElementById('sido_title');
        const p = document.getElementById('sido_figure');
        
        h4.innerHTML = key;
        p.innerHTML = '확진자: '+sido[key]['incDec']+'명<br>'
            +'10만명당 발생률: '+sido[key]['qurRate'];
        
        // const path = area;
        // const path_length = path.getTotalLength();
        // console.log(path.id, path_length);
        // path.style.strokeDasharray = path_length + ' ' + path_length;
        // path.style.strokeDashoffset = path_length;
    });
    
    
    
}

// const pathes = document.querySelectorAll('path');
// pathes.forEach((path) => {
//     const path_length = path.getTotalLength();
//     console.log(path.id, path_length);
//     path.style.strokeDasharray = path_length + ' ' + path_length;
//     path.style.strokeDashoffset = path_length;
// });
