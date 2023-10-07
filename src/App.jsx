import './App.css'
import { Routes, Route } from "react-router-dom"
import Navbar from './components/NavBar/NavBar';
import Home from "./pages/Home"
import Offer from './pages/Offer';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: import.meta.env.ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'JobFinder',
  projectId: import.meta.env.VITE_WALLETCONNECT_API_KEY,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider locale="en-EN" chains={chains}>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oferta/:id" element={<Offer />} />
      </Routes>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App