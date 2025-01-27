import { useEffect, useState } from "react";
import { cache, push, rxdb } from "../App";
import { _db, _push } from "./globalState";
import { ethers } from "ethers";
import { useHookstate } from "@hookstate/core";
import Home from "./Home";
import { useServerStore, useUserStore } from "../state-management/store";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import loader from "../assets/icons/loader.svg"
import { stringify, parse } from 'flatted';
import { PushAPI } from "@pushprotocol/restapi/src";
import { initStream } from "../helperFunctions/initStream";
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";


const projectId = '418defda3aa82cefc151946c325b1bdf'

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
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  
  async function connect(){
    // setLoading(true);
    // localStorage.removeItem('user');
    await provider.connect();
    // setLoading(false);
    setConnected(true);
  }

  async function sign(){
    setLoading(true);
    const signer = ethersWeb3Provider.getSigner(provider.accounts[0]);
    // localStorage.setItem('signer', JSON.stringify(signer))
    localStorage.setItem('signer', stringify(signer))
    await push.initUser(signer);
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

    // localStorage.setItem('signer', JSON.stringify(signer));
    // var seen: any[] = [];
  //   const stringify = JSON.stringify(push.user!, function(key, val) {
  //     if (val != null && typeof val == "object") {
  //          if (seen.indexOf(val) >= 0) {
  //              return;
  //          }
  //          seen.push(val);
  //      }
  //      return val;
  //  });

    // console.log("STRINGIFY: " +  stringify(push.user!))
    // localStorage.setItem('user', stringify(push.user!));
  }

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      await rxdb.initDB();
      await cache.initCache();

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
    await push.initUser(signer);
    // console.log("PUSH USER AFTER SIGN IN : " + push.user!.account)
    setAuth(true)

    // initialize user profile
    push.user!.profile.info().then((profile: any) => {
      setProfile(profile)
    });

    // initialize stream for fetching PUSH messages
    const stream: PushStream | undefined = await initStream()
    await stream!.connect()
    setStream(stream)
    console.log("STREAM: ", stream!.uid)
  }

  return (
    <>
      {
      authorized ?
      <Home db={rxdb}/> 
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
            <button className="flex h-16 w-40 bg-deep-purple-100 text-deep-purple-400 rounded-xl font-semibold text-xl shadow-md shadow-deep-purple-500 justify-center place-items-center" onClick={connect}>
              {/* {!loading ? <img className="animate-spin" src={loader} height={25} width={25}/> :
              <div>Connect Wallet</div>
              } */}
              Connect Wallet
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