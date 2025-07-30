import { useEffect, useState } from "react";
import { push } from "../App";
import { ethers } from "ethers";
import { useHookstate } from "@hookstate/core";
import { useServerStore, useUserStore } from "../state-management/store";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import loader from "../assets/icons/loader.svg"
import { stringify, parse } from 'flatted';
import { Profile, PushAPI, user } from "@pushprotocol/restapi/src";
import { initStream } from "../helperFunctions/initStream";
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import { cache2 } from "../dexie";
import { Home } from "./Home";
import { useGlobalStore } from "../state-management/globalStore";
import { createUser, gun } from "../gun";
// import DirectMessages from "./DirectMessages";
// import { restoreWalletSession, saveWalletSession } from "../helperFunctions/session";

const projectId = '418defda3aa82cefc151946c325b1bdf'

// export async function createProvider() {
//   const provider = await EthereumProvider.init({
//     projectId,
//     chains: [1], // Ethereum mainnet
//     methods: [],  // No `personal_sign`
//     showQrModal: false,
//     qrModalOptions: {
//         themeMode: "dark",
//     },
// });

//   await provider.enable(); // Connect wallet
//   const web3Provider = new ethers.providers.Web3Provider(provider);
//   const signer = web3Provider.getSigner();
//   const address = await signer.getAddress();

//   return { provider, web3Provider, signer, address };
// }

// async function setupPGPKey(pgpPrivateKey: string) {
//   localStorage.removeItem('test-key')
//   localStorage.setItem('test-key-1', pgpPrivateKey);
//   console.log("PGP Key stored successfully!");
// }

// async function quickLogin() {
//   const { address, signer } = await createProvider();
//   const pgpKey = localStorage.getItem('test-key-1')

//   if (!pgpKey) {
//       console.log("No PGP Key found. Please set up first.");
//       return;
//   }

//   console.log(signer)
//   console.log(pgpKey)
//   console.log(address)
//   await push.initSavedUser(signer, pgpKey, address)
//   console.log("USER: ", push.user?.account)
//   // Initialize Push or any other service using the stored PGP key
//   // const userInstance = await PushAPI.initialize(signer, {
//   //     decryptedPGPPrivateKey: pgpKey,
//   //     env: ENV.STAGING, // or your app's environment
//   //     account: address,
//   // });



//   // push.user = userInstance

//   // console.log("Logged in successfully!", userInstance);
// }

// 1. Create a new EthereumProvider instance
const provider = await EthereumProvider.init({
  projectId,
  chains: [1],
  methods: ["personal_sign"],
  showQrModal: true,
  qrModalOptions: {
    themeMode: "dark",
  },
});

provider.on("display_uri", (uri) => {
  console.log("display_uri", uri);
});

const ethersWeb3Provider = new ethers.providers.Web3Provider(provider);

