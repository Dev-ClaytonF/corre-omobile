import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import App from './App';
import './index.css';
import './styles/fonts.css';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
});

const queryClient = new QueryClient();

const setupApp = () => {
 
};

setupApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          {/* Adicione providers globais aqui se necessário */}
          {/*
       
          */}
          <App />
          {/*
            </AuthProvider>
          </ThemeProvider>
          */}
        </ThirdwebProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// Service Worker para PWA
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}
