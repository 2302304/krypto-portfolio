# 💰 Kryptovaluutta Portfolio - AMK Opinnäytetyö

Full-stack web-sovellus kryptovaluuttaportfolion hallintaan ja seurantaan.

## 📋 Projektin kuvaus

Sovellus mahdollistaa käyttäjien transaktioiden kirjaamisen, reaaliaikaisen portfolion arvon seurannan, voitto/tappio-analytiikan sekä monipuoliset visualisoinnit. Toteutus käyttäen modernia web-teknologiaa ja Docker-kontainerisointia.

## 🛠️ Teknologiat

### Frontend
- React 18.2
- React Router 6
- Tailwind CSS 3.x
- Recharts
- Axios

### Backend
- Node.js 18 LTS
- Express 4.x
- PostgreSQL 15
- JWT Authentication
- Bcrypt

### DevOps
- Docker & Docker Compose
- Nginx (production)

## 📁 Projektirakenne

```
krypto-portfolio/
├── docker-compose.yml          # Docker Compose konfiguraatio
├── .env.example                # Ympäristömuuttujien malli
├── README.md                   # Tämä tiedosto
├── frontend/                   # React frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   └── src/
│       ├── components/         # React-komponentit
│       ├── pages/              # Sivut
│       ├── context/            # Context API
│       ├── services/           # API-kutsut
│       ├── utils/              # Apufunktiot
│       └── App.jsx
├── backend/                    # Node.js backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── config/                 # Konfiguraatiot
│   ├── controllers/            # Kontrollerit
│   ├── middleware/             # Middleware
│   ├── models/                 # Tietokantamallit
│   ├── routes/                 # API-reitit
│   ├── services/               # Liiketoimintalogiikka
│   └── utils/                  # Apufunktiot
└── database/
    └── init.sql                # Tietokannan alustus
```

## 🚀 Käynnistys

### Edellytykset
- Docker & Docker Compose
- Git
- (Valinnainen) Node.js 18+ ja npm (lokaaliin kehitykseen)

### 1. Kloonaa repositorio
```bash
git clone <repository-url>
cd krypto-portfolio
```

### 2. Kopioi ympäristömuuttujat
```bash
cp .env.example .env
```

### 3. Käynnistä Docker-kontit
```bash
docker-compose up --build
```

### 4. Avaa selaimessa
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

### 5. Testaa tietokantayhteys
```bash
docker-compose logs database
```

## 📊 Tietokanta

PostgreSQL tietokanta alustetaan automaattisesti `database/init.sql` tiedostolla.

### Taulut:
- **users** - Käyttäjätiedot (id, email, password_hash, settings)
- **transactions** - Transaktiot (id, user_id, crypto_symbol, amount, price_eur, type, date)
- **price_cache** - Hintatiedot (crypto_symbol, price_eur, price_usd, change_24h, updated_at)

### Testikäyttäjä:
- Email: `test@example.com`
- Salasana: `Test1234!`

## 🧪 Testaus

### Backend testit
```bash
cd backend
npm test
```

### Frontend testit
```bash
cd frontend
npm test
```

### API testaus Postmanilla
1. Tuo Postman collection (tulossa)
2. Testaa endpointit

## 📝 API Endpoints (Vaihe 1)

### Health Check
- `GET /health` - Palvelun tilan tarkistus

### API Info
- `GET /api` - API:n perustiedot ja endpointit

*(Lisää endpointeja lisätään vaiheittain)*

## 🔒 Tietoturva

- JWT token-pohjainen autentikaatio
- Bcrypt salasanojen hashays (10 rounds)
- Parametrisoidut SQL-kyselyt (SQL injection esto)
- CORS konfiguroitu
- Helmet.js turvallisuusheaderit
- Rate limiting API endpointeille
- Input validointi

## 🌟 Ominaisuudet (MVP)

- [x] Projektin pohja ja Docker-ympäristö (Vaihe 1)
- [ ] Käyttäjähallinta ja autentikaatio (Vaihe 2)
- [ ] Transaktioiden hallinta (Vaihe 3)
- [ ] CoinGecko API integraatio (Vaihe 4)
- [ ] Portfolio-laskenta (Vaihe 5)
- [ ] Visualisoinnit (Vaihe 6)
- [ ] Market Overview (Vaihe 7)

## 📦 Komennot

### Käynnistä sovellus
```bash
docker-compose up
```

### Käynnistä taustalla
```bash
docker-compose up -d
```

### Pysäytä kontit
```bash
docker-compose down
```

### Poista kontit ja volyymit
```bash
docker-compose down -v
```

### Rakenna uudelleen
```bash
docker-compose up --build
```

### Näytä logit
```bash
docker-compose logs -f
```

### Tietyn konttin logit
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## 👨‍💻 Kehittäjä

**Jani**  
Vaasan Ammattikorkeakoulu  
Tietojenkäsittelyn koulutusohjelma (BBA)  
AMK Opinnäytetyö 2024

## 📄 Lisenssi

MIT License

## 🙏 Kiitokset

- CoinGecko API (kryptohinnat)
- Vaasan Ammattikorkeakoulu

---

**Vaihe 1/11 - Projektin pohja ja Docker-ympäristö ✅**

Seuraava vaihe: Autentikaatio ja käyttäjähallinta
