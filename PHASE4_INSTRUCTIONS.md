# 💹 VAIHE 4: CoinGecko API Integraatio - Asennusohjeet

## 📦 Mitä lisättiin:

### Backend (8 tiedostoa):
1. **services/coinGeckoService.js** - CoinGecko API integraatio
2. **services/priceService.js** - Hintojen hallinta ja cache
3. **config/priceScheduler.js** - Automaattinen päivitys (5 min välein)
4. **controllers/priceController.js** - Price endpoints
5. **routes/priceRoutes.js** - Price API reitit
6. **server.js** - Päivitetty scheduler mukana

### Frontend (3 tiedostoa):
1. **services/priceService.js** - Price API service
2. **components/LivePrice.jsx** - Live-hinta komponentti
3. **components/TransactionForm.jsx** - Päivitetty live-hinnoilla

---

## 🚀 ASENNUSOHJEET:

### 1. Kopioi uudet tiedostot projektiisi

Pura `krypto-portfolio-phase4.zip`:

#### Backend tiedostot:
```
backend/
├── services/
│   ├── coinGeckoService.js          [UUSI]
│   └── priceService.js              [UUSI]
├── config/
│   └── priceScheduler.js            [UUSI]
├── controllers/
│   └── priceController.js           [UUSI]
├── routes/
│   └── priceRoutes.js               [UUSI]
└── server.js                        [KORVAA]
```

#### Frontend tiedostot:
```
frontend/src/
├── services/
│   └── priceService.js              [UUSI]
├── components/
│   ├── LivePrice.jsx                [UUSI]
│   └── TransactionForm.jsx          [KORVAA]
```

---

### 2. Käynnistä Docker kontit uudelleen

```bash
docker-compose down
docker-compose up --build
```

**Tärkeää:** Backend käynnistyy ja hakee hinnat automaattisesti!

---

## 🧪 TESTAUS:

### 1. Tarkista Backend Logs:

```bash
docker-compose logs -f backend
```

Pitäisi näkyä:
```
⏰ Starting price update scheduler (every 5 minutes)...
🔄 Updating crypto prices from CoinGecko...
✅ Updated 30 crypto prices
✅ Initial price update completed
✅ Price scheduler started successfully
```

---

### 2. Testaa Backend API Postmanilla:

#### A) Hae kaikki hinnat:
```
GET http://localhost:5000/api/prices
```

**Odotettu vastaus (200):**
```json
{
  "success": true,
  "stale": false,
  "count": 30,
  "data": {
    "prices": [
      {
        "crypto_symbol": "BTC",
        "crypto_name": "bitcoin",
        "price_eur": 90000.50,
        "price_usd": 95000.00,
        "market_cap": 1800000000000,
        "volume_24h": 50000000000,
        "change_24h": 2.5,
        "last_updated": "2024-12-07T12:00:00.000Z"
      },
      ...
    ]
  }
}
```

#### B) Hae yksittäinen hinta:
```
GET http://localhost:5000/api/prices/BTC
```

#### C) Päivitä hinnat manuaalisesti (vaatii autentikaation):
```
POST http://localhost:5000/api/prices/refresh
Authorization: Bearer <token>
```

---

### 3. Testaa Frontend selaimessa:

#### A) Avaa transaktio-lomake:
http://localhost:3000/transactions

1. Klikkaa "➕ Uusi transaktio"
2. Valitse kryptovaluutta (esim. BTC)
3. **Pitäisi näkyä:**
   - ✅ "Nykyinen markkinahinta: 90,000.00 € ▲ 2.50%"
   - ✅ Hinta-kenttä täyttyy automaattisesti!

#### B) Testaa live-hinta päivitystä:
1. Jätä transaktio-lomake auki
2. Odota 60 sekuntia
3. **Live-hinta päivittyy automaattisesti!** ✅

#### C) Testaa eri kryptoja:
- Valitse ETH → Näkyy ETH:n hinta
- Valitse BNB → Näkyy BNB:n hinta
- Valitse SOL → Näkyy SOL:n hinta

---

## ✅ TARKISTUSLISTA:

- [ ] Backend käynnistyy ilman virheitä
- [ ] Backend logissa näkyy "✅ Updated 30 crypto prices"
- [ ] GET /api/prices palauttaa 30 kryptovaluuttaa
- [ ] GET /api/prices/BTC palauttaa Bitcoin hinnan
- [ ] POST /api/prices/refresh päivittää hinnat
- [ ] Frontend transaktio-lomake näyttää live-hinnan
- [ ] Hinta täyttyy automaattisesti kun valitaan krypto
- [ ] Live-hinta päivittyy 60 sek välein
- [ ] Scheduler päivittää hinnat 5 min välein
- [ ] 24h muutos näkyy (▲/▼ prosentti)

