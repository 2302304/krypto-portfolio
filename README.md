# 💼 Kryptovaluutta Portfolio

Full-stack web-sovellus kryptovaluuttasijoitusten seurantaan ja analysointiin reaaliajassa.

## 📊 Projektin tiedot

**Tekijä:** Jani Harju  
**Koulu:** Vaasan Ammattikorkeakoulu  
**Tutkinto:** Tradenomi (Bachelor of Business Administration)  
**Opinnäytetyö:** 2025-2026 

---

## 🎯 Kuvaus

Kryptovaluutta Portfolio on moderniin teknologiaan perustuva web-sovellus, joka mahdollistaa käyttäjien seurata kryptovaluuttasijoituksiaan reaaliajassa. Sovellus tarjoaa kattavat työkalut transaktioiden hallintaan, portfolio-analyysiin ja markkinadatan seuraamiseen.

### Keskeiset ominaisuudet:

- **Portfolio-seuranta** - Näe portfoliosi arvo ja kehitys reaaliajassa
- **Transaktioiden hallinta** - Tallenna ja hallitse kaikki kryptovaluuttatransaktiot
- **Reaaliaikaiset hinnat** - CoinGecko API integraatio 30 kryptovaluutalle
- **Visualisoinnit** - Interaktiiviset kaaviot portfolio-analyysiin
- **Markkinanäkymä** - Top 100 kryptovaluuttaa markkinadatalla
- **Automaattinen laskenta** - Voitto/tappio, ROI%, keskihinnat

---

## 🚀 Teknologiat

### Backend:
- Node.js 18.x & Express 4.x
- PostgreSQL 15
- JWT autentikaatio
- CoinGecko API
- node-cron (ajastetut tehtävät)

### Frontend:
- React 18.2
- React Router 6.x
- Tailwind CSS 3.x
- Recharts 2.x (kaaviot)
- Axios

### DevOps:
- Docker & Docker Compose
- Git versionhallinta

---

## 📦 Asennus ja käyttöönotto

### Edellytykset:
- Docker Desktop
- Git

### Pika-asennus:

```bash
# 1. Kloonaa repositorio
git clone https://github.com/YOUR_USERNAME/krypto-portfolio.git
cd krypto-portfolio

# 2. Käynnistä Docker-kontit
docker-compose up -d

# 3. Odota ~3-5 minuuttia (Docker buildaa ensimmäisellä kerralla)

# 4. Avaa selaimessa
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api
```

### Käynnissä olevan projektin päivittäminen:

```bash
# Pull uusimmat muutokset
git pull origin main

# Restart kontit
docker-compose restart
```

---

## 👤 Testikäyttäjä

Sovelluksessa on valmis testikäyttäjä testausta varten:

```
Email: test@example.com
Password: Test1234!
```

**Ominaisuudet:**
- Tyhjä portfolio (voit aloittaa alusta)
- Kaikki sovelluksen toiminnot käytössä
- Luo transaktioita ja testaa portfolio-laskentaa

**Voit myös luoda oman käyttäjän:**  
Avaa http://localhost:3000/register ja täytä lomake.

---

## 🗂️ Projektin rakenne

