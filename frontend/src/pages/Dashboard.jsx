import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tervetuloa, {user?.email}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Tämä on sinun henkilökohtainen dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Portfolio-arvo</p>
                <p className="text-3xl font-bold text-green-700">0,00 €</p>
                <p className="text-xs text-green-600 mt-1">Lisää transaktioita</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Voitto/Tappio</p>
                <p className="text-3xl font-bold text-blue-700">0,00 €</p>
                <p className="text-xs text-blue-600 mt-1">0.00%</p>
              </div>
              <div className="text-5xl">📈</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Transaktiot</p>
                <p className="text-3xl font-bold text-purple-700">0</p>
                <p className="text-xs text-purple-600 mt-1">Yhteensä</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">🚀 Pääset alkuun</h2>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mr-4">1️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Lisää ensimmäinen transaktio</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Kirjaa ensimmäinen kryptoostoksesi portfolioon
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mr-4">2️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Tutki markkinoita</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Näe reaaliaikaiset hinnat ja markkinakehitys
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mr-4">3️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Seuraa portfoliota</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Analysoi sijoitustesi kehitystä visuaalisesti
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">📊 Viimeisimmät tapahtumat</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 mb-4">Ei vielä transaktioita</p>
              <button className="btn-primary">
                Lisää transaktio
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 card bg-gradient-to-r from-primary-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                🎓 AMK Opinnäytetyö - Vaihe 2 valmis!
              </h3>
              <p className="text-primary-100">
                Autentikaatio ja käyttäjähallinta toimii. Seuraavaksi: Transaktioiden hallinta.
              </p>
            </div>
            <div className="text-6xl">✅</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
