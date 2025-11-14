
## Opis projekta

Ova aplikacija omogućuje učenje stranog jezika pomoću metode **ponavljanja s odmakom (spaced repetition)** — dokazane tehnike za dugoročno pamćenje vokabulara.  
Korisnici (učenici) uče nove riječi kroz interaktivna pitanja i odgovore, a svaka riječ napreduje kroz niz "posuda" ovisno o točnosti odgovora.  
Točne odgovore sustav nagrađuje pomicanjem riječi u posudu s duljim vremenskim odmakom, dok se netočni vraćaju u prvu posudu.  
Riječi koje dosegnu zadnju posudu smatraju se naučenima.

Projekt je razvijen u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu i ima za cilj implementaciju funkcionalnog sustava koji povezuje baze podataka, autentifikaciju korisnika, upravljanje rječnicima i integraciju s vanjskim API-jem za jezične savjete.

---

## Ciljevi projekta

- Razviti aplikaciju koja podržava učinkovito učenje jezika pomoću ponavljanja s odmakom.  
- Omogućiti administratorima dodavanje i uređivanje riječi te rječnika.  
- Osigurati učenicima personalizirano iskustvo učenja s praćenjem napretka.  
- Implementirati više modova učenja (tekstualni, slušni, izgovorni).  
- Integrirati vanjski rječnik (API) za dobivanje opisa i prijevoda riječi.  
- Implementirati jednostavni servis za simulaciju ocjene kvalitete izgovora.  
- Uvesti **OAuth 2.0 autentifikaciju** za siguran pristup korisnika.

---

## Funkcionalnosti

### Za administratore:
- Kreiranje i uređivanje rječnika (npr. engleski, njemački, francuski).  
- Dodavanje novih riječi uz pomoć vanjskog rječnika (API integracija).  
- Uređivanje postojećih riječi (prijevod, fraze, izgovor).  
- Brisanje riječi ili rječnika.  
- Upravljanje korisnicima (dodavanje novih administratora).

### Za učenike:
- Registracija putem e-mail adrese (uz verifikaciju putem e-pošte).  
- Prva prijava uz obveznu promjenu inicijalne lozinke.  
- Odabir jezika i rječnika za učenje.  
- Različiti modovi učenja:
  - Strana riječ → hrvatski prijevod (višestruki izbor)  
  - Hrvatska riječ → strani prijevod (višestruki izbor)  
  - Izgovor strane riječi → unos točne strane riječi  
  - Strana riječ → snimanje vlastitog izgovora  
- Praćenje napretka u učenju (na temelju posuda).  
- Brisanje vlastitog korisničkog računa.

---

## Tehnologije



### Backend:
- Node.js
- ...

### Frontend:
- ReactJS
- ...

### Baza podataka:
- PostgreSQL
- ...

### Ostalo:
- GitHub za verzioniranje  
- (Vanjski rječnik API - moramo još odrediti...)
- (alat za kreaciju sekvencijskih dijagrama – moramo još odrediti...) 

---

## Struktura sustava

1. **Korisnici**
   - Učenici  
   - Administratori (uključujući korijenskog administratora)

2. **Rječnici**
   - Grupirani po jeziku  
   - Svaki sadrži niz riječi

3. **Riječi**
   - Strana riječ  
   - Fraze i opis  
   - Hrvatski prijevod i fraze  
   - Glasovna datoteka izgovora

4. **Sustav posuda**
   - Posuda 1: 1 dan  
   - Posuda 2: 2 dana  
   - Posuda 3: 4 dana  
   - Posuda 4: 1 tjedan  
   - Posuda 5: 2–4 tjedna  
   - Nakon zadnje posude — riječ se smatra naučenom

---
## Demo

Možete vidjeti **live verziju** aplikacije ovdje: https://fmimage.onrender.com


---

## Autentifikacija

Autentifikacija korisnika provodi se putem **OAuth 2.0** protokola.  
Korisnici se prijavljuju pomoću e-mail adrese i lozinke, a inicijalna lozinka se automatski generira i šalje putem e-maila.  
Na prvoj prijavi korisnik mora postaviti novu lozinku.

---

## Članovi tima

- [Filip Jengić](https://github.com/filipjengic)
- [Fran Juričić](https://github.com/FranJuricic)
- [Eva Kitonić](https://github.com/evakitonic)
- [Nikša Mujo](https://github.com/niksamujo1)
- [Dora Zaninović](https://github.com/doraZanin)
- [Ema Zebić](https://github.com/emazebic)


---

## Planirani rezultati

- Funkcionalna web aplikacija za učenje jezika.  
- Demonstracija učenja na primjeru engleskog jezika.  
- Omogućeno dodavanje novih jezika i rječnika.  
- Spremanje napretka i prilagodba vremena ponavljanja.  
- Siguran i jednostavan korisnički sustav.

---

## Licenca

Ovaj projekt razvijen je isključivo u edukativne svrhe u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu.  
Sav kod i podaci mogu se slobodno koristiti za potrebe učenja i demonstracije.