```
krypto-portfolio/
├── backend/                    # Node.js backend
│   ├── config/                 # Konfiguraatiot (DB, scheduler)
│   ├── controllers/            # API kontrollerit
│   ├── middleware/             # JWT auth, validointi
│   ├── routes/                 # API reitit
│   ├── services/               # Business logic
│   ├── utils/                  # Apufunktiot
│   ├── database/               # SQL schema
│   ├── .env                    # Ympäristömuuttujat
│   └── server.js               # Express server
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React komponentit
│   │   ├── context/            # Auth context
│   │   ├── pages/              # Sivut
│   │   ├── services/           # API kutsut
│   │   ├── utils/              # Apufunktiot
│   │   └── App.jsx             # Pääkomponentti
│   └── public/                 # Staattiset tiedostot
│
├── database/                   # PostgreSQL
│   └── init.sql                # Tietokanta-schema
│
├── docker-compose.yml          # Docker orkestraatio
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Autentikaatio
```
POST /api/auth/register     # Rekisteröidy
POST /api/auth/login        # Kirjaudu
GET  /api/auth/me           # Hae käyttäjätiedot
```

### Transaktiot (Suojattu)
```
GET    /api/transactions          # Hae kaikki
POST   /api/transactions          # Luo uusi
GET    /api/transactions/:id      # Hae yksi
PUT    /api/transactions/:id      # Päivitä
DELETE /api/transactions/:id      # Poista
GET    /api/transactions/stats    # Tilastot
```

### Portfolio (Suojattu)
```
GET /api/portfolio                  # Portfolio-yhteenveto
GET /api/portfolio/performance      # Suorituskyky
GET /api/portfolio/top-performers   # Parhaat kryptot
GET /api/portfolio/allocation       # Allokaatio
```

### Hinnat (Julkinen)
```
GET  /api/prices              # Kaikki hinnat
GET  /api/prices/:symbol      # Yksittäinen hinta
POST /api/prices/refresh      # Päivitä hinnat
```

### Markkinat (Julkinen)
```
GET /api/market/top           # Top 100 kryptoa
GET /api/market/search?q=...  # Etsi kryptoa
GET /api/market/trending      # Trendaavat
GET /api/market/global        # Globaali data
```

---

## 💡 Käyttö

### 1. Kirjaudu sisään
- Käytä testikäyttäjää tai luo oma tili

### 2. Lisää transaktioita
- Siirry "Transaktiot" sivulle
- Klikkaa "➕ Uusi transaktio"
- Valitse kryptovaluutta (30 tuettua)
- Määrä täyttyy automaattisesti nykyisellä hinnalla
- Tallenna

### 3. Seuraa portfoliota
- Dashboard näyttää yhteenvedon
- Portfolio-sivu näyttää yksityiskohtaisen analyysin
- Kaaviot visualisoivat sijoitukset

### 4. Selaa markkinoita
- Market-sivu (julkinen, ei vaadi kirjautumista)
- Top 100 kryptovaluuttaa
- Hae ja järjestä dataa

---

## 🔄 Docker-komennot

```bash
# Käynnistä kontit
docker-compose up -d

# Pysäytä kontit
docker-compose down

# Restart kontit
docker-compose restart

# Katso logit
docker-compose logs -f

# Rebuild kontit
docker-compose build --no-cache
docker-compose up -d
```

---


## 🎓 Opinnäytetyö

Tämä projekti on osa Vaasan Ammattikorkeakoulun Tradenomi-tutkintoa. Sovellus kehitettiin opinnäytetyönä vuosien 2025-2026 aikana.

**Työn tavoitteet:**
- Full-stack web-sovelluksen kehittäminen
- Modernien web-teknologioiden hallinta
- DevOps ja konttiteknologiat (Docker)
- API-integraatiot (CoinGecko)
- Tietokantojen suunnittelu ja hallinta
- Käyttöliittymäsuunnittelu ja UX

---

## 📈 Projektin tilanne

**Versio:** 1.0.0  
**Status:** ✅ Valmis (Vaiheet 1-8 toteutettu)  
**Viimeisin päivitys:** Joulukuu 2025

### Toteutetut ominaisuudet:
- ✅ Autentikaatio (JWT)
- ✅ Transaktioiden hallinta (CRUD)
- ✅ Reaaliaikaiset hinnat (CoinGecko API)
- ✅ Portfolio-laskenta
- ✅ Visualisoinnit (Recharts)
- ✅ Dashboard
- ✅ Market Overview
- ✅ Responsiivinen UI (Tailwind CSS)

---

## 🙏 Kiitokset

- **Vaasan Ammattikorkeakoulu** - Opinnäytetyön tuki ja ohjaus
- **CoinGecko** - Ilmainen kryptovaluutta-API
- **Recharts** - Kaaviokirjasto
- **Tailwind CSS** - UI framework
- **Docker** - Konttiteknologia

---

## 📧 Yhteystiedot

**Jani Harju**  
Vaasan Ammattikorkeakoulu  
Email: e2302304@edu.vamk.fi

---

## 📄 Lisenssi

Tämä projekti on tehty opinnäytetyönä Vaasan Ammattikorkeakoululle. Kaikki oikeudet pidätetään.

---

**Kehitetty osana AMK-opinnäytetyötä 2025-2026**
