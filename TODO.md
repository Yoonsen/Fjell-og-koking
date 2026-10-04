# 📋 TermoFisk OS - Veien Videre (TODOs)

Dette dokumentet holder styr på ideer, forbedringer og fysikk-justeringer for fremtidige versjoner av TermoFisk OS.

### 🐟 Kjernefysikk & Algoritmer
- [ ] **Antall fiskestykker:** Vurdere om vi skal legge inn en input for *antall stykker*. I ren Fourier-varmeledning er det tykkelsen ($L$) som dikterer tiden, ikke antallet. Men mange stykker kan kjøle ned vannet mer i starten, eller påvirke vannsirkulasjonen i kjelen. Massen (via Arkimedes) fanger opp mye av varme-droppet, men antall stykker kan bidra til å finjustere "vann-avkjølings-straffen".

### 🎨 Brukergrensesnitt (UI / UX)
- [ ] **Visuelle Indikatorer:** Legge inn illustrasjoner av kjelen med vannstand før/etter, gjerne med en liten fisk som senkes nedi for å gjøre Arkimedes-prinsippet visuelt og enda mer feilsikkert i felt.
- [ ] **Lyd og Vibrasjon:** Sørge for at alarmen "FISKEN ER KLAR!" faktisk spiller av en lyd eller vibrerer telefonen, slik at man kan sitte i ly for vinden mens man venter.

### 📱 Distribusjon
- [ ] **Native App Store:** Hvis appen slår an, bruke Capacitor for å pakke den inn til Apple App Store og Google Play Store.

---
*Har du flere ideer fra feltkontoret? Legg dem til her!*
- [ ] **Spredningsfaktor:** Legge inn en faktor for hvor tett fisken ligger pakket. Ligger stykkene klistret inntil hverandre, minsker den effektive overflaten, noe som krever lenger trekketid.
- [ ] **AI-Eyeballing (Maskinsyn):** La brukeren ta et bilde (eller bruke live-kamera) av kjelen. En lokal AI-modell (f.eks. TensorFlow.js) beregner vannstandsendringen og tykkelsen på fisken automatisk – helt offline uten behov for 4G.
- [ ] **Fisketype (Mager vs Fet):** Legge til en toggle for Mager fisk (Torsk, Sei, Abbor) og Fet fisk (Laks, Ørret, Kveite). Fet fisk isolerer mer, og trenger typisk 10-15 % lenger tid for å nå samme kjernetemperatur gitt samme tykkelse.
