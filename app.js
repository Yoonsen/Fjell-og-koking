// State
let currentMode = 'fisk'; // 'fisk' or 'egg'
let altitude = 0; // meters
let boilingPoint = 100.0; // °C
let vStart = 6.0;
let vEnd = 6.5;
let mass = 2.0; // kg
let selectedThickness = 1.5; // cm
let selectedStartTemp = 4; // °C
let selectedCoreTemp = 55; // °C
let eggMass = 60; // g
let eggStartTemp = 4; // °C
let eggYolkTemp = 70; // °C
let eggMethod = 'kjele'; // 'kjele' or 'termos'
let currentTotalTime = 12.0;
let countdownInterval;

// Elements
const modeFisk = document.getElementById('mode-fisk');
const modeEgg = document.getElementById('mode-egg');
const modulB = document.getElementById('modul-b');
const modulC = document.getElementById('modul-c');
const modulEgg = document.getElementById('modul-egg');

const inputAlt = document.getElementById('input-alt');
const boilDisplay = document.getElementById('boil-display');
const btnGps = document.getElementById('btn-gps');
const gpsStatus = document.getElementById('gps-status');

const selectPotVolume = document.getElementById('select-pot-volume');
const sliderStart = document.getElementById('slider-start');
const sliderEnd = document.getElementById('slider-end');
const valStart = document.getElementById('val-start');
const valEnd = document.getElementById('val-end');
const massDisplay = document.getElementById('mass-display');

const thicknessBtns = document.querySelectorAll('.thickness-btn');
const startTempBtns = document.querySelectorAll('.starttemp-btn');
const coreTempBtns = document.querySelectorAll('.coretemp-btn');

const eggSizeBtns = document.querySelectorAll('.eggsize-btn');
const eggStartBtns = document.querySelectorAll('.eggstart-btn');
const eggYolkBtns = document.querySelectorAll('.eggyolk-btn');
const eggMethodBtns = document.querySelectorAll('.eggmethod-btn');
const eggWarning = document.getElementById('egg-warning');
const eggWarningText = document.getElementById('egg-warning-text');

const timeDisplay = document.getElementById('time-display');
const cookActionText = document.getElementById('cook-action-text');
const cookMethodText = document.getElementById('cook-method-text');
const btnCook = document.getElementById('btn-cook');

const eqWarning = document.getElementById('eq-warning');
const eqTempDisplay = document.getElementById('eq-temp-display');

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

    if (currentMode === 'fisk') {
        // B: Arkimedes' Massemåler
        vStart = parseFloat(sliderStart.value);
        vEnd = parseFloat(sliderEnd.value);
        const potVolume = parseFloat(selectPotVolume.value);
        
        if (vEnd < vStart) {
            vEnd = vStart;
            sliderEnd.value = vStart;
        }
        
        valStart.innerText = vStart.toFixed(1);
        valEnd.innerText = vEnd.toFixed(1);
        
        mass = ((vEnd - vStart) / 10) * potVolume;
        
        if (mass < 1.0 && mass > 0) {
            massDisplay.innerText = (mass * 1000).toFixed(0) + ' g';
        } else {
            massDisplay.innerText = mass.toFixed(2) + ' kg';
        }

        // C: Fourier Varmeledning
        let baseTime = 0;
        if (selectedThickness === 1.5) baseTime = 5.0;
        else if (selectedThickness === 3.0) baseTime = 12.0;
        else if (selectedThickness === 5.0) baseTime = 25.0;

        const baselineLog = 0.7576;
        let tempDiffRatio = (boilingPoint - selectedStartTemp) / (boilingPoint - selectedCoreTemp);
        if (tempDiffRatio < 1.1) tempDiffRatio = 1.1;
        
        const fourierLogFactor = Math.log(tempDiffRatio);
        const timeTempFactor = fourierLogFactor / baselineLog;
        
        const massPenalty = mass * 0.5;

        let totalTime = (baseTime * timeTempFactor) + massPenalty;
        if (totalTime < 1) totalTime = 1;
        
        currentTotalTime = totalTime;
        timeDisplay.innerText = totalTime.toFixed(1);

        // D: Termisk Likevekt-vakt
        const waterMass = (vStart / 10) * potVolume; 
        if (waterMass > 0 && mass > 0) {
            const eqTemp = ((waterMass * boilingPoint) + (mass * selectedStartTemp)) / (waterMass + mass);
            const safeBufferTemp = Math.max(75.0, selectedCoreTemp + 10.0);
            
            if (eqTemp < safeBufferTemp) {
                eqTempDisplay.innerText = eqTemp.toFixed(1);
                eqWarning.classList.remove('hidden');
            } else {
                eqWarning.classList.add('hidden');
            }
        } else {
            eqWarning.classList.add('hidden');
        }

        cookActionText.innerText = 'KOK OPP TIL ROULERENDE BOBLER';
        cookMethodText.innerText = 'TREKK';
        
    } else if (currentMode === 'egg') {
        let effectiveBoil = boilingPoint;
        let timeMultiplier = 1.0;
        
        if (eggMethod === 'termos') {
            effectiveBoil = boilingPoint - 5.0; // Varmetap ved fylling og termisk likevekt
            timeMultiplier = 1.4; // Manglende sirkulasjon og fallende temp
        }

        let denominator = effectiveBoil - eggYolkTemp;
        
        if (denominator < 0.5) {
            eggWarning.classList.remove('hidden');
            if (eggMethod === 'termos') {
                eggWarningText.innerText = "Vannet i termosen blir ikke varmt nok til å få dette resultatet. Prøv et bløtere egg, eller bruk kjele!";
            } else {
                eggWarningText.innerText = "Vannet koker ved for lav temperatur til å oppnå valgt resultat innen rimelig tid. Kanskje speilegg er bedre i dag?";
            }
            denominator = 0.5; // Cap to avoid infinite/NaN
            currentTotalTime = 99.0;
        } else {
            eggWarning.classList.add('hidden');
            const fourierEggLog = Math.log(2 * (effectiveBoil - eggStartTemp) / denominator);
            // K = 0.238 based on standard calibration for eggs in minutes
            currentTotalTime = (0.238 * Math.pow(eggMass, 2/3) * fourierEggLog) * timeMultiplier;
        }

        eqWarning.classList.add('hidden'); // Fish capacity warning doesn't apply
        timeDisplay.innerText = currentTotalTime.toFixed(1);

        if (eggMethod === 'termos') {
            cookActionText.innerText = 'LEGG EGG I TERMOS, HELL PÅ KOKENDE VANN';
            cookMethodText.innerText = 'LUKK OG TREKK';
        } else {
            cookActionText.innerText = 'KOK OPP VANN, LEGG I EGG';
            cookMethodText.innerText = 'SMÅKOK';
        }
    }
}