---

## 🎨 UUDET OMINAISUUDET:

### Backend:
- ✅ CoinGecko API integraatio (ilmainen tier)
- ✅ 30 kryptovaluuttaa tuettu
- ✅ Hinnat cacheen PostgreSQL:ssä
- ✅ Automaattinen päivitys 5 min välein (node-cron)
- ✅ Stale-check (vanhat hinnat)
- ✅ Manuaalinen refresh-endpoint

### Frontend:
- ✅ LivePrice-komponentti
- ✅ Automaattinen hinnan haku lomakkeeseen
- ✅ 24h muutos näkyy (▲/▼)
- ✅ Auto-refresh 60 sek välein
- ✅ Loading-tilat

---

## 🔄 MITEN SE TOIMII:

### 1. Käynnistyksessä:
```
Backend käynnistyy
    ↓
Scheduler käynnistyy
    ↓
Haetaan hinnat CoinGecko API:sta
    ↓
Tallennetaan price_cache tauluun
    ↓
✅ Hinnat saatavilla!
```

### 2. Automaattinen päivitys:
```
Joka 5. minuutti (cron: */5 * * * *)
    ↓
Haetaan uudet hinnat CoinGecko:sta
    ↓
Päivitetään price_cache taulu
    ↓
✅ Hinnat ajan tasalla!
```

### 3. Frontend käyttö:
```
Käyttäjä valitsee krypton
    ↓
LivePrice hakee hinnan API:sta
    ↓
Hinta näytetään + 24h muutos
    ↓
Auto-refresh 60 sek välein
    ↓
✅ Aina tuoreet hinnat!
```

---

## 🐛 YLEISIÄ ONGELMIA:

### "CoinGecko API error"
- Tarkista internet-yhteys
- CoinGecko ilmainen tier: max 10-50 requests/min
- Jos liikaa kutsuja, odota hetki

### Hinnat eivät päivity
- Tarkista backend logs: `docker-compose logs backend`
- Tarkista että scheduler käynnistyi
- Manuaalinen päivitys: POST /api/prices/refresh

### "Failed to fetch prices"
- CoinGecko API voi olla väliaikaisesti alhaalla
- Scheduler yrittää uudelleen 5 min kuluttua
- Vanhat hinnat pysyvät cachessa

### LivePrice ei näy frontendissa
- Tarkista että /api/prices endpoint vastaa
- Tarkista console virheet (F12)
- Tarkista että crypto_symbol on oikein

---

## 💡 VINKIT:

### Tietokanta-tarkistus:
```bash
docker exec -it krypto-db psql -U kryptouser -d kryptodb

# Näytä hinnat
SELECT crypto_symbol, price_eur, change_24h, last_updated 
FROM price_cache 
ORDER BY crypto_symbol;

# Näytä viimeisin päivitys
SELECT MAX(last_updated) FROM price_cache;

\q
```

### Backend manuaalinen testaus:
```bash
# Käynnistä backend lokaalisti
cd backend
npm install
npm run dev
```

---

## 📊 CoinGecko API Tiedot:

- **Ilmainen tier:** 10-50 requests/min
- **Endpoint:** https://api.coingecko.com/api/v3/simple/price
- **Tuetut valuutat:** EUR, USD
- **Päivitystiheys:** 5 min (voit muuttaa priceScheduler.js)
- **Dokumentaatio:** https://www.coingecko.com/en/api

---

## 🎯 Mitä seuraavaksi (Vaihe 5):

**Portfolio-laskenta ja analytiikka**
- Laske portfolio-arvo reaaliaikaisilla hinnoilla
- Voitto/tappio-laskenta per krypto
- Kokonaisvoitto/tappio
- Portfolio-yhteenveto
- Holdings-näkymä

---

## 🎉 Vaihe 4 Yhteenveto:

**Saavutettu:**
- ✅ CoinGecko API integraatio
- ✅ 30 kryptovaluuttaa tuettu
- ✅ Reaaliaikaiset hinnat
- ✅ Automaattinen päivitys (5 min)
- ✅ Price cache PostgreSQL:ssä
- ✅ LivePrice-komponentti
- ✅ Auto-täyttö transaktio-lomakkeeseen
- ✅ 24h muutos näyttö
- ✅ Scheduler toimii

**Seuraava vaihe:** Portfolio-laskenta reaaliaikaisilla hinnoilla

---

**Lataa zip, kopioi tiedostot, ja testaa!** 🚀

Kun scheduler käynnistyy, näet backend logissa hintojen päivitykset. Tämä tekee sovelluksesta todella dynaamisen!

Onnea testaamiseen! 💹
