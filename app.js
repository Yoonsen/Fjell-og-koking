// State
let altitude = 0; // meters
let boilingPoint = 100.0; // °C
let vStart = 5.0;
let vEnd = 7.0;
let mass = 2.0; // kg
let selectedThickness = 1.5; // cm
let selectedStartTemp = 4; // °C
let selectedCoreTemp = 55; // °C
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
const startTempBtns = document.querySelectorAll('.starttemp-btn');
const coreTempBtns = document.querySelectorAll('.coretemp-btn');

const timeDisplay = document.getElementById('time-display');
const btnCook = document.getElementById('btn-cook');

const timerOverlay = document.getElementById('timer-overlay');
const timerTitle = document.getElementById('timer-title');
const timerTargetInfo = document.getElementById('timer-target-info');
const countdownDisplay = document.getElementById('countdown-display');
const btnCancelTimer = document.getElementById('btn-cancel-timer');

// Helper for UI buttons
function setBtnActive(allBtns, targetBtn) {
    allBtns.forEach(b => {
        b.classList.remove('bg-emerald-700', 'border-emerald-800', 'text-white', 'shadow-sm');
        b.classList.add('bg-stone-50', 'border-stone-300', 'text-stone-900', 'hover:bg-stone-100');
        b.querySelector('span').classList.remove('text-emerald-100');
        b.querySelector('span').classList.add('text-stone-500');
    });
    targetBtn.classList.remove('bg-stone-50', 'border-stone-300', 'text-stone-900', 'hover:bg-stone-100');
    targetBtn.classList.add('bg-emerald-700', 'border-emerald-800', 'text-white', 'shadow-sm');
    targetBtn.querySelector('span').classList.remove('text-stone-500');
    targetBtn.querySelector('span').classList.add('text-emerald-100');
}

// Logic
function updatePhysics() {
    // A: Atmosfærisk Kokepunkt-Kalkulator
    boilDisplay.innerText = boilingPoint.toFixed(1) + ' °C';

    // B: Arkimedes' Massemåler
    vStart = parseFloat(sliderStart.value);
    vEnd = parseFloat(sliderEnd.value);
    
    if (vEnd < vStart) {
        vEnd = vStart;
        sliderEnd.value = vStart;
    }
    
    valStart.innerText = vStart.toFixed(1);
    valEnd.innerText = vEnd.toFixed(1);
    mass = vEnd - vStart;
    massDisplay.innerText = mass.toFixed(1) + ' kg';

    // C: Fourier Varmeledning (Oppdatert formel)
    let baseTime = 0;
    if (selectedThickness === 1.5) baseTime = 5.0;
    else if (selectedThickness === 3.0) baseTime = 12.0;
    else if (selectedThickness === 5.0) baseTime = 25.0;

    // Fysisk diffusjons-koeffisient via logaritme: ln((Tw - Ti) / (Tw - Tc))
    // Baseline er kalibrert for Tw=100, Ti=4, Tc=55 => log(96/45) ≈ 0.7576
    const baselineLog = 0.7576;
    
    let tempDiffRatio = (boilingPoint - selectedStartTemp) / (boilingPoint - selectedCoreTemp);
    if (tempDiffRatio < 1.1) tempDiffRatio = 1.1; // Unngå for små marginer og evig koking
    
    const fourierLogFactor = Math.log(tempDiffRatio);
    const timeTempFactor = fourierLogFactor / baselineLog;
    
    // Masse-kompensasjon: Mye fisk = 30 sek ekstra pr kg
    const massPenalty = mass * 0.5;

    let totalTime = (baseTime * timeTempFactor) + massPenalty;
    if (totalTime < 1) totalTime = 1;
    
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
        setBtnActive(thicknessBtns, e.currentTarget);
        selectedThickness = parseFloat(e.currentTarget.dataset.thickness);
        updatePhysics();
    });
});

startTempBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(startTempBtns, e.currentTarget);
        selectedStartTemp = parseFloat(e.currentTarget.dataset.temp);
        updatePhysics();
    });
});

coreTempBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(coreTempBtns, e.currentTarget);
        selectedCoreTemp = parseFloat(e.currentTarget.dataset.temp);
        updatePhysics();
    });
});

btnGps.addEventListener('click', () => {
    btnGps.innerText = "Henter...";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentAlt = position.coords.altitude !== null ? position.coords.altitude : Math.floor(Math.random() * 800) + 400; 
                altitude = currentAlt;
                boilingPoint = 100.0 - (altitude / 300.0);
                inputAlt.value = Math.round(altitude);
                
                btnGps.innerText = "Oppdatert";
                gpsStatus.innerText = "GPS-data innhentet suksessfullt.";
                updatePhysics();
                
                setTimeout(() => { btnGps.innerText = "Hent GPS"; }, 3000);
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
        gpsStatus.innerText = "Ikke støttet";
    }
});

btnCook.addEventListener('click', () => {
    timerOverlay.classList.remove('hidden');
    setTimeout(() => timerOverlay.classList.remove('opacity-0'), 10);
    
    timerTitle.innerText = "TREKKER FISK";
    timerTitle.classList.remove('text-red-500', 'animate-pulse');
    timerTitle.classList.add('text-emerald-500');
    
    timerTargetInfo.innerText = `Mål: ${selectedCoreTemp}°C (${currentTotalTime.toFixed(1)} min)`;
    
    const endTime = Date.now() + currentTotalTime * 60 * 1000;
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerText = "00:00";
            timerTitle.innerText = "FISKEN ER KLAR!";
            timerTitle.classList.remove('text-emerald-500');
            timerTitle.classList.add('text-red-500', 'animate-pulse');
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
