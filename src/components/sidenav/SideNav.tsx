import { useEffect, useRef, useState } from "react";
import { ProfileControls } from "../user/ProfileControls";
import { gun } from "../../gun";
import { useServerStore, useUserStore } from "../../state-management/store";
import { ServerButton } from "./ServerButton";
import { push } from "../../App";
import messageBubble from "../../assets/icons/message_bubble.svg"
import { _openCreateServerModal } from "../../screens/globalState";
import { OptionsMenuButton } from "./optionsMenu/OptionsMenuButton";
import { GunServer } from "../../types/serverTypes";
// import DirectMessages from "../../screens/DirectMessages";
import { useGlobalStore } from "../../state-management/globalStore";
import { cache2 } from "../../dexie";
import { useDirectMessageStore } from "../../state-management/dmStore";
import { getNewMessages } from "../../helperFunctions/fetch";
import { UserProfile } from "@pushprotocol/restapi/src";

export function SideNav(){
  // const serverId = useServerStore((server) => server.serverId)
  const [gunServerList, setGunServerList] = useState<Array<GunServer>>([]);
  const serverListLength = useUserStore(user => user.serverList.length)
  const currentDM = useDirectMessageStore(dm => dm.currentDM)
  const profile = useUserStore((user) => user.profile)
  const setServerId = useServerStore(server => server.setServerId)
  const setCurrentScreen = useGlobalStore(globals => globals.setCurrentScreen)
  const setServerList = useUserStore(user => user.setServerList)
  const setMessages = useServerStore(server => server.setMessages)
  const setUserProfiles = useServerStore(server => server.setUserProfiles)

  
  useEffect(() => {
    fetchServers();
  }, [serverListLength])

  function fetchServers(){
    try {
      // gun.get('cliqu3-servers-test-db-3').map().once((server, key) => {
      //   // console.log('Server:', key, server);
      //   if(server == undefined){
      //     return
      //   }
      //   // setServerList([...serverList, server])
      //   // setServerList((serverList: Array<any>) => [...serverList, server]);
      //   setServerList(prevServerList => {
      //     // Check if the server is already in the list based on a unique property (e.g., server.id or key)
      //     const serverExists = prevServerList.some(existingServer => existingServer.id === server.id);
      
      //     // Only add the server if it doesn't already exist in the list
      //     if (!serverExists) {
      //       return [...prevServerList, server];
      //     }
          
      //     // If server already exists, return the current list
      //     return prevServerList;
      //   });
      // });

      //New Server Fetch:
      const user = push.user?.account.toLowerCase()!
      gun.get('cliqu3-users-test-db-2').get(user).get('serverList').once((serverListJson: string) => {
        if(serverListJson){
          const userServerList: string[] = JSON.parse(serverListJson)
          console.log("USERSERVERLIST: ", userServerList)
          setServerList(userServerList)
          userServerList.map((serverId: string) => {
            gun.get('cliqu3-servers-test-db-3').get(serverId).once((server, key) => {
              console.log('Server:', key, server);
              if(server == undefined){
                return
              }
              setGunServerList(prevServerList => {
                // Check if the server is already in the list based on a unique property (e.g., server.id or key)
                const serverExists = prevServerList.some(existingServer => existingServer.id === server.id);
            
                // Only add the server if it doesn't already exist in the list
                if (!serverExists) {
                  return [server, ...prevServerList];
                }
                
                // If server already exists, return the current list
                return prevServerList;
              });
            });
          })
        }
      })
    } catch (error) {
      console.error('Error fetching Servers:', error);
    }
  };

  async function clickDirectMessages(){
    setCurrentScreen('DirectMessages');
    setServerId('')
    // setCurrentDM(props.chat)
    // console.log("NO EQUAL setting current dm to: ", currentDM?.chatId!)
    const chatInfo = await push.user?.chat.info(currentDM!)
    console.log("CHAT INFO: ", chatInfo)
    if(chatInfo?.meta.group){
      console.log("GROUP DM")
    }else{
      let profiles: { [address: string]: UserProfile } = {}
      profiles[push.user?.account.toLowerCase()!] = profile!
      
      const recipient = chatInfo?.recipient.split(':')[1].toLowerCase()!
      const recipientProfile = await push.user?.profile.info({overrideAccount: chatInfo?.recipient})
      profiles[recipient] = recipientProfile
      // console.log("PROFILES: ", profiles)
      setUserProfiles(profiles)
    }
    const cachedMessages = await cache2.fetchRecentMessages(currentDM!)
    setMessages(cachedMessages)
    console.log("fetched all cached dms!")
    // const messages = await push.user?.chat.history(props.chatId, { limit: 30 })
    // setMessages(messages)
    await getNewMessages(currentDM!)
  }

  // console.log("item.id + item.picture of first: " + serverList[1].id + serverList[1].picture)
  let serverListItems = gunServerList.map((item: GunServer) => <ServerButton key={item.id + item.picture} server={item}/>);

  return(
    <>
      <div id="no-scrollbar" className="w-24 overflow-y-scroll shrink-0 pb-24 pt-40 overflow-hidden">
        <div className="p-1 absolute top-2 left-3">
          <div className="flex flex-col gap-1.5">
            <button 
              className="flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10"
              // onClick={() => {setServerId('')}
              onClick={() => {clickDirectMessages()}}
            >
              <img src={messageBubble} height={35} width={35}/>
            </button>
            <OptionsMenuButton/>
          </div>
        </div>
        {serverListItems}
        <div className="p-1 absolute bottom-2 left-3">
          <ProfileControls/>
        </div>
      </div>
    </>
  )
}