function Login2(){
  // const [auth, setAuth] = useState(false)
  const authorized = useUserStore((user) => user.authorized)
  const setAuth = useUserStore((user) => user.setAuth)
  const setProfile = useUserStore((user) => user.setProfile)
  const setStream = useServerStore((server) => server.setStream)
  const setCurrentScreen = useGlobalStore((globals) => globals.setCurrentScreen)
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
  }, [])
      
  async function connect(){
    setLoading(true);
    // localStorage.removeItem('user');
    await provider.connect();
    setLoading(false);
    setConnected(true);
  }

  function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}

  async function sign(){
    setLoading(true);
    // await walletConnectProvider.enable();
    
    // if(localStorage.getItem('signer')){
    //   const tempSigner = localStorage.getItem('signer')
    //   // console.log("SIGNER: ", tempSigner)
    // }else{
    //   console.log("SAVED SIGNER DOES NOT EXIST")
    // }

    const signer = ethersWeb3Provider.getSigner(provider.accounts[0]);
    // saveWalletSession(signer)
    // console.log("SIGNER FROM ETHER: ", signer)
    await push.initUser(signer);
    // setCurrentScreen('')

    // initialize user profile
    push.user!.profile.info().then((profile: any) => {
      setProfile(profile)
    });

    // initialize stream for fetching PUSH messages
    const stream: PushStream | undefined = await initStream()
    await stream!.connect()
    setStream(stream)
    // console.log("STREAM: ", stream!)
    setAuth(true);
    const temp: any = stream!
    const safe = safeStringify(temp.signer.provider.provider.signer)
    // console.log("SAVING USER: ", safe)
    localStorage.setItem('signer', JSON.stringify(safe))
    // const temp: any = stream!
    // localStorage.setItem('signer', temp.signer)
    setLoading(false);
  }

  useEffect(() => {
    initApp();
    // loginSavedAccount();
  }, []);

  async function loginSavedAccount(){
     if(localStorage.getItem('saved-user')){
      const key = localStorage.getItem('saved-user')!
      // console.log("Key: ", key)
      const signer = JSON.parse(localStorage.getItem('signer')!)
      // console.log("signer", signer)
      const address = localStorage.getItem('address')!
      // const signer = ethers.Wallet.fromMnemonic(mem!)
      await push.initSavedUser(signer, key, address);
      // console.log("USER: ", await push.user?.chat.list("CHATS"))
      const user = push.user?.account.toLowerCase()!
    // console.log("USER 1111: ", user)
    // await createUser(push.user?.account.toLowerCase()!)
      gun.get('cliqu3-users-test-db-2').get(user).get('serverList').once((serverListJson: string) => {
          // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
        console.log("Updating SERVER LIST ", serverListJson)
        if(serverListJson){
          const serverList: string[] = JSON.parse(serverListJson)
          console.log("USER EXISTS: ", serverList)
        }else{
          createUser(user)
        }
        // gun.get('cliqu3-users-test-db-2').get(creatorAddress).put(JSON.stringify(serverList))
        // console.log("Updated SERVER LIST ", serverList)
      })
      setAuth(true);
      setLoading(false);

      // initialize user profile
      push.user!.profile.info().then((profile: any) => {
        setProfile(profile)
      });

      // initialize stream for fetching PUSH messages
      const stream: PushStream | undefined = await initStream()
      await stream!.connect()
      setStream(stream)
      console.log("STREAM: ", stream!.uid)
    }else{
      console.log("SAVED SIGNER DOES NOT EXIST")
    }
    // const signer = await restoreWalletSession()
    // if(!signer) return null;
    // await push.initUser(signer);
  }

  async function initApp(){
    try {
      // console.log("INIT APP!")
      // if(localStorage.getItem('test-key-1')){
      //   console.log("KEY EXISTS!")
      //   await quickLogin()
      //   setAuth(true)
      // }else{
      //   console.log("NO KEY")
      // }


      // await cache2.updateReactions('', '', '')
      // await rxdb.initDB();
      // await cache.initCache();
      // const decryptedPGPKey = localStorage.getItem('saved-user')
      // const savedSession = localStorage.getItem("walletconnect-session");
      // if (savedSession) {
      //   const sessionData = JSON.parse(savedSession);
  
      //   // Reinitialize the provider with session data (replace the session if needed)
      //   const provider = await EthereumProvider.init({
      //     projectId,
      //     chains: [sessionData.chainId], // Use saved chainId
      //     methods: ["personal_sign"],
      //     // accounts: sessionData.accounts, // Use saved accounts
      //     showQrModal: false,  // No need for QR modal if reconnecting
      //   });

      //   await provider.enable();
      //   const ethersWeb3Provider = new ethers.providers.Web3Provider(provider);
      //   const signer = ethersWeb3Provider.getSigner();
      //   const address = await signer.getAddress();
      //   console.log("ADDRESS AFTER INIT: ", address)
      //   await push.initUser(signer);
      //   setAuth(true)
      // }
      // const account = localStorage.getItem('account')
      // console.log("ACCOUNT: ", account)
      // console.log("cleanedKey: ", cleanedKey)
      // const signer = ethersWeb3Provider?.getSigner(account!);
      // const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com')
      // const keyBytes = base64ToBytes(cleanedKey);
      // const privateKey = ethers.utils.hexlify(keyBytes);
      // const encoder = new TextEncoder();
      // const keyBytes = encoder.encode(decryptedPGPKey);

      // Convert to BytesLike format for ethers.js
      // const privateKey = ethers.utils.hexlify(keyBytes);
      // const signer = new ethers.Wallet(privateKey, provider);
      // const wallet = new ethers.Wallet(cleanedKey)
      // provider.signer = account!
      // const signer = ethersWeb3Provider.getSigner();
      // const session = JSON.parse(savedSession!);
      // const signer = ethersWeb3Provider.getSigner(provider.accounts[0]);

      // Recreate the Web3Provider
      // const provider = new ethers.providers.Web3Provider(walletConnectProvider);
      // const signer = provider.getSigner();
      // const address = await signer.getAddress();
      // await push.initUser(wallet);
      // const wallet = ethers.Wallet.
      // await push.initUser()
      // const signerString = localStorage.getItem('signer')
      // if(signerString != null){
      //   setConnected(true)
      //   await push.initUser(parse(signerString))
      //   setAuth(true)
      // }

      // _db.set(rxdb);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  async function onUserSignIn(signer: ethers.Wallet){
    console.log("MNEMONIC: " + signer.address)
    // if(localStorage.getItem('signer')){
    //   const tempSigner = localStorage.getItem('signer')
    //   console.log("SIGNER: ", tempSigner)
    // }else{
    //   console.log("SAVED SIGNER DOES NOT EXIST")
    // }

    await push.initUser(signer);
    // setupPGPKey(push.user?.decryptedPgpPvtKey!)
    // localStorage.setItem(key, pgpPvtKey);
    // console.log("PUSH USER AFTER SIGN IN : " + push.user!.account)
    const user = push.user?.account.toLowerCase()!
    // console.log("USER 1111: ", user)
    // await createUser(push.user?.account.toLowerCase()!)
    gun.get('cliqu3-users-test-db-2').get(user).get('serverList').once((serverListJson: string) => {
        // console.log("THE UPDATE PEER INFO DATA: ", typeof(data))
      console.log("Updating SERVER LIST ", serverListJson)
      if(serverListJson){
        const serverList: string[] = JSON.parse(serverListJson)
        console.log("USER EXISTS: ", serverList)
      }else{
        createUser(user)
      }
      // gun.get('cliqu3-users-test-db-2').get(creatorAddress).put(JSON.stringify(serverList))
      // console.log("Updated SERVER LIST ", serverList)
    })
    setAuth(true)

    // initialize user profile
    push.user!.profile.info().then((profile: any) => {
      console.log("PROFILE: ", profile)
      setProfile(profile)
    });

    // initialize stream for fetching PUSH messages
    const stream: PushStream | undefined = await initStream()
    await stream!.connect()
    setStream(stream!)
    // const temp: any = stream!
    // localStorage.setItem('signer', temp.signer.mnemonic.phrase)
    // const currentStream = useServerStore.getState().stream
    // console.log("CURRENT STREAM UID:", currentStream!.uid)
  }

  return (
    <>
      {
      authorized ?
      <Home/> 
      :
      <div className="flex justify-center pt-36 bg-off-black-600 h-screen w-screen">
        <div className="flex flex-col pt-10 space-y-5 place-items-center h-96 w-[calc(500px)] bg-deep-purple-400 rounded-xl">
          <div className="text-6xl font-thin text-deep-purple-100 font-neuropol">
            C&nbsp;L&nbsp;I&nbsp;Q&nbsp;U&nbsp;3
          </div>
          {/* <ConnectButton/> */}
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("stem still jacket screen skill hip ice impulse wasp dice kidney border", "m/44'/60'/0'/0/0"))}> USER 1</button>
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0"))}> USER 2</button>
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("emotion senior sheriff base solve drink wall twelve cherry syrup pair evil","m/44'/60'/0'/0/0"))}> USER 3</button>
          { connected ? 
          <div className="flex flex-col gap-1 justify-center place-items-center">
            <div className="text-deep-purple-100 text-xl font-light">
              Sign Message to access Push Messaging Protocol
            </div>
            <button className="flex h-16 w-40 bg-deep-purple-100 text-deep-purple-400 rounded-xl font-medium text-xl shadow-md shadow-deep-purple-500 justify-center place-items-center" onClick={sign}>
            {loading ? <img className="animate-spin" src={loader} height={30} width={30}/> :
            <div>Sign</div>
            }
            </button>
          </div>
          :
          <div className="pt-8">
            <button className="flex h-16 w-40 bg-deep-purple-100 text-deep-purple-400 rounded-xl font-semibold text-xl shadow-lg shadow-deep-purple-500 hover:shadow-none duration-100 justify-center place-items-center" onClick={connect}>
              {/* {!loading ? <img className="animate-spin" src={loader} height={25} width={25}/> :
              <div>Connect Wallet</div>
              } */}
              {loading ? <img className="animate-spin" src={loader} height={30} width={30}/> : <p> Connect Wallet </p>}
            </button>
          </div>
          }
          </div>
      </div>
      }
    </>
  )
}

export default Login2