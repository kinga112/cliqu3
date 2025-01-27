import { useEffect, useRef, useState } from "react";
// import GunDb from "../../main/gun"
// import { useHookstate } from "@hookstate/core";
import { _db, _openCreateServerModal } from "./globalState";
import { RxDB } from "../rxdb";
import { useHookstate } from "@hookstate/core";
import Server from "../components/server/Server";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { cache, push, rxdb } from "../App";
import { Msg, useServerStore } from "../state-management/store";
import add from "../assets/icons/add.svg"
import add_cropped from "../assets/icons/add-cropped.svg"
import settings from "../assets/icons/settings.svg"
import messageBubble from "../assets/icons/message_bubble.svg"
import options from "../assets/icons/options.svg"
import mic from "../assets/icons/mic.svg"
import muted_mic from "../assets/icons/muted-mic.svg"
import headphones from "../assets/icons/headphones.svg"
import muted_headphones from "../assets/icons/muted-headphones.svg"
import edit from "../assets/icons/edit.svg"
import { ChatMemberProfile, GroupDTO, GroupInfoDTO } from "@pushprotocol/restapi/src";
import { fetchHistory, newFetchHistory } from "../helperFunctions/fetch";
import { Channel, Message } from "../cache";
import { createServer, gun, GunServer, TextChannel, VoiceChannel } from "../gun";
import { UserInfoLarge } from "../components/server/UserInfo";
import DirectMessages from "./DirectMessages";
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import { initStream } from "../helperFunctions/initStream";
// import Gun from 'gun';

