import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Orcamento from './pages/Orcamento';
import SocialMedia from './pages/SocialMedia';
import PrintCard from './pages/PrintCard';
import PricingCalculator from './pages/PricingCalculator';

function App() {
  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden relative">
          <Routes>
            <Route path="/" element={<Orcamento />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/card" element={<PrintCard />} />
            <Route path="/pricing" element={<PricingCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
