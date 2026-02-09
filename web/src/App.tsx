import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MatchPage } from './pages/MatchPage';
import { SharePage } from './pages/SharePage';
import { AdsterraPopup } from './components/AdsterraPopup';
import { SiteLoader } from './components/SiteLoader';

function App() {
  return (
    <Router>
      {/* Site-wide loader */}
      <SiteLoader />
      
      {/* Global Adsterra Popup - loads on all pages */}
      <AdsterraPopup />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
