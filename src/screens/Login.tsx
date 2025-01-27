import { useEffect, useState } from "react";
import ConnectButton from "../components/wallet_connect/ConnectButton"
import { push, rxdb } from "../App";
import { _db, _push } from "./globalState";
import { ethers } from "ethers";
import { useHookstate } from "@hookstate/core";
import Home from "./Home";
import ConnectButton2 from "../components/wallet_connect/ConnectButton2";
import { useUserStore } from "../state-management/store";

function Login(){
  // const [auth, setAuth] = useState(false)
  const authorized = useUserStore((user) => user.authorized)
  const setAuth = useUserStore((user) => user.setAuth)
  const db = useHookstate(_db)
  
  console.log("LOGIN AUTH: " + authorized)

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // console.log("before init: ")
      // await push.initUser();
      await rxdb.initDB();
      console.log("after init")
      console.log("USER: " + push.user?.account)
      _push.set(push);
      // _user.set(push.user);
      _db.set(rxdb);
      // const user = await PushAPI.initialize(signer, {
      //   env: CONSTANTS.ENV.STAGING,
      // });
      // _user.set(user);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  async function onUserSignIn(signer: ethers.Wallet){
    console.log("MNEMONIC: " + signer.address)
    await push.initUser(signer);
    // console.log("PUSH USER AFTER SIGN IN : " + push.user!.account)
    setAuth(true)
  }

  return (
    <>
      {
      authorized ?
      <Home db={db!.value}/> :
      <div className="flex justify-center pt-36 bg-slate-900 h-screen w-screen">
        <div className="flex flex-col pt-10 space-y-5 place-items-center h-96 w-[calc(500px)] bg-deep-purple-400 rounded-xl">
          <div className="text-8xl font-thin text-deep-purple-100">
            Cliqu3
          </div>
          {/* <ConnectButton/> */}
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("stem still jacket screen skill hip ice impulse wasp dice kidney border", "m/44'/60'/0'/0/0"))}> USER 1</button>
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0"))}> USER 2</button>
          <button onClick={() => onUserSignIn(ethers.Wallet.fromMnemonic("emotion senior sheriff base solve drink wall twelve cherry syrup pair evil","m/44'/60'/0'/0/0"))}> USER 3</button>
          <ConnectButton2/>
        </div>
      </div>
      }
    </>
  )
}

export default Login
