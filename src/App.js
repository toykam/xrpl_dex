import './App.css';
import React from 'react';
import {AccountProvider} from "./contexts/AccountContext";
import {XRPLClientProvider} from "./contexts/XRPLClientContext";
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TransferPage from './pages/TransferPage';
import { AccountInfoProvider } from './contexts/AccountInfoContext';
import TradePage from './pages/TradePage/TradePage';
import { OfferProvider } from './contexts/OfferContext';
import MyOffersPage from './pages/MyOffersPage';
import { MyOfferProvider } from './contexts/MyOfferContext';

function App() {
  // localStorage.clear();
  return (
    <BrowserRouter>
      <div className="App">
        <XRPLClientProvider>
            <AccountInfoProvider>
              <AccountProvider>
                  <OfferProvider>
                    <MyOfferProvider>

                      <NavBar></NavBar>

                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="transfer" element={<TransferPage />} />
                        <Route path="trade" element={<TradePage />} />
                        <Route path="my_offers" element={<MyOffersPage />} />
                      </Routes>

                    </MyOfferProvider>
                  </OfferProvider>
              </AccountProvider>
            </AccountInfoProvider>
        </XRPLClientProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
