import './App.css'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from './assets/icon.svg';
// import './App.css';
// import ConnectButton from './components/wallet_connect/ConnectButton';
import Login from './screens/Login';
// import Home from './screens/Home';
// import { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import path from 'path';
// import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
// import { CONSTANTS, PushAPI } from '../packages/push-sdk/packages/restapi/src/lib';
import { Push } from './push';
import Invite from './screens/Invite';
import Login2 from './screens/Login2';
// import { CacheDB } from './cache';
import { createServer } from './gun';
import { cache2, CacheDB2 } from './dexie'
// import { Peerbit } from 'peerbit';

// export const rxdb = new RxDB;
export const push = new Push;
// export const cache = new CacheDB;
// export const cache2 = new CacheDB2();

// export const peer = await Peerbit.create();

export default function App() {
  // const db = useHookstate(_db);
  // createServer('Test 1')
  // const rxdb = new RxDB();
  // const push = new Push();
  // const s = ethers.Wallet.fr
  // mnemonic: {"phrase":"stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra","path":"m/44'/60'/0'/0/0","locale":"en"}
  // mnemonic: {"phrase":"stem still jacket screen skill hip ice impulse wasp dice kidney border","path":"m/44'/60'/0'/0/0","locale":"en"}
  // const signer = ethers.Wallet.createRandom();
  // const signer = ethers.Wallet.fromMnemonic("stem still jacket screen skill hip ice impulse wasp dice kidney border", "m/44'/60'/0'/0/0")
  // const signer = ethers.Wallet.fromMnemonic(mnemonic)
  // console.log("mnemonic: " + JSON.stringify(signer.mnemonic))
  
  // useEffect(() => {
  //   initApp();
  // }, []);

  // const initApp = async () => {
  //   try {
  //     // console.log("before init: ")
  //     // await push.initUser();
  //     await rxdb.initDB();
  //     console.log("after init")
  //     console.log("USER: " + push.user?.account)
  //     _push.set(push);
  //     // _user.set(push.user);
  //     _db.set(rxdb);
  //     // const user = await PushAPI.initialize(signer, {
  //     //   env: CONSTANTS.ENV.STAGING,
  //     // });
  //     // _user.set(user);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // console.log("RXDB: " + rxdb)
  
  return (
      <Login2/>
      // <>
      //   <BrowserRouter>
      //     <Routes>
      //       <Route path="/" element={<Login/>}/>
      //       <Route path="/invite/:inviteId" element={<Invite/>} />
      //     </Routes>
      //   </BrowserRouter>
      // </>
      // db.value != undefined ?
      // <Home db={db!.value}/> :
      // <div className='flex justify-center place-items-center h-screen w-screen bg-deep-purple-300 text-5xl'>LOADING CLIQU3</div>
      
    // : <Home db={rxdb}/> 
    // <Router>
    //   <Routes>
    //     {/* <Route path="/" element={<Hello />} /> */}
    //     {/* <Route path="/" element={<Login/>} /> */}
    //     <Route path="/" element={<Home/>} />
    //   </Routes>
    // </Router>
  );
}
