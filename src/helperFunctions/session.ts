import EthereumProvider from "@walletconnect/ethereum-provider";
// import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";


// export async function saveWalletSession(signer: ethers.providers.JsonRpcSigner) {
//   const address = await signer.getAddress();
//   const providerUrl = signer.provider?.connection?.url || "your_default_rpc_url";

//   localStorage.setItem("walletSession", JSON.stringify({ address, providerUrl }));
// }

// export async function restoreWalletSession(): Promise<ethers.providers.JsonRpcSigner | null> {
//   const session = localStorage.getItem("walletSession");
//   if (!session) return null;

//   const { address, providerUrl } = JSON.parse(session);

//   const provider = new ethers.providers.JsonRpcProvider(providerUrl);
//   const signer = provider.getSigner(address);
//   return signer;
// }
