# 🔐 VAIHE 2: Autentikaatio ja käyttäjähallinta - Asennusohjeet

## 📦 Mitä lisättiin:

### Backend (7 tiedostoa):
1. **controllers/authController.js** - Autentikaatiologiikka (register, login, getMe, logout)
2. **middleware/auth.js** - JWT token validointi ja suojatut reitit
3. **middleware/validation.js** - Input validointi (express-validator)
4. **routes/authRoutes.js** - Auth API endpoints
5. **server.js** - Päivitetty versio auth-reiteillä

### Frontend (6 tiedostoa):
1. **context/AuthContext.js** - Auth state management (Context API)
2. **components/ProtectedRoute.jsx** - Suojattujen reittien wrapper
3. **components/Navbar.jsx** - Navigaatiopalkki autentikaatiolla
4. **pages/Login.jsx** - Kirjautumissivu
5. **pages/Register.jsx** - Rekisteröitymissivu
6. **pages/Dashboard.jsx** - Käyttäjän dashboard
7. **App.jsx** - Päivitetty versio AuthProviderilla ja reiteillä

---

## 🚀 ASENNUSOHJEET:

### 1. Kopioi uudet tiedostot projektiisi

Pura `krypto-portfolio-phase2.zip` ja kopioi tiedostot:

#### Backend tiedostot:
```
backend/
├── controllers/
│   └── authController.js          [UUSI]
├── middleware/
│   ├── auth.js                    [UUSI]
│   └── validation.js              [UUSI]
├── routes/
│   └── authRoutes.js              [UUSI]
└── server.js                      [KORVAA]
```

#### Frontend tiedostot:
```
frontend/src/
├── components/
│   ├── Navbar.jsx                 [UUSI]
│   └── ProtectedRoute.jsx         [UUSI]
├── context/
│   └── AuthContext.js             [UUSI]
├── pages/
│   ├── Login.jsx                  [UUSI]
│   ├── Register.jsx               [UUSI]
│   └── Dashboard.jsx              [UUSI]
└── App.jsx                        [KORVAA]
```

---

### 2. Käynnistä Docker kontit uudelleen

```bash
docker-compose down
docker-compose up --build
```

Tai jos kontit ovat jo käynnissä:
```bash
docker-compose restart
```

---

## 🧪 TESTAUS:

### 1. Testaa Backend API Postmanilla:

#### A) Rekisteröinti:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "jani@example.com",
  "password": "Salasana123",
  "confirmPassword": "Salasana123"
}
```

**Odotettu vastaus (201):**
```json
{
  "success": true,
  "message": "Käyttäjä luotu onnistuneesti",
  "data": {
    "user": {
      "id": "uuid",
      "email": "jani@example.com",
      "createdAt": "timestamp"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### B) Kirjautuminen:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234!"
}
```

#### C) Hae käyttäjätiedot (suojattu reitti):
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token-tähän>
```

---

### 2. Testaa Frontend selaimessa:

#### A) Avaa: http://localhost:3000

Pitäisi näkyä:
- ✅ Uusi Navbar ylhäällä
- ✅ "Kirjaudu" ja "Rekisteröidy" -painikkeet

#### B) Rekisteröidy:
1. Klikkaa "Rekisteröidy"
2. Täytä lomake:
   - Email: jani@test.com
   - Salasana: Testi123
   - Vahvista salasana: Testi123
3. Klikkaa "Rekisteröidy"
4. **Pitäisi ohjata Dashboard-sivulle!**

#### C) Kirjaudu ulos ja takaisin sisään:
1. Klikkaa "Kirjaudu ulos" (ylhäällä oikealla)
2. Klikkaa "Kirjaudu"
3. Kirjaudu testikäyttäjällä:
   - Email: test@example.com
   - Salasana: Test1234!
4. **Pitäisi ohjata Dashboard-sivulle!**

#### D) Testaa suojattuja reittejä:
1. Kun kirjautunut sisään, kokeile:
   - http://localhost:3000/dashboard ✅
   - http://localhost:3000/portfolio ✅
   - http://localhost:3000/transactions ✅
2. Kirjaudu ulos
3. Yritä mennä: http://localhost:3000/dashboard
4. **Pitäisi ohjata Login-sivulle!** ✅

---

## ✅ TARKISTUSLISTA:

- [ ] Backend käynnistyy ilman virheitä
- [ ] POST /api/auth/register toimii Postmanissa
- [ ] POST /api/auth/login toimii Postmanissa
- [ ] GET /api/auth/me toimii tokenilla Postmanissa
- [ ] Frontend näyttää Login-sivun
- [ ] Frontend näyttää Register-sivun
- [ ] Rekisteröinti toimii ja ohjaa Dashboardiin
- [ ] Kirjautuminen toimii ja ohjaa Dashboardiin
- [ ] Navbar näyttää käyttäjän emailin kirjautuneena
- [ ] Uloskirjautuminen toimii
- [ ] Suojatut reitit edellyttävät kirjautumista
- [ ] Token tallentuu localStorageen (F12 → Application → Local Storage)

---

## 🐛 YLEISIÄ ONGELMIA:

### "Cannot connect to backend"
- Varmista että backend on käynnissä: `docker-compose logs backend`
- Tarkista että portti 5000 on vapaa

### "JWT must be provided"
- Token ei tallentunut localStorageen
- Tarkista selaimesta: F12 → Application → Local Storage → localhost:3000
- Pitäisi näkyä "token" -avain

### "CORS error"
- Backend CORS on jo konfiguroitu
- Jos ongelma jatkuu, tarkista backend logs

### Tietokantavirhe
- Varmista että users-taulu on olemassa
- Aja: `docker-compose exec database psql -U kryptouser -d kryptodb -c "\dt"`

---

## 📊 Mitä seuraavaksi (Vaihe 3):

- Transaktioiden hallinta (CRUD)
- Transaktio-lomake
- Transaktiohistoria
- PostgreSQL kyselyt transaktioille

---

## 🎯 Vaihe 2 Yhteenveto:

**Saavutettu:**
- ✅ JWT autentikaatio toimii
- ✅ Bcrypt salasanojen hashays
- ✅ Register & Login lomakkeet
- ✅ AuthContext state management
- ✅ Protected routes
- ✅ Token storage localStoragessa
- ✅ Middleware validointi
- ✅ Dashboard-sivu

**Seuraava vaihe:** Transaktioiden hallinta

---

**Ongelmat?** Ota yhteyttä tai tarkista Docker logit:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

Onnea testaamiseen! 🚀
