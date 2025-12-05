import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Temporary placeholder components
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tervetuloa Krypto Portfolioon! 🚀
          </h2>
          <p className="text-xl text-gray-600 mb-8">
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

        <div className="text-center">
          <a href="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Aloita nyt - Rekisteröidy ilmaiseksi →
          </a>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🔒 Turvallinen • 🚀 Reaaliaikainen • 📱 Responsiivinen</p>
          <p className="mt-2">Vaasan Ammattikorkeakoulu - AMK Opinnäytetyö 2024</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Portfolio</h1>
        <div className="card">
          <p className="text-gray-600">Portfolio-näkymä tulossa Vaiheessa 5...</p>
        </div>
      </div>
    </div>
  );
}

function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Transaktiot</h1>
        <div className="card">
          <p className="text-gray-600">Transaktiot tulossa Vaiheessa 3...</p>
        </div>
      </div>
    </div>
  );
}

function MarketPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Markkinat</h1>
        <div className="card">
          <p className="text-gray-600">Markkinanäkymä tulossa Vaiheessa 7...</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <PortfolioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <MarketPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
