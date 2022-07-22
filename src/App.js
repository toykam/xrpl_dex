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

function App() {
  // localStorage.clear();
  return (
    <BrowserRouter>
      <div className="App">
        <XRPLClientProvider>
            <AccountProvider>
              <AccountInfoProvider>

                <NavBar></NavBar>

                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="transfer" element={<TransferPage />} />
                  <Route path="trade" element={<TradePage />} />
                </Routes>

              </AccountInfoProvider>
          </AccountProvider>
        </XRPLClientProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
