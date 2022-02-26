function getInfectionData(duration) {
    const infectionLabels = Object.values(baseDate).slice(-duration);

    const infectionData = {
        labels: infectionLabels,
        datasets: [
            {
                label: '확진자',
                backgroundColor: 'rgb(132, 99, 255)',
                borderColor: 'rgb(132, 99, 255)',
                data: Object.values(decide).slice(-duration),
                pointRadius: 0,
                yAxisID: 'y1',
            },
            {
                label: '사망자',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: Object.values(death).slice(-duration),
                pointRadius: 0,
                yAxisID: 'y2',
            },
        ],
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

    const vaccinationData = {
        labels: vaccinationLabels,
        datasets: [
            {
                label: '1차 접종',
                backgroundColor: 'rgba(0, 0, 127, 0.1)',
                borderColor: 'rgba(0, 0, 127, 0.2)',
                data: Object.values(totalFirstCntPercent).slice(-duration),
                pointRadius: 0,
                fill: true,
            },
            {
                label: '2차 접종',
                backgroundColor: 'rgba(0, 0, 127, 0.2)',
                borderColor: 'rgba(0, 0, 127, 0.2)',
                data: Object.values(totalSecondCntPercent).slice(-duration),
                pointRadius: 0,
                fill: true,
            },
            {
                label: '3차 접종',
                backgroundColor: 'rgba(0, 0, 127, 0.3)',
                borderColor: 'rgba(0, 0, 127, 0.2)',
                data: Object.values(totalThirdCntPercent).slice(-duration),
                pointRadius: 0,
                fill: true,
            },
        ],
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
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: '접종률(%)'
                    },
                    min: 0,
                    max: 100,
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

const infectionDuration = getRadioValue('infection_duration');
const vaccinationDuration = getRadioValue('vaccination_duration');

let infectionChart = new Chart(document.getElementById('infectionChart'), getInfectionConfig(infectionDuration));
let vaccinationChart = new Chart(document.getElementById('vaccinationChart'), getVaccinationConfig(vaccinationDuration));

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