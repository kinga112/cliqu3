import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";
import React, { useState } from "react";
import { push } from "../../App";
import { useUserStore } from "../../state-management/store";

// const projectId = import.meta.env.VITE_PROJECT_ID as string;
const projectId = '418defda3aa82cefc151946c325b1bdf'

// 1. Create a new EthereumProvider instance
const provider = await EthereumProvider.init({
  projectId,
  chains: [1],
  methods: ["personal_sign", "eth_sendTransaction"],
  showQrModal: true,
  qrModalOptions: {
    themeMode: "light",
  },
});

provider.on("display_uri", (uri) => {
  console.log("display_uri", uri);
});

// 2. Pass the provider to ethers.js
const ethersWeb3Provider = new ethers.providers.Web3Provider(provider);

function ConnectButton2() {
  const setAuth = useUserStore((user) => user.setAuth)
  // 3. Handle Connect
  const connect = async () => {
  //   provider.connect().then(() => {
  //     // provider.accounts[0]
  //     setConnected(true);
  //   });
    await provider.connect();
    setConnected(true);
    const signer = ethersWeb3Provider.getSigner(provider.accounts[0]);
    await push.initUser(signer);
    setAuth(true);
  };
  
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);
  
    // 4. Fetch Balance on click with ethers.js
    const getBalance = async () => {
      const balanceFromEthers = await ethersWeb3Provider
        .getSigner(provider.accounts[0])
        .getBalance();
      const remainder = balanceFromEthers.mod(1e14);
      setBalance(ethers.utils.formatEther(balanceFromEthers.sub(remainder)));
    };
  
    // 5. Handle Disconnect
    const refresh = () => {
      provider.disconnect();
      window.localStorage.clear();
      setConnected(false);
    };
  
    if (connected) {
      return (
        <>
          {/* <button onClick={getBalance}>Balance</button> */}
          <button onClick={refresh}>Disconnect</button>
          {/* <p>
            balance: {balance ? `${balance} ETH` : `click "Balance" to fetch`}
          </p> */}
        </>
      );
    }
    return <button className="h-16 w-40 bg-deep-purple-500 text-deep-purple-100 rounded-md font-medium text-xl shadow-md shadow-deep-purple-500" onClick={connect}>Connect Wallet</button>;
  }
  
  export default ConnectButton2;