// Event Listeners
modeFisk.addEventListener('click', () => {
    currentMode = 'fisk';
    modeFisk.classList.remove('text-stone-600');
    modeFisk.classList.add('bg-white', 'text-emerald-800', 'shadow-sm', 'font-bold');
    modeEgg.classList.remove('bg-white', 'text-emerald-800', 'shadow-sm', 'font-bold');
    modeEgg.classList.add('text-stone-600');
    
    modulB.classList.remove('hidden');
    modulC.classList.remove('hidden');
    modulEgg.classList.add('hidden');
    
    updatePhysics();
});

modeEgg.addEventListener('click', () => {
    currentMode = 'egg';
    modeEgg.classList.remove('text-stone-600');
    modeEgg.classList.add('bg-white', 'text-emerald-800', 'shadow-sm', 'font-bold');
    modeFisk.classList.remove('bg-white', 'text-emerald-800', 'shadow-sm', 'font-bold');
    modeFisk.classList.add('text-stone-600');
    
    modulB.classList.add('hidden');
    modulC.classList.add('hidden');
    modulEgg.classList.remove('hidden');
    
    updatePhysics();
});

inputAlt.addEventListener('input', () => {
    altitude = parseFloat(inputAlt.value) || 0;
    boilingPoint = 100.0 - (altitude / 300.0);
    gpsStatus.innerText = "Høyde satt manuelt.";
    updatePhysics();
});

sliderStart.addEventListener('input', updatePhysics);
sliderEnd.addEventListener('input', updatePhysics);
selectPotVolume.addEventListener('change', updatePhysics);

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

eggSizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(eggSizeBtns, e.currentTarget);
        eggMass = parseFloat(e.currentTarget.dataset.mass);
        updatePhysics();
    });
});

eggStartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(eggStartBtns, e.currentTarget);
        eggStartTemp = parseFloat(e.currentTarget.dataset.temp);
        updatePhysics();
    });
});

eggYolkBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(eggYolkBtns, e.currentTarget);
        eggYolkTemp = parseFloat(e.currentTarget.dataset.temp);
        updatePhysics();
    });
});

eggMethodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        setBtnActive(eggMethodBtns, e.currentTarget);
        eggMethod = e.currentTarget.dataset.method;
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
    
    if (currentMode === 'fisk') {
        timerTitle.innerText = "TREKKER FISK";
        timerTargetInfo.innerText = `Mål: ${selectedCoreTemp}°C (${currentTotalTime.toFixed(1)} min)`;
    } else {
        timerTitle.innerText = "KOKER EGG";
        let targetText = "Hardkokt";
        if (eggYolkTemp === 63) targetText = "Bløtkokt";
        else if (eggYolkTemp === 70) targetText = "Smilende";
        timerTargetInfo.innerText = `Resultat: ${targetText} (${currentTotalTime.toFixed(1)} min)`;
    }
    
    timerTitle.classList.remove('text-red-500', 'animate-pulse');
    timerTitle.classList.add('text-emerald-500');
    
    const endTime = Date.now() + currentTotalTime * 60 * 1000;
    
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerText = "00:00";
            if (currentMode === 'fisk') {
                timerTitle.innerText = "FISKEN ER KLAR!";
            } else {
                timerTitle.innerText = "EGGET ER KLART!";
            }
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
