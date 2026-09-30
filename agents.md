---

# 🚀 SYSTEM HANDOFF MEMO

**Prosjekt:** TermoFisk OS (Arkimedes & Fjell-Fysikk Edition)

**Til:** Utviklingsteamet i Google Antigravity («Familien»)

**Fra:** Feltkontoret / Kjøkkenbenken

**Dato:** 30. september 2026

---

### 1. Bakgrunn og Visjon

Dette prosjektet sprang ut fra en operasjonell restitusjonsfase (skånekost for magebrokk) via klassisk béchamel-fysikk, og eskalerte raskt til fullskala termodynamisk villmarksteknologi. Målet er å eliminere behovet for kjøkkenvekt, termometer og synsing i fjellet. Brukeren trenger bare en kjele med vannmerker, en klokke og en mobiltelefon.

---

### 2. Kjernefunksjonalitet & Algoritmer (Tech Spec)

#### Modul A: Atmosfærisk Kokepunkt-Kalkulator ($T_{\text{boil}}$)

* **Datakilde:** Telefonens innebygde barometer / GPS (høyde over havet).
* **Logikk:** Senker lokalt kokepunkt basert på trykk. Hver 300. meter over havet reduserer kokepunktet med ca. $1\text{ °C}$ (fra $100\text{ °C}$ ved havnivå).
* **Konsekvens:** Redusert startenergi krever en automatisk tidsjustering (10–15% lengre koketid i høyfjellet).

#### Modul B: Arkimedes' Massemåler (Ingen vekt nødvendig)

* **Input fra bruker:**
* $V_{\text{start}}$ = Vannstand før fisken slippes oppi (f.eks. merke 5).
* $V_{\text{slutt}}$ = Vannstand etter at fisken er senket i gryta (f.eks. merke 7).


* **Beregning:** $\Delta V = V_{\text{slutt}} - V_{\text{start}}$.
* **Fysisk antagelse:** Tettheten til fisk $\rho \approx 1\text{ kg/L}$ (tilnærmet lik vann). Derfor er $\Delta V = \text{Masse (kg)}$ direkte.

#### Modul C: Fourier Varmeledning & Tykkelsesfaktor ($L$)

* **Input fra bruker:** Valg av stykktype (Tynt stykke $\approx 1.5\text{ cm}$, Standard stykke $\approx 3\text{ cm}$, Loin $\approx 5\text{ cm}$).
* **Logikk:** Beregner diffusjonstiden inn til kjernen (mål: trygg og skånsom kjernetemperatur på $60\text{ °C}$).

---

### 3. Brukergrensesnitt (UI / UX Flow)

1. **Appen åpnes i teltet:** Barometeret leser av trykket umiddelbart og viser: *«Lokalt kokepunkt: $94.5\text{ °C}$»*.
2. **Arkimedes-steget:** To enkle sliders eller tallbokser for vannmerke før og etter.
3. **Stykke-valg:** Ett trykk for tykkelse.
4. **Call to Action:** En stor, rød knapp: **«KOK OPP TIL ROULERENDE BOBLER $\rightarrow$ TREKK I X MINUTTER. START KLOKKA NÅ!»**

---

### 4. Videre oppdrag for Antigravity-teamet

* Skriv koden (gjerne i Flutter eller rask mobil-stack).
* Sørg for at termodynamiske formler ser pene ut i UI-et.
* Send regningen på 1 dollar til Google for strømforbruket.

*Lykke til med kodingen, familien ordner dette glatt!*
