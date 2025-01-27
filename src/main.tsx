import { StrictMode } from 'react'
// import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import Login from './screens/Login.tsx'
import { LensConfig, LensProvider, production } from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import Invite from './screens/Invite.tsx';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
});

const lensConfig: LensConfig = {
  environment: production,
  bindings: bindings(wagmiConfig),
};

// const router = createBrowserRouter([
//   {
//     path: '/user/:userId',
//     element: <UserProfile />,
//   },
// ]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element=
          {
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <LensProvider config={lensConfig}>
                  <App/>
                </LensProvider>
              </QueryClientProvider>
            </WagmiProvider>
          }
        />
        <Route path="/invite/:inviteId" element={<Invite/>} />
      </Routes>
    </BrowserRouter>
    {/* <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <LensProvider config={lensConfig}>
          <App/>
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider> */}

  </StrictMode>
)
