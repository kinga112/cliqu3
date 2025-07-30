import { useParams } from 'react-router-dom';
import { push } from '../App';
import { useEffect, useState } from 'react';
import { getServer, gun, joinServer, GunServer } from '../gun';
import ConnectButton2 from '../components/wallet_connect/ConnectButton2';
import { ethers } from 'ethers';

function Invite(){
  const { inviteId } = useParams();
  const [server, setServer] = useState<GunServer | null>(null)
  const [login, setLogin] = useState(false)

  useEffect(() => {
    getServer();
  }, []);

  const getServer = async () => {
    gun.get('cliqu3-servers-test-db-3').get(inviteId!).once((server, key) => {
      console.log('Found Server: ', server)
      if(server){
        setServer(server)
      }
    })
  }

  async function join(){
    setLogin(true)
    // user 2
    // await push.initUser(ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0"))
    // user 3
    await push.initUser(ethers.Wallet.fromMnemonic("emotion senior sheriff base solve drink wall twelve cherry syrup pair evil","m/44'/60'/0'/0/0"))
    // if saved session
    // const signer = await restoreWalletSession()
    // if(signer){
    //   await push.initUser(signer)
    // }else{
    //   await push.initUser(ethers.Wallet.fromMnemonic("emotion senior sheriff base solve drink wall twelve cherry syrup pair evil","m/44'/60'/0'/0/0"))
    // }
    await joinServer(server!)
  }

  function Text(){
    if(server){
      return(
        <>
          <div className='flex flex-col gap-1 place-items-center'>
            <div className='text-deep-purple-100 text-xl'>You were invite to</div>
            <div className='text-deep-purple-100 text-2xl'>{server.name}</div>            
          </div>
          <button onClick={join} className='h-12 w-20 bg-deep-purple-100 text-deep-purple-400 rounded-md text-lg font-semibold'> Accept </button>
        </>
      )
    }else{
      return(
        <>
          <div className='flex flex-col gap-1 place-items-center'>
            <div className='text-deep-purple-100 text-2xl'>Invalid Invite</div>
            <div className='text-deep-purple-100 text-lg'>The invite does not exist or it expired</div>
          </div>
          <a href='http://localhost:5173' onClick={join} className='h-12 w-36 text-center pt-2.5 bg-deep-purple-100 text-deep-purple-400 rounded-md text-lg font-semibold'> Go to Cliqu3 </a> 
        </>
      )
    }
  }

  function Login(){
    return(
      <>
        <div className='flex flex-col gap-1 place-items-center'>
          {/* <div className='text-deep-purple-100 text-xl'>Login to join: </div> */}
          {/* <div className='text-deep-purple-100 text-2xl'>{server!.name}</div> */}
        </div>
        {/* <button onClick={} className='h-12 w-20 bg-deep-purple-100 text-deep-purple-400 rounded-md text-lg font-semibold'> Login </button> */}
        {/* <ConnectButton2/> */}
      </>
    )
  }

  return (
    <>
      <div className='flex pt-44 justify-center bg-off-black-400 h-screen w-screen'>
        <div className='flex flex-col h-44 w-96 bg-deep-purple-400 justify-center place-items-center rounded-lg gap-5'>
          {login ? <Login/> : <Text/>}
        </div>
      </div>
    </>
  );
}

export default Invite