import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { SuperUserProvider } from './contexts/SuperUserContext';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Tokenization from './pages/Tokenization';
import AiX from './pages/AiX';
import FinancialCore from './pages/FinancialCore';
import Partner from './pages/Partner';
import Tradingview from './pages/Tradingview';
import PresaleToken from './pages/PresaleToken';
import MyReferrals from './pages/MyReferrals';
import MyPurchases from './pages/MyPurchases';
import Core from './pages/Core';
import ProtectedRoute from './components/ProtectedRoute';
import { StageProvider } from './contexts/StageContext';
import AiNeo from './pages/AiNeo';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';
import ContactUs from './pages/ContactUs';
import BlankPage from './pages/BlankPage';

function App() {
  return (
    <StageProvider>
      <Router>
        <WalletProvider>
          <SuperUserProvider>
            <div className="bg-black min-h-screen">
              <LoadingScreen />
              <ScrollToTop />
              <Header />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tokenization" element={<Tokenization />} />
                  <Route path="/aix" element={<AiX />} />
                  <Route path="/financial-core" element={<FinancialCore />} />
                  <Route path="/partner" element={<Partner />} />
                  <Route path="/tradingview" element={<Tradingview />} />
                  <Route path="/presale" element={<PresaleToken />} />
                  <Route path="/my-referrals" element={<MyReferrals />} />
                  <Route path="/my-purchases" element={<MyPurchases />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/cookies-policy" element={<CookiesPolicy />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route 
                    path="/core" 
                    element={
                      <ProtectedRoute>
                        <Core />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/ai-neo"
                    element={
                      <PrivateRoute>
                        <AiNeo />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/pix-generator" element={<BlankPage />} />
                </Routes>
              </main>
            </div>
          </SuperUserProvider>
        </WalletProvider>
      </Router>
    </StageProvider>
  );
}

export default App;