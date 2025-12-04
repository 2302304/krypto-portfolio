import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Pages (will be created in later phases)
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                💰 Krypto Portfolio
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Etusivu
              </Link>
              <Link to="/portfolio" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Portfolio
              </Link>
              <Link to="/transactions" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Transaktiot
              </Link>
              <Link to="/market" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                Markkinat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tervetuloa Krypto Portfolioon! 🚀
          </h2>
          <p className="text-xl text-gray-600">
            Seuraa ja analysoi kryptovaluuttasijoituksiasi helposti
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Portfolio-seuranta</h3>
            <p className="text-gray-600">
              Näe portfoliosi arvo reaaliajassa ja seuraa kehitystä
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💹</div>
            <h3 className="text-xl font-semibold mb-2">Voitto/Tappio</h3>
            <p className="text-gray-600">
              Analysoi sijoitusten kannattavuutta yksityiskohtaisesti
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Visualisoinnit</h3>
            <p className="text-gray-600">
              Selkeät kaaviot ja graafit auttavat päätöksenteossa
            </p>
          </div>
        </div>

        <div className="card max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Aloita tästä</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-4">1️⃣</span>
              <div>
                <h4 className="font-semibold">Kirjaudu sisään</h4>
                <p className="text-sm text-gray-600">Luo käyttäjätili tai kirjaudu sisään</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-4">2️⃣</span>
              <div>
                <h4 className="font-semibold">Lisää transaktiot</h4>
                <p className="text-sm text-gray-600">Kirjaa ostot ja myynnit portfolioon</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-4">3️⃣</span>
              <div>
                <h4 className="font-semibold">Seuraa portfoliota</h4>
                <p className="text-sm text-gray-600">Näe reaaliaikaiset arvot ja analytiikka</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="btn-primary text-lg px-8 py-3">
              Aloita nyt →
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🔒 Turvallinen • 🚀 Reaaliaikainen • 📱 Responsiivinen</p>
          <p className="mt-2">Vaasan Ammattikorkeakoulu - AMK Opinnäytetyö 2024</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<div className="p-8">Portfolio-sivu (tulossa)</div>} />
        <Route path="/transactions" element={<div className="p-8">Transaktiot-sivu (tulossa)</div>} />
        <Route path="/market" element={<div className="p-8">Markkinat-sivu (tulossa)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
