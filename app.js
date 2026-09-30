// State
let altitude = 0; // meters
let boilingPoint = 100.0; // °C
let vStart = 5.0;
let vEnd = 7.0;
let mass = 2.0; // kg
let selectedThickness = 1.5; // cm
let currentTotalTime = 12.0;
let countdownInterval;

// Elements
const inputAlt = document.getElementById('input-alt');
const boilDisplay = document.getElementById('boil-display');
const btnGps = document.getElementById('btn-gps');
const gpsStatus = document.getElementById('gps-status');

const sliderStart = document.getElementById('slider-start');
const sliderEnd = document.getElementById('slider-end');
const valStart = document.getElementById('val-start');
const valEnd = document.getElementById('val-end');
const massDisplay = document.getElementById('mass-display');

const thicknessBtns = document.querySelectorAll('.thickness-btn');
const timeDisplay = document.getElementById('time-display');
const btnCook = document.getElementById('btn-cook');

const timerOverlay = document.getElementById('timer-overlay');
const timerTitle = document.getElementById('timer-title');
const timerTargetInfo = document.getElementById('timer-target-info');
const countdownDisplay = document.getElementById('countdown-display');
const btnCancelTimer = document.getElementById('btn-cancel-timer');

// Logic
function updatePhysics() {
    // A: Atmosfærisk Kokepunkt-Kalkulator
    // Hver 300. meter reduserer kokepunktet med ca 1 °C
    boilDisplay.innerText = boilingPoint.toFixed(1) + ' °C';

    // B: Arkimedes' Massemåler
    vStart = parseFloat(sliderStart.value);
    vEnd = parseFloat(sliderEnd.value);
    
    // Sikre at slutt alltid er >= start
    if (vEnd < vStart) {
        vEnd = vStart;
        sliderEnd.value = vStart;
    }
    
    valStart.innerText = vStart.toFixed(1);
    valEnd.innerText = vEnd.toFixed(1);
    
    mass = vEnd - vStart;
    massDisplay.innerText = mass.toFixed(1) + ' kg';

    // C: Fourier Varmeledning & Tykkelsesfaktor
    // Base diffusjonstid (tilpasset kulinarisk erfaring for 60°C kjerne)
    let baseTime = 0;
    if (selectedThickness === 1.5) baseTime = 5.0;
    else if (selectedThickness === 3.0) baseTime = 12.0;
    else if (selectedThickness === 5.0) baseTime = 25.0;

    // Høyde-kompensasjon: ca 12% lengre tid per 1000m (ca 3.3 grader dropp)
    // Formula: 1 + (100 - T_boil) * 0.04
    const altFactor = 1 + ((100.0 - boilingPoint) * 0.04);
    
    // Masse-kompensasjon: Mye fisk i kjelen kjøler ned vannet, legg på litt ekstra tid
    const massPenalty = mass * 0.5; // 30 sekunder ekstra per kg fisk

    const totalTime = (baseTime * altFactor) + massPenalty;
    currentTotalTime = totalTime;
    timeDisplay.innerText = totalTime.toFixed(1);
}

// Event Listeners
inputAlt.addEventListener('input', () => {
    altitude = parseFloat(inputAlt.value) || 0;
    boilingPoint = 100.0 - (altitude / 300.0);
    gpsStatus.innerText = "Høyde satt manuelt.";
    updatePhysics();
});

sliderStart.addEventListener('input', updatePhysics);
sliderEnd.addEventListener('input', updatePhysics);

thicknessBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Reset styles
        thicknessBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'border-blue-500');
            b.classList.add('bg-slate-700', 'border-slate-600');
            b.querySelector('span').classList.remove('text-blue-200');
            b.querySelector('span').classList.add('text-slate-400');
        });

        // Set active
        const target = e.currentTarget;
        target.classList.remove('bg-slate-700', 'border-slate-600');
        target.classList.add('bg-blue-600', 'border-blue-500');
        target.querySelector('span').classList.remove('text-slate-400');
        target.querySelector('span').classList.add('text-blue-200');

        selectedThickness = parseFloat(target.dataset.thickness);
        updatePhysics();
    });
});

btnGps.addEventListener('click', () => {
    btnGps.innerText = "Henter...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock høyde hvis API-et mangler altitude (skjer ofte i desktop-browsere)
                const currentAlt = position.coords.altitude !== null ? position.coords.altitude : Math.floor(Math.random() * 800) + 400; // Mock 400-1200m
                
                altitude = currentAlt;
                boilingPoint = 100.0 - (altitude / 300.0);
                inputAlt.value = Math.round(altitude);
                
                btnGps.innerText = "Oppdatert";
                btnGps.classList.remove('bg-blue-600');
                btnGps.classList.add('bg-emerald-600');
                gpsStatus.innerText = "GPS-data innhentet suksessfullt.";
                
                updatePhysics();
                
                setTimeout(() => {
                    btnGps.innerText = "Hent GPS";
                    btnGps.classList.remove('bg-emerald-600');
                    btnGps.classList.add('bg-blue-600');
                }, 3000);
            },
            (error) => {
                console.error(error);
                btnGps.innerText = "Feilet";
                gpsStatus.innerText = "Kunne ikke hente GPS. Sjekk tillatelser.";
                setTimeout(() => { btnGps.innerText = "Hent GPS"; }, 3000);
            },
            { enableHighAccuracy: true }
        );
    } else {
        gpsStatus.innerText = "Geolokasjon støttes ikke av nettleseren.";
        btnGps.innerText = "Ikke støttet";
    }
});

btnCook.addEventListener('click', () => {
    // Show overlay
    timerOverlay.classList.remove('hidden');
    setTimeout(() => timerOverlay.classList.remove('opacity-0'), 10);
    
    // Reset styling if it was completed earlier
    timerTitle.innerText = "TREKKER FISK";
    timerTitle.classList.remove('text-red-400', 'animate-pulse');
    timerTitle.classList.add('text-blue-400');
    
    timerTargetInfo.innerText = `Beregnet tid: ${currentTotalTime.toFixed(1)} minutter`;
    
    const endTime = Date.now() + currentTotalTime * 60 * 1000;
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerText = "00:00";
            timerTitle.innerText = "FISKEN ER KLAR!";
            timerTitle.classList.remove('text-blue-400');
            timerTitle.classList.add('text-red-400', 'animate-pulse');
        } else {
            const totalSeconds = Math.floor(remaining / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            countdownDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 200);
});

btnCancelTimer.addEventListener('click', () => {
    clearInterval(countdownInterval);
    timerOverlay.classList.add('opacity-0');
    setTimeout(() => timerOverlay.classList.add('hidden'), 300);
});

// Init
updatePhysics();