function Home(props: {db: any}){
  const [serverName, setServerName] = useState('');
  const [serverList, setServerList] = useState<Array<any>>([]);
  const serverId = useServerStore((server) => server.serverId)
  const setServerId = useServerStore((server) => server.setServerId)
  const setStream = useServerStore((server) => server.setStream)
  const [myProfile, setMyProfile] = useState<any>(null)
  const [showCopy, setShowCopy] = useState(false)
  const [copyText, setCopyText] = useState('copy')
  const [optionsMenuVisibility, setOptionsMenuVisibility] = useState('invisible')
  const optionsMenuRef = useRef(null);
  outsideOptionsMenuAlerter(optionsMenuRef);
  const [profileMenuVisibility, setProfileMenuVisibility] = useState('invisible')
  const profileMenuRef = useRef(null);
  outSideProfileMenuAlerter(profileMenuRef);
  const [muted, setMuted] = useState(false)
  const [silence, setSilence] = useState(false)

  // const [channelId, setChannelId] = useState<string>('');
  // const serverId = useHookstate(_serverId);
  // const rxdb = new RxDB();
  // await rxdb.initDB();
  // props.db!.servers!.$.subscribe((changeEvent: any) => {
  //   // console.log("CHANGE EVENT : " + changeEvent['operation']);
  //   if(changeEvent['operation'] == 'INSERT'){
  //     setServerList([
  //       ...serverList,
  //       changeEvent['documentData']
  //     ])
  //   }
  // });

  // gun.get('cliqu3-servers-test-db-3').map().on((server, key) => {
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

  function outsideOptionsMenuAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          setOptionsMenuVisibility('invisible')
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function outSideProfileMenuAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          setProfileMenuVisibility('invisible')
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useEffect(() => {
    // rxdb.servers!.$.subscribe(changeEvent => console.dir(changeEvent));
    fetchDocs();
    // console.log("SERVERS: " + JSON.stringify(serverList))
    // observable.subscribe(doc => {
    //   console.log('DOC: ' + doc);
    // });

    // gun.get('cliqu3-servers-test-db-3').map().once((server, key) => {
    //   console.log('Server:', key, server);
    //   // setServerList([...serverList, server])
    //   setServerList((serverList: Array<any>) => [...serverList, server]);
    // });

  }, [])

  const fetchDocs = async () => {
    try {
      // const serverList: any[] = [];
      // gun.get('cliqu3-servers-test-db-3').map((server: any) => {
      //   console.log("SERVER: " + JSON.stringify(server.id))
      //   // serverList.push(server)
      //   setServerList([...serverList, server])
      // })

      gun.get('cliqu3-servers-test-db-3').map().once((server, key) => {
        console.log('Server:', key, server);
        // setServerList([...serverList, server])
        // setServerList((serverList: Array<any>) => [...serverList, server]);
        setServerList(prevServerList => {
          // Check if the server is already in the list based on a unique property (e.g., server.id or key)
          const serverExists = prevServerList.some(existingServer => existingServer.id === server.id);
      
          // Only add the server if it doesn't already exist in the list
          if (!serverExists) {
            return [...prevServerList, server];
          }
          
          // If server already exists, return the current list
          return prevServerList;
        });
      });

      // setMyProfile()
      push.user?.profile.info().then((profile: any) => {
        console.log("MY PROFILE: ", profile)
        setMyProfile(profile)
      })
      
      // const doc = await props.db!.servers!.find({}).exec();
      // console.log("SERVER DOCS:: " + JSON.stringify(doc))
      // console.log("DOC 0 ID: " + doc[0].id, " NAME: " + doc[0].name)
      // setServerList(doc)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("EVENT: " + event.target.value);
    setServerName(event.target.value)
  }

  // console.log("SERVERS: " + JSON.stringify(serverList))
  let serverListItems = serverList.map((item: any) => <ServerButton key={item.id} server={item}/>);

  let visibility = 'invisible'
  if(showCopy){
    visibility = 'visible'
  }

  return (
    <>
      <div className="flex relative bg-off-black-700 h-screen w-screen text-deep-purple-100 overflow-hidden">
        <div id="no-scrollbar" className="w-24 overflow-y-scroll shrink-0 pb-24 pt-40 overflow-hidden">
          <div className="p-1 absolute top-2 left-3">
            <div className="flex flex-col gap-1.5">
              <button 
                className="flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10"
                onClick={() => {setServerId('')}}
              >
                <img src={messageBubble} height={35} width={35}/>
              </button>
              <div className="flex flex-col relative">
                <button 
                  className=" w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10 overflow-visible"
                  onClick={() => {setOptionsMenuVisibility('visible')}}
                >
                  <img src={options} height={75} width={75}/>
                </button>
                <div ref={optionsMenuRef} className={"absolute flex flex-col p-2 gap-1 left-[75px] w-32 bg-off-black-400 border border-off-black-300 rounded-2xl z-20 " + optionsMenuVisibility}>
                  <button className="flex gap-2 p-2 place-items-center h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400" 
                          onClick={() => {_openCreateServerModal.set(true); setOptionsMenuVisibility('invisible')}}
                  >
                    <img src={add_cropped} height={25} width={25}></img>
                    <div className="font-semibold">Create</div>
                  </button>
                  <button className="flex gap-2 p-2 h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400"></button>
                  <button className="flex gap-2 p-2 place-items-center h-12 bg-deep-purple-300 rounded-lg hover:bg-deep-purple-400">
                    <img src={settings} height={25} width={25}></img>
                    <div className="font-semibold">Settings</div>
                  </button>
                </div>
                <AddServerModal/>
              </div>
              {/* <div className="h-0.5 bg-off-black-500 z-10 -mx-4 shadow shadow-black"/> */}
              {/* <div className="h-1 bg-deep-purple-100 rounded z-10"/> */}
              {/* <div className="h-0.5 bg-off-black-500 z-10 -mx-4 shadow shadow-white"/> */}
            </div>
          </div>
          {/* <div className="w-16 h-1 bg-deep-purple-100 ml-4 rounded-full m-1"/> */}
          {serverListItems}
          <div className="p-1 absolute bottom-2 left-3">
            <div className="flex flex-col relative">
              {/* <div className="h-1 bg-deep-purple-100 rounded z-10 -mx-1"/> */}
              {/* <div className="h-0.5 bg-off-black-500 z-10 -mx-4 shadow shadow-black"/> */}
              {/* <button 
                className="flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10"
                onClick={() => {_openCreateServerModal.set(true)}}
              >
                <img src={add} height={35} width={35}/>
              </button> */}
              <button 
                className="flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl justify-center place-items-center duration-200 hover:scale-105 z-10"
                onClick={() => {setProfileMenuVisibility('visible')}}
              >
                {myProfile == null ? <div/> : <img className="object-cover w-16 h-16 rounded-2xl" src={myProfile.picture}/>}
              </button>
              <div ref={profileMenuRef} className={"absolute flex p-2 gap-1 left-[75px] bottom-0 bg-off-black-400 border border-off-black-300 rounded-2xl z-20 " + profileMenuVisibility}>
                {/* <button className="h-12 bg-deep-purple-300 rounded-lg font-semibold text-sm hover:bg-deep-purple-400" onClick={() => {_openCreateServerModal.set(true); setOptionsMenuVisibility('invisible')}}>Create Cliqu3</button>
                <button className="h-12 bg-deep-purple-300 rounded-lg"></button>
                <button className="h-12 bg-deep-purple-300 rounded-lg"></button> */}
                {myProfile == null ? <div/> : <UserInfoLarge address={push.user?.account!} displayName={myProfile.name} description={myProfile.desc} picture={myProfile.picture} />}
                <div className="flex flex-col justify-evenly p-1 bg-off-black-300 rounded-xl">
                  <button className="p-1 hover:bg-off-black-200 rounded-md" onClick={() => setMuted(!muted)}>
                   { muted ? <img src={muted_mic} width={25} height={25}/> : <img src={mic} width={25} height={25}/> }
                  </button>
                  <button className="p-1 hover:bg-off-black-200 rounded-md" onClick={() => setSilence(!silence)}>
                  { silence ? <img src={muted_headphones} width={25} height={25}/> : <img src={headphones} width={25} height={25}/> }
                  </button>
                  <button className="p-1 hover:bg-off-black-200 rounded-md">
                    <img src={edit} width={25} height={25}/>
                  </button>
                </div>
                {/* {myProfile == null ? 
                  <div/> : 
                  <div className="flex justify-between">
                    <div className="flex flex-col justify-between text-deep-purple-100">
                      <div>
                        <div className="text-2xl font-semibold">{myProfile.name}</div>
                        <div className="font-light">{myProfile.desc}</div>
                      </div>
                      
                      <div className="relative">
                        <button 
                          className="text-xs hover:underline" 
                          onClick={() => {navigator.clipboard.writeText(push.user?.account!); setCopyText('copied')}}
                          onMouseEnter={() => setShowCopy(true)}
                          onMouseLeave={() => {setShowCopy(false); setCopyText('copy')}}
                        >
                          
                          {push.user?.account!}
                        </button>
                        <div className={"absolute bottom-5 right-0 bg-off-black-300 text-deep-purple-100 rounded text-sm p-0.5 " + visibility}>
                          {copyText}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-1 bg-off-black-300 rounded-lg">
                      <button className="p-1 hover:bg-off-black-200 rounded-md">
                        <img src={mic} width={25} height={25}/>
                      </button>
                      <button className="p-1 hover:bg-off-black-200 rounded-md">
                        <img src={headphones} width={25} height={25}/>
                      </button>
                      <button className="p-1 hover:bg-off-black-200 rounded-md">
                        <img src={edit} width={25} height={25}/>
                      </button>
                    </div>
                  </div>
                } */}
                {/* <div className="flex gap-1 p-1 w-full bg-off-black-300 rounded-lg">
                  <button className="p-1 hover:bg-off-black-200 rounded-md">
                    <img src={mic} width={25} height={25}/>
                  </button>
                  <button className="p-1 hover:bg-off-black-200 rounded-md">
                    <img src={headphones} width={25} height={25}/>
                  </button>
                </div> */}
              </div>
              {/* <AddServerModal/> */}
            </div>
          </div>
        </div>
        <div className="w-full h-full">
          {/* <ChatChannel channelId={channelId.value}/> */}
          {
          serverId == '' ? 
            // <div className="justify-center text-3xl"> HOME PAGE </div> : 
            <DirectMessages/> : 
            <Server serverId={serverId} db={props.db}/>
          }
          {/* <Server serverId={serverId} db={props.db}/> */}
        </div>
        {/* <div className="flex flex-col place-items-center pt-36 w-96">
          Home
          <input className="w-36 h-10" placeholder="server name" onChange={handleInputChange}/>
          <button className="w-36 h-10" onClick={() => { props.db!.createServer(serverName) }}>
            create new server
          </button>
        </div> */}
        <div className="overflow-hidden absolute top-0 w-24 h-56 select-none pointer-events-none">
          <div className="absolute top-0 w-24 bg-off-black-700 border-b-2 border-off-black-400 h-[156px] shadow-lg shadow-off-black-700"/>
        </div>
        <div className="overflow-hidden absolute bottom-0 w-24 h-40 select-none pointer-events-none">
          <div className="absolute bottom-0 w-24 bg-off-black-700 border-t-2 border-off-black-400 h-[88px] shadow-[0px_-10px_15px_-3px_rgba(0,0,0,0.1)] shadow-off-black-700"/>
        </div>
        {/* <div className="absolute top-0 w-24 bg-off-black-700 h-[88px] border-b-2 border-off-black-500 shadow-lg shadow-white overflow-hidden"/> */}
        {/* <div className="absolute bottom-0 w-24 bg-off-black-700 h-[88px] border-t-2 border-off-black-500 shadow-[0px_-10px_15px_-3px_rgba(0,0,0,0.1)] shadow-white overflow-hidden"/> */}
      </div>
    </>
  )
}

export default Home

// function Server(props: {item: any }){
//   console.log('HELLOOOOOOOOOOOOOOOOOOOOOOOOO:::: ' + JSON.stringify(props.item))
//   // console.log("SEVER LIST JSON STRING: " + props.id + " asdadas : " + props.server)
//   return(
//     <>
//       <li>
//         ID: {props.item.id}, NAME: {props.item.name}
//       </li>
//     </>
//   )
// }

function ServerButton(props: {server: GunServer }){
  const serverId = useServerStore((state) => state.serverId)
  const serverVoiceChannels = useServerStore((server) => server.voiceChannels)
  const serverTextChannels = useServerStore((server) => server.chatChannels)
  const setServerId = useServerStore((state) => state.setServerId)
  const setCreator = useServerStore((state) => state.setCreator)
  const setPicture = useServerStore((state) => state.setPicture)
  const setDescription = useServerStore((state) => state.setDescription)
  const appendChatChannel = useServerStore((state) => state.appendChatChannel)
  const appendVoiceChannel = useServerStore((state) => state.appendVoiceChannel)
  const setChatChannels = useServerStore((state) => state.setChatChannels)
  const setVoiceChannels = useServerStore((server) => server.setVoiceChannels)
  const setCurrentChatChannel = useServerStore((server) => server.setCurrentChatChannel)
  const setName = useServerStore((state) => state.setName)
  const setMessages = useServerStore((server) => server.setMessages)
  const setUserProfiles = useServerStore((server) => server.setUserProfiles)
  const setUsers = useServerStore((server) => server.setUsers)
  const clearMessages = useServerStore((server) => server.clearMessages)
  const [active, setActive] = useState(false)

  // console.log("SERVER BUTTON: ", props.server)

  // useEffect

  useEffect(() => {
    if(props.server.id == serverId){
      setActive(true)
    }else{
      setActive(false)
    }
  }, [props.server.id, serverId]);

  let visibility = 'invisible h-2 w-0 group-hover:h-5 group-hover:w-3 group-hover:visible'
  if(active){
    visibility = 'visible h-10 w-3'
  }

  async function getNewMessages(chatId: string){
    let count = 0
    // let messages: Msg[] = []
    let success = false
    let reference: string = ''
    let lastRef: string = ''
    while(true){
      [success, reference] = await newFetchHistory(chatId, reference)
      // if(messages.length == 0){
      //   // new channel and no messages sent yet
      //   break
      // }
      if(!success){
        // new channel and no messages sent yet
        break
      }
      if(lastRef == reference){
        console.log("CANT LOAD ANY MORE MESSAGES: " + count)
        break
      }else{
        lastRef = reference!
      }
      // const currentChatChannel = useServerStore.getState().currentChatChannel
      // if channel gets changed while loading messages
      // if(chatId == currentChatChannel.chatId || currentChatChannel.chatId == ''){
      //   setMessages(messages)
      // }
      if(count > 20){
        break
      }else{
        count += 1
      }
    }
  }

  async function getUsers(chatId: string){
    push.user!.chat.group.participants.list(
      chatId,
      {
        filter: {
          role: 'admin',
          pending: false,
        },
      }
    ).then((admins: {members: ChatMemberProfile[]}) => {
      push.user!.chat.group.participants.list(
        chatId,
        {
          filter: {
            role: 'member',
            pending: false,
          },
        }
      ).then((members: {members: ChatMemberProfile[]}) => {
        // let userProfiles: Map<string, UserProfile>
        let userProfiles: any = {}
        admins.members.map((member: ChatMemberProfile) => {
          userProfiles[member.address.split(':')[1].toLowerCase()] = member.userInfo.profile
          // userProfiles.set(member.address, member.userInfo.profile)
        })
        members.members.map((member: ChatMemberProfile) => {
          userProfiles[member.address.split(':')[1].toLowerCase()] = member.userInfo.profile
          // userProfiles.set(member.address, member.userInfo.profile)
        })
        // console.log("USER PROFILES: " + JSON.stringify(userProfiles))
        setUserProfiles(userProfiles)
        setUsers({admins: admins.members, members: members.members})
        // console.log("USER INFO 0:::" + JSON.stringify(admins.members[0].userInfo.profile.))
      })
    })
  }

  async function changeServer(){
    console.log("CHANGING SERVER SERVER IDDDDDD: " + props.server.id)
    if(props.server.id != serverId){
      clearMessages()
      setChatChannels([])
      setVoiceChannels([])
      
      if(props.server.id != null && props.server.id != ''){
        // const doc: Map<string, any> = await rxdb.servers!.findOne().where('id').eq(props.server.id).exec()
        // let channels: Array<TextChannel> = []
        // gun.get('cliqu3-servers-test-db-3').get(serverId).once((server, key) => {
        //   // console.log('Server:', key, server);
        //   // setServerList([...serverList, server])
        //   console.log("SERVER: ", server)
        //   // setName(props.server.name)
        //   // channels = props.server.textChannels
        //   // console.log("TEXT CHANNELS: ", channels)
        // });
        setServerId(props.server.id)
        setName(props.server.name)
        setCreator(props.server.creator)
        if(props.server.picture){
          setPicture(props.server.picture)
        }
        if(props.server.description){
          setDescription(props.server.description)
        }
        // let channels: TextChannel[] = []
        // console.log("TYPE: ", typeof(props.server.textChannels))
        // props.server.textChannels.map((textChannel: any) => {
        //   console.log("TEXT CHANNEL: ", textChannel)
        //   channels.push(textChannel)
        // })

        // gun.get('cliqu3-servers-test-db-3').get(props.server.id).get('textChannels').on((textChannels, key) => {
        //   console.log('Text Channels:', key, textChannels);
        //   // setServerList([...serverList, server])
        //   // setServerList((serverList: Array<any>) => [...serverList, server]);
        //   JSON.parse(textChannels).map((textChannel: TextChannel) => {
        //     // if(!serverTextChannels.includes(textChannel)){
        //     //   push.user!.chat.group.join(textChannel.chatId)
        //     //   appendChatChannel(textChannel)
        //     // }
        //     // setChatChannels(JSON.parse(textChannels))
        //     // setChatChannels(prevTextChannels => {
        //     //   // Check if the server is already in the list based on a unique property (e.g., server.id or key)
        //     //   const channelExists = prevTextChannels.some(existingChanel => existingChanel.chatId === textChannel.chatId);
          
        //     //   // Only add the server if it doesn't already exist in the list
        //     //   if (!channelExists) {
        //     //     push.user!.chat.group.join(textChannel.chatId)
        //     //     return [...prevTextChannels, textChannel];
        //     //   }
              
        //     //   // If server already exists, return the current list
        //     //   return prevTextChannels;
        //     // });
        //   })
        // });
    
        // gun.get('cliqu3-servers-test-db-3').get(props.server.id).get('voiceChannels').on((voiceChannels, key) => {
        //   console.log('Voice Channels:', key, voiceChannels);
        //   // setServerList([...serverList, server])
        //   // setServerList((serverList: Array<any>) => [...serverList, server]);
        //   JSON.parse(voiceChannels).map((voiceChannel: VoiceChannel) => {
        //     if()
        //     // setVoiceChannels(prevVoiceChannels => {
        //     //   // Check if the server is already in the list based on a unique property (e.g., server.id or key)
        //     //   const channelExists = prevVoiceChannels.some(existingChanel => existingChanel.chatId === voiceChannel.chatId);
          
        //     //   // Only add the server if it doesn't already exist in the list
        //     //   if (!channelExists) {
        //     //     push.user!.chat.group.join(voiceChannel.chatId)
        //     //     return [...prevVoiceChannels, voiceChannel];
        //     //   }
              
        //     //   // If server already exists, return the current list
        //     //   return prevVoiceChannels;
        //     // });
        //   })
        // });


        const textChannels: TextChannel[] = JSON.parse(props.server.textChannels!)
        console.log("UPDATING TEXT CHANNELS:", textChannels)
        // console.log("TEXT CHANNELS: ", channels)
        setChatChannels(textChannels)
        // console.log("CHAT ID: " + textChannels[0].chatId)
        getUsers(textChannels[0].chatId)
        setCurrentChatChannel(textChannels[0])
        cache.fetchRecentMessages(textChannels[0].chatId).then((messages: Message[])=> {
          setMessages(messages)
        })
        console.log("fetched all cached messages!")
        getNewMessages(textChannels[0].chatId).then(() =>{
          console.log("Getting new Messages from push!!")
        })
        // gun.get('cliqu3-servers-test-db-3').get(props.server.id).get('voiceChannels').once((data: string ) => {
        //   console.log("Voice Channels Data String: ", data)
        //   setVoiceChannels(JSON.parse(data))
        // })
        // console.log("VOICE CHANNELS : ", props.server.voiceChannels)
        setVoiceChannels(JSON.parse(props.server.voiceChannels!))
        console.log("UPDATING VOICE CHANNELS:", JSON.parse(props.server.voiceChannels!))
        

        // const channels: Array<string> = doc.get('chatChannels')
        // console.log("PUSH USER!!!: " + JSON.stringify(push.user))
        // try{
        //   // channels.map( async (chatId: string) => {
        //   channels.map(async (channel: TextChannel, index: number) => {
        //     // const groupInfo = await push.user!.chat.group.info(chatId);
        //     // appendChatChannel({name: groupInfo.groupName, chatId})
        //     console.log("CHANNEL: ", channel)
        //     if(index == 0){
              // cache.fetchRecentMessages(channel.chatId).then((messages: Message[])=> {
              //   // const plainMessages = messages.map(msg => (msg.toJSON ? msg.toJSON() : msg));
              //   // console.log()
              //   setMessages(messages)
              // })
              // cache.channels!.findOne().where('chatId').eq(chatId).exec().then((channel: Map<string, any>) => {
              //   if(channel){
              //     console.log("Found cache")
              //     setMessages(channel.get('messages'))
              //     getNewMessages(chatId).then(() =>{
              //       console.log("set messages")
              //     })
              //   }
              // })
        //       // const limit = 20;

        //       // cache.channels!.findOne()
        //       //   .where('chatId').eq(chatId)
        //       //   .exec()
        //       //   .then((channel) => {
        //       //     if (channel) {
        //       //       const clonedMessages = [...channel.get('messages')];

        //       //       // Sort the cloned array by timestamp (descending)
        //       //       const sortedMessages = clonedMessages.sort((a: any, b: any) => b.timestamp - a.timestamp);

        //       //       // Set the sorted messages with limit
        //       //       const paginatedMessages = sortedMessages.slice(0, limit);
        //       //       setMessages(paginatedMessages);
        //       //     }
        //       //   });
        //     }
        //     push.user!.chat.group.info(channel.chatId).then((groupInfo: GroupDTO | GroupInfoDTO) => {
        //       if(index == 0){
        //         getUsers(channel.chatId)
        //         setCurrentChatChannel({name: groupInfo.groupName, chatId: channel.chatId})
                // cache.channels!.findOne().where('chatId').eq(chatId).exec().then((channel: Map<string, any>) => {
                //   console.log("CHANNEL : " + JSON.stringify(channel))
                //   if(channel){
                //     console.log("Found cache")
                //     // console.log("BEFORE TRY SORT: ")
                //     // console.log("BEFORE TRY SORT: " + JSON.stringify(channel.get('messages')))
                //     setMessages(channel.get('messages'))
                //     getNewMessages(chatId).then(() => {
                //       console.log("set messages")
                //     })
        //         //   // }else{
        //         //   if(!channel){
        //         //     console.log('No cache found with the specified chatId');
        //         //     const newChannel: Channel = {
        //         //       chatId: chatId,
        //         //       name: groupInfo.groupName,
        //         //       users: [],
        //         //       // messages: []
        //         //     };
        //         //     cache.channels!.upsert(newChannel);
        //         //     getNewMessages(chatId).then(() =>{
        //         //       console.log("set messages")
        //         //     })
        //         //   }
        //         // })
        //         // console.log("CHANNELS : " + JSON.stringify(channels))
              // }
        //       appendChatChannel({name: groupInfo.groupName, chatId: channel.chatId})
        //     })
        //   })
        // }catch{}
      }
    }
  }

  // const [active, setActive] = 
  // if(props.server.id == serverId){

  // }

  // console.log("TEMP ARRAY BEFORE SET: " + JSON.stringify(tempArray))
  // setChatChannels(tempArray)

  // const serverInitials = 
  function Button(){
    const buttonStyle = `
      flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl 
      justify-center place-items-center duration-200 hover:scale-105
      pointer-events-auto ml-4 shrink-0 overflow-hidden`

    if(props.server.picture == '' || !props.server.picture){
      let serverInitials = ''
      const wordList = props.server.name.split(' ')
      let i = 0
      for(i; i < 4; i++){
        try{
          serverInitials = serverInitials + wordList[i][0]
        }catch{}
      }
      // const serverInitials = props.server.name.split(' ')
      return(
        <>
          <button className={buttonStyle} onClick={changeServer}>
            {/* {props.server.name} */}
            {serverInitials}
          </button>
        </>
      )
    }else{
      return(
        <>
          <button className={buttonStyle} onClick={changeServer}>
            <img className="object-cover w-16 h-16 rounded-2xl" src={props.server.picture}/>
          </button>
        </>
      )
    }
  }

  return(
    <>
      <div className="pt-1.5">
        <div className="flex relative place-items-center group pointer-events-none">
          <div className={"absolute -left-1.5 shrink-0 bg-deep-purple-100 rounded-full duration-300 " + visibility}/>
          {/* <button className={buttonStyle} onClick={()=> changeServer()}>
            {props.server.name}
          </button> */}
          <Button/>
        </div>
      </div>
    </>
  )
}

function AddServerModal(){
  // let [isOpen, setIsOpen] = useState(false)
  const openModal = useHookstate(_openCreateServerModal);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [showError, setShowError] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("EVENT: " + event.target.value);
    setName(event.target.value)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("EVENT: " + event.target.value);
    setDescription(event.target.value)
  }

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("EVENT: " + event.target.value);
    setPicture(event.target.value)
  }
  
  let textColor = 'text-deep-purple-300'
  if(showError){
    textColor = 'text-red-500'
  }

  function onServerAdd(){
    if(name == ''){
      setShowError(true);
    }else{
      // props.db!.createServer(serverName);
      createServer(name, description, picture)
      openModal.set(false);
      setShowError(false);
      setName('')
      setDescription('')
      setPicture('')
    }
  }

  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
      <Dialog open={openModal.value} onClose={() => {openModal.set(false);setShowError(false);}} className="relative z-50 text-deep-purple-100 select-none">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="flex flex-col max-w-lg space-y-1 bg-deep-purple-300 p-10 rounded-md">
            <DialogTitle className="font-light text-3xl">Create New Server</DialogTitle>
            <div className={textColor}>Server name cannot be empty</div>
            <div className="flex gap-2">
              <div className="bg-deep-purple-100 rounded-xl w-32 h-32">
                {picture != '' ? <img className="w-32 h-32 rounded-xl object-cover" src={picture}/> : <div/>}
              </div>
              <div className="flex flex-col gap-1">
                <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="server name" onChange={handleNameChange}/>
                <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="description" onChange={handleDescriptionChange}/>
                <input className="bg-deep-purple-400 p-2 rounded-md" placeholder="icon image address link" onChange={handlePictureChange}/>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button className="bg-slate-900 p-2 w-20 rounded-md hover:text-deep-purple-200" onClick={() => {onServerAdd()}}>Add</button>
              <button className="bg-slate-900 p-2 w-20 rounded-md hover:text-deep-purple-200" onClick={() => {openModal.set(false);setShowError(false);}}>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
