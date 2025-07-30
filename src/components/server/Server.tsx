import { Immutable, ImmutableArray, ImmutableObject, useHookstate } from "@hookstate/core";
import { CHAT, ChatMemberProfile, CONSTANTS, GroupDTO, GroupInfoDTO, IFeeds, PeerData, PushAPI, TYPES, user, UserProfile, VideoNotificationRules, VideoPeerInfo,
} from "@pushprotocol/restapi/src";
import { ethers } from "ethers";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { _openCreateChatChannelModal } from "../../screens/globalState";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { push } from "../../App";
import { useServerStore, useCallStore, useUserStore } from "../../state-management/store";
import volume from '../../assets/icons/volume.svg'
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream";
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from "@pushprotocol/restapi/src/lib/payloads/constants";
import { v4 as uuidv4 } from 'uuid';
import { Base64 } from 'js-base64';
import reply from '../../assets/icons/reply.svg'
// import emoji from '../../assets/icons/emoji.svg'
import emoji2 from '../../assets/icons/emoji2.svg'
import gallery from '../../assets/icons/gallery.svg'
import add from '../../assets/icons/add.svg'
import loader from '../../assets/icons/loader.svg'
import hashtag from '../../assets/icons/hashtag.svg'
import sticker from '../../assets/icons/sticker.svg'
import file from '../../assets/icons/file.svg'
import pdf from '../../assets/icons/pdf.svg'
import gif from '../../assets/icons/gif.svg'
import close from '../../assets/icons/close.svg'
import users from '../../assets/icons/users.svg'
import settings from '../../assets/icons/settings.svg'
// import arrow from '../../../../assets/icons/customArrow.svg'
import arrow from '../../assets/icons/arrow.png'
import carrot from '../../assets/icons/carrot.svg'
import { GiphyGrid } from "./Giphy";
import { useFilePicker } from 'use-file-picker';
import { FileSizeValidator } from 'use-file-picker/validators';
import { RxDocument } from "rxdb";
import { newFetchHistory } from "../../helperFunctions/fetch";
import StickerGrid from "./Stickers";
import LinkPreview from "./message/LinkPreview";
import Interactions from "./message/Interactions";
// import { Message, ReferenceContent, Content } from "../../cache";
import MessageElement from "./message/MessageElement";
import { of } from "rxjs";
import { UserInfoLarge, UserInfoSmall } from "../user/UserInfo";
import { gun, updatePeerInfo } from "../../gun";
import { channel } from "diagnostics_channel";
import { Messages } from "./Messages";
import { Message } from "../../types/messageTypes";
import { cache2 } from "../../dexie";
import { TextChannel, VoiceChannel } from "../../types/serverTypes";
import { useCall } from "wagmi";
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';
import { VideoCallStatus, video as pushVideo, VideoCallData } from '@pushprotocol/restapi/src';
import { useDirectMessageStore } from "../../state-management/dmStore";
import { useGlobalStore } from "../../state-management/globalStore";
// import { shallow } from 'zustand/shallow';


export default function Server(){
  return (
    <>
      <div className="flex h-full z-50">
        <SideBar/>
        <ChatChannel/>
      </div>
    </>
  )
}

function ChatChannel(){
  const currentTextChannel = useServerStore((state) => state.currentTextChannel)
  const [showUsers, setShowUsers] = useState(true)
  const setMessages = useServerStore((server) => server.setMessages)
  const appendMessage = useServerStore((server) => server.appendMessage)
  const elementRef = useRef<HTMLDivElement>(null)
  const [hasScrollbar, setHasScrollbar] = useState(false);
  // cache.channels!.$.subscribe((changeEvent: any) => {
  //   // const messages = useServerStore.getState().messages
  //   console.log("CHANGE EVENT : " + changeEvent['operation'] + ", DATA: " + JSON.stringify(changeEvent['documentData'].messages));
  //   // if(changeEvent['operation'] == 'UPDATE'){
  //   //   setMessages(changeEvent['documentData'].messages)
      
  //   //   // appendMessage(changeEvent['documentData'])
  //   //   // setMessages([
  //   //     // ...messages,
  //   //     // changeEvent['documentData']
  //   //   // ])
  //   //   // appendMessage(changeEvent['documentData'].messages)
  //   // }
  // });

  const checkScrollbar = () => {
    if (elementRef.current) {
      const { clientHeight, scrollHeight } = elementRef.current;
      setHasScrollbar(clientHeight < scrollHeight);
    }
  };

  // const ScrollableComponent = forwardRef((props, ref) => {
  //   return (
  //     <Messages ref={elementRef} />
  //     // <div
  //     //   ref={ref}
  //     //   className="h-40 overflow-y-auto border border-gray-400 p-2"
  //     //   style={{ width: '200px' }}
  //     // >
  //     //   {props.children}
  //     // </div>
  //   );
  // });

  return(
    <>
      <div className="flex flex-col h-full w-full bg-off-black-500">
        <div className="flex h-14 border-b z-10 border-off-black-700 shadow-md shadow-off-black-700 justify-between place-items-center px-3 shrink-0 text-4xl font-extralight">
          {currentTextChannel.name}
          {currentTextChannel.chatId != '' ? <div className="flex">
            <button onClick={() => setShowUsers(!showUsers)} className="flex justify-center place-items-center h-10 w-10 rounded-md bg-deep-purple-300">
              <img src={users} height={30} width={30}/>
            </button>
          </div> : <div/>
          } 
        </div>
        <div className="flex flex-col overflow-hidden h-full w-full">
          <Messages/>
          {/* {hasScrollbar ?  <div className="h-14"/> : <div/> } */}
          {/* <div className="h-14"/> Spacer to push scroll bar up */}
          {/* <Messages messages={currentMessages.value}/> */}
          {/* <Messages/> */}
          <BottomBar/>
        </div>
      </div>
      {currentTextChannel.chatId != '' && showUsers ? <MembersList key={currentTextChannel.chatId}/> : <div/>}
    </>
  )
}

function Reply(){
  const setReply = useServerStore((server) => server.setReply)
  const reply = useServerStore((server) => server.reply)
  // console.log("REPLY IN REPLY: " + reply.reference)
  
  let showReply = 'invisible'
  if(reply){
    showReply = 'visible'
  }

  let overflow = false
  if(reply){
    if(reply.message){
      if(reply.message.length >= 50){
        overflow = true
      }
    }
  }

  return(
    <>
      <div className={"absolute z-50 -top-4 rounded-e-md rounded-tl-md p-1 bg-deep-purple-300 " + showReply}>
        <div className="flex gap-3">
          <div className="flex gap-0">
            <p>Replying to: "{reply?.message}</p>
            {overflow ? <p>...</p> : <p/>}
            <p>"</p>
          </div>
          <button onClick={() => setReply(null)}>
            <img className="hover:bg-red-700 rounded-full" src={close} height={25} width={25}/>
          </button>
        </div>
      </div>
    </>
  )
}

export function ReactionElement(props: {emoji: string, count: number, users: string[], cid: string, userProfiles: any}){
  const currentTextChannel = useServerStore((server) => server.currentTextChannel)
  // const userProfiles = useServerStore((server) => server.userProfiles)
  const addOrRemoveReaction = useServerStore((server) => server.addOrRemoveReaction)

  const [showUsers, setShowUsers] = useState('invisible');

  const buttonStyle = `
    flex flex-row gap-1 bg-deep-purple-300 w-10 h-6 
    rounded-md place-items-center justify-center border 
    border-deep-purple-100 hover:bg-deep-purple-400`

  async function reactionOnClick(){
    addOrRemoveReaction(props.emoji, push.user?.account.toLowerCase()!, props.cid)

    const reaction = await push.user!.chat.send(currentTextChannel.chatId, {
      type: 'Reaction',
      content: props.emoji,
      reference: props.cid,
    });
  }

  const usersList = props.users.map((user: string, index: number) => {
    // const userProfiles = useServerStore.getState().userProfiles
    if(props.userProfiles[user.toLowerCase()] == undefined){
      if(props.users.length == index+1){
        return <p key={user}>{user.substring(0,20)}</p>
      }else{
        return <p key={user}>{user.substring(0,20)},&nbsp;</p>
      }
    }else{
      if(props.users.length == index+1){
        // return <p key={user}>{user.substring(0,20)}</p>
        return <p key={user}>{props.userProfiles[user.toLowerCase()].name}</p>
      }else{
        // return <p key={user}>{user.substring(0,20)},&nbsp;</p>
        return <p key={user}>{props.userProfiles[user.toLowerCase()].name},&nbsp;</p>
      }
    }
  })

  // console.log("REACTION ELEMENT: emoji: " + props.emoji + " , count: " + props.count + " , cid: " + props.cid)

  return(
    <>
      <div className="relative">
        <button className={buttonStyle} onClick={() => reactionOnClick()} onMouseEnter={() => setShowUsers('visible')} onMouseLeave={() => setShowUsers('invisible')}>
          <div>
            {props.emoji}
          </div>
          <div>
            {props.count}
          </div>
        </button>
        <div className={"absolute top-7 bg-deep-purple-300 rounded-md max-h-20 border-deep-purple-100 border p-0.5 z-50 " + showUsers}>
          {/* {JSON.stringify(props.reaction.users)} */}
          <div className="flex">
            {usersList}
          </div>
        </div>
      </div>
    </>
  )
}

export function EmojiGrid(props: {cid: string, from: string, reactions: {[emoji: string]: {count: number, users: string[]}}}){
  const emojiList = Object.values(CHAT.REACTION)
  let emojiElements = emojiList.map((emoji: string) => <EmojiElement key={emoji.concat(props.cid)} emoji={emoji} cid={props.cid} from={props.from} reactions={props.reactions}/>)

  return(
    <>
      <div className="inline-grid gap-1 grid-cols-8 place-items-center text-3xl p-0.5 h-96 max-w-full overflow-y-auto overflow-x-hidden">
        {emojiElements}
      </div>
    </>
  )
}

function EmojiElement(props: {emoji: string, cid: string, from: string, reactions: {[emoji: string]: {count: number, users: string[]}}}){
  const currentTextChannel = useServerStore((server) => server.currentTextChannel)
  const addOrRemoveReaction = useServerStore((server) => server.addOrRemoveReaction)

  async function sendReaction(){
    console.log("REACTIONS: " + JSON.stringify(props.reactions) + ", EMOJI: " + props.emoji + " FROM: " + props.from + " Cid: " + props.cid)
    addOrRemoveReaction(props.emoji, push.user?.account.toLowerCase()!, props.cid)

    const reaction = await push.user!.chat.send(currentTextChannel.chatId, {
      content: props.emoji,
      type: 'Reaction',
      reference: props.cid,
    });
  }

  return(
    <>
      <button className="hover:bg-deep-purple-400 rounded-md" onClick={()=> sendReaction()}>
        {props.emoji}
      </button>
    </>
  )
}

function MembersList(){
  const [showAdmins, setShowAdmins] = useState(true)
  const [showMembers, setShowMembers] = useState(true)
  const users = useServerStore((server) => server.users)
  let adminsArrow = ''
  if(showAdmins == false){
    adminsArrow = '-rotate-90'
  }

  let membersArrow = ''
  if(showMembers == false){
    membersArrow = '-rotate-90'
  }

  const adminList = users.admins.map((member: ChatMemberProfile) => {return <UserInfoSmall key={member.address} member={member}/>})
  const memberList = users.members.map((member: ChatMemberProfile) => {return <UserInfoSmall key={member.address} member={member}/>})

  return(
    <>
      {/* <div className="flex flex-col w-48 border-l-2 border-deep-purple-300 shrink-0 px-2 text-deep-purple-100"> */}
      <div className="flex flex-col z-10 w-48 bg-off-black-500 border-l-2 border-off-black-400 shrink-0 px-2 text-deep-purple-100">
        <button className="flex flex-row text-sm pt-2 select-none group pointer-events-none place-items-center select" onClick={() => setShowAdmins(!showAdmins)}>
          <img className={'pointer-events-auto ' + adminsArrow} src={carrot} width={20} height={20}/>
          <div className="group-hover:underline pointer-events-auto">admins</div>
          <div className="group-hover:underline pointer-events-auto">&nbsp;-&nbsp;{adminList.length}</div>
        </button>
        { showAdmins ? <div>{adminList}</div> : <div/> }
        {memberList.length != 0 ?
        <div>
          <button className="flex flex-row text-sm pt-2 select-none group pointer-events-none place-items-center select" onClick={() => setShowMembers(!showMembers)}>
          <img className={'pointer-events-auto ' + membersArrow} src={carrot} width={20} height={20}/>
          <div className="group-hover:underline pointer-events-auto">members</div>
          <div className="group-hover:underline pointer-events-auto">&nbsp;-&nbsp;{memberList.length}</div>
        </button>
        { showMembers ? <div>{memberList}</div> : <div/> }
        </div>
        :
        <div/>
        }
      </div>
    </>
  )
}

// function SideBar(props: {serverId: string, stream: PushStream}){
function SideBar(){
  const serverName = useServerStore((server) => server.name)
  const serverId = useServerStore((server) => server.serverId)
  const creator = useServerStore((server) => server.creator)
  // const stream = useServerStore((server) => server.stream)
  // const serverId = useServerStore((server) => server.serverId)
  // const serverId = useServerStore((server) => server.serverId)
  // const chatChannels = useServerStore((server) => server.chatChannels)
  // const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([])
  // const voiceChannels = useServerStore((server) => server.voiceChannels)
  // const setVoiceChannels = useServerStore((server) => server.setVoiceChannels)
  const [textChannels, setTextChannels] = useState<TextChannel[]>([])
  // const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([])
  const [voiceChannels, setVoiceChannels] = useState<{[chatId: string] : VoiceChannel}>({})
  const [openVideo, setOpenVideo] = useState(false)
  const [showTextChannels, setShowTextChannels] = useState(true)
  const [showVoiceChannels, setShowVoiceChannels] = useState(true)
  // const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showInviteUserModal, setShowInviteUserModal] = useState(false)
  const [showServerMenu, setShowServerMenu] = useState(false)
  // const [userProfile, setUserProfile] = useState<any>({})
  const serverNameButtonRef = useRef(null)
  // const userProfile = useUserStore((user) => user.profile)
  // const setUserProfile = useUserStore((user) => user.setProfile)
  const currentTextChannel = useServerStore((server) => server.currentTextChannel)
  const serverTextChannels = useServerStore((server) => server.textChannels)
  // const serverTextChannelsLength = useServerStore((server) => server.textChannels.length)
  const serverVoiceChannels = useServerStore((server) => server.voiceChannels)
  // const serverVoiceChannelsLength = useServerStore((server) => server.voiceChannels.length)
  const appendVoiceChannel = useServerStore((server) => server.appendVoiceChannel)
  // const appendTextChannel = useServerStore((server) => server.appendTextChannel)
  const callStream = useCallStore((call) => call.stream)
  // const [userProfile]

  let isCreator = false
  if(push.user!.account.toLowerCase() == creator){
    isCreator = true
  }

  useEffect(() => {
    // setTextChannels(serverTextChannels)
    // setVoiceChannels(serverVoiceChannels)
    // setVoiceChannels(serverVoiceChannels)
    // fetchChannels()
    // gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('textChannels').once(function(data, key){
    //   // {property: 'value'}, 'key'
    //   console.log("GUN DATA TC: " + JSON.stringify(data))
    //   console.log("GUN KEY: " + key)

    //   const textChannels: TextChannel[] = JSON.parse(data)
    //   textChannels.map((textChannel) => {
    //     push.user!.chat.group.join(textChannel.chatId)
    //   })
    //   setTextChannels(textChannels)
    // })
    

    // gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('voiceChannels').once(function(data, key){
    //   // {property: 'value'}, 'key'
    //   console.log("GUN DATA VC: " + JSON.stringify(data))
    //   console.log("GUN KEY: " + key)

    //   const voiceChannels: VoiceChannel[] = JSON.parse(data)
    //   voiceChannels.map((voiceChannel) => {
    //     push.user!.chat.group.join(voiceChannel.chatId)
    //   })
    //   setVoiceChannels(voiceChannels)
    // })
    console.log('USE EFFECT SIDE BAR:');
    gun.get('cliqu3-servers-test-db-3').get(serverId).get('textChannels').on((textChannelsJson, key) => {
      console.log('Text Channels:', key, textChannelsJson);
      // setServerList([...serverList, server])
      // setServerList((serverList: Array<any>) => [...serverList, server]);
      JSON.parse(textChannelsJson).map((textChannel: TextChannel) => {
        cache2.addChannel({
          chatId: textChannel.chatId,
          name: textChannel.name,
          users: [],
          lastReadMessageCid: "",
        })
        setTextChannels(prevTextChannelList => {
          // Check if the channel is already in the list based on a unique property (chatId)
          const textChannelExists = prevTextChannelList.some(existingTextChannel => existingTextChannel.chatId === textChannel.chatId);
      
          // Only add the channel if it doesn't already exist in the list
          if (!textChannelExists) {
            return [textChannel, ...prevTextChannelList];
          }
          
          // If channel already exists, return the current list
          return prevTextChannelList;
        });
      })
    });
    // const textChannelsState = useServerStore.getState().chatChannels
    // setTextChannels(textChannelsState)
    gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').on((voiceChannels, key) => {
      console.log('Voice Channels:', key, voiceChannels);
      // setServerList([...serverList, server])
      // setServerList((serverList: Array<any>) => [...serverList, server]);
      JSON.parse(voiceChannels).map((voiceChannel: VoiceChannel) => {
        // const voiceChannelsState = useServerStore.getState().voiceChannels
        if(!serverVoiceChannels[voiceChannel.chatId]){
          // console.log("chat Id: ", voiceChannel.chatId)
          // console.log("SERVER VOICE CHANNELS: ", serverVoiceChannels)
          appendVoiceChannel(voiceChannel)
        }
        setVoiceChannels(serverVoiceChannels)
        // appendVoiceChannel(voiceChannel)
        // setVoiceChannels()
        // setVoiceChannels(voiceChannel)
        // setVoiceChannels(prevVoiceChannels => {
        //   // Check if the server is already in the list based on a unique property (e.g., server.id or key)
        //   const channelExists = prevVoiceChannels.some(existingChanel => existingChanel.chatId === voiceChannel.chatId);
      
        //   // Only add the server if it doesn't already exist in the list
        //   if (!channelExists) {
        //     push.user!.chat.group.join(voiceChannel.chatId)
        //     return [...prevVoiceChannels, voiceChannel];
        //   }
          
        //   // If server already exists, return the current list
        //   return prevVoiceChannels;
        // });
      })
    });
    // const voiceChannelsState = useServerStore.getState().voiceChannels
  // }, [props.serverId, textChannels, voiceChannels])
  }, [serverId, textChannels, voiceChannels])
  // }, [])

  // const fetchChannels = async () => {
  //   try{
      

  //   }catch(error) {
  //     console.error('Error fetching channels:', error);
  //   }
  // }

  // let chatChannelItems = chatChannels.map((channel: {name: string, chatId: string}) => <ChatChannelButton key={channel.chatId} name={channel.name} chatId={channel.chatId}/>);
  // let textChannelItems = textChannels.map((channel: {name: string, chatId: string}) => <ChatChannelButton key={channel.chatId} name={channel.name} chatId={channel.chatId}/>);

  // let voiceChannelItems = voiceChannels.map((voiceChannel: VoiceChannel) => {
  //   // return <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId} stream={stream!}/>
  //   return <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId}/>
  // });

  let textChannelItems = serverTextChannels.map((channel: TextChannel) => <ChatChannelButton key={channel.chatId} name={channel.name} chatId={channel.chatId} unread={channel.unread}/>);

  // let voiceChannelItems = serverVoiceChannels.map((voiceChannel: VoiceChannel) => {
  //   // return <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId} stream={stream!}/>
  //   return <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId}/>
  // });

  // let voiceChannelItems = Object.keys(serverVoiceChannels).forEach(key => {
  //   let voiceChannel = serverVoiceChannels[key]
  //   return <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId}/>
  // });

  let voiceChannelItems: JSX.Element[] = []
  for (let key in serverVoiceChannels) {
    let voiceChannel = serverVoiceChannels[key];
    voiceChannelItems.push(<NewVoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId}/>)
    // Use `key` and `value`
  }

  // let userProfile: any

  // rxdb!.servers!.$.subscribe((changeEvent: any) => {
  //   // console.log("SIDE BAR CHANGE EVENT : " + JSON.stringify(changeEvent));
  //   // if(changeEvent['operation'] == 'INSERT'){
  //   //   setServerList([
  //   //     ...serverList,
  //   //     changeEvent['documentData']
  //   //   ])
  //   // }
  // });

  // push.user!.profile.info().then((profile: any) => {
  //   setUserProfile(profile)
  // })
  // console.log("USER PROF: " + JSON.stringify(userProfile))

  // useEffect(() => {
    // rxdb.servers!.$.subscribe(changeEvent => console.dir(changeEvent));
    // fetch();
    // observable.subscribe(doc => {
    //   console.log('DOC: ' + doc);
    // });
    // let voiceChannels: VoiceChannel[] = []
    // gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('voiceChannels').once((data: string ) => {
    //   console.log("Voice Channels Data String: ", data)
    //   setVoiceChannels(JSON.parse(data))
    // })

    // setVoiceChannels(voiceChannels)

    // rxdb!.servers!.findOne({selector: {id: {$eq: props.serverId}}}).exec().then(async (doc) => {
    //   // console.log("DOC then::::: " + JSON.stringify(doc))
    //   // doc.get('voiceChannel').map(async (voiceChannel: {chatId: string, peerInfo: string}) => {
    //   var i=0;
    //   for(i; i<doc.get('voiceChannels').length;i++){
    //     // console.log("DOC then::::: " + voiceChannel.chatId)
    //     // const groupInfo = push.user!.chat.group.info(voiceChannel.chatId)
    //     // let name = ''
    //     const groupInfo = await push.user!.chat.group.info(doc.get('voiceChannels')[i].chatId)
    //     // push.user!.chat.group.info(doc.get('voiceChannel')[i].chatId).then((groupInfo: GroupInfoDTO | GroupDTO) => {
    //     //   console.log("NAME: " + groupInfo.groupName)
    //     //   name = groupInfo.groupName
    //     // })
    //     console.log("PUSHING: " + groupInfo.groupName + ", " + doc.get('voiceChannels')[i].chatId)
    //     // voiceChannels.push({name: groupInfo.groupName, chatId: doc.get('voiceChannel')[i].chatId});
    //     setVoiceChannels([
    //       ...voiceChannels,
    //       {name: groupInfo.groupName, chatId: doc.get('voiceChannels')[i].chatId}
    //     ])
    //   }
    // });
  // }, [])

  // const fetch = async () => {
  //   try {
  //     console.log("ID: " + props.serverId)
  //     const doc = await rxdb!.servers!.findOne({selector: {id: {$eq: props.serverId}}}).exec();
  //     // console.log("DOC 0 ID: " + doc.id, " NAME: " + doc.chatChannels)
  //     // console.log("DOC 0 ID: " + JSON.stringify(doc))
  //     // setServerList(doc)
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  function VideoModal(){
    const stream = useCallStore((server) => server.stream)
    return (
      <>
        {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
        <Dialog open={openVideo} onClose={() => {setOpenVideo(false)}} className="relative z-50 text-deep-purple-100 select-none">
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel>
              <div className="flex gap-2 p-5 bg-deep-purple-100 rounded-lg">
                <VideoPlayer stream={stream.local.stream} isMuted={true}/>
                <VideoPlayer stream={stream.incoming[0].stream} isMuted={false} />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }

  // const callStream = useCallStore((call) => call.stream)

  // needs fix
  async function endCall(){
    const call = useCallStore.getState().call
    // const doc =  await rxdb.servers!.findOne({
    //   selector: {
    //     id: {
    //       $eq: props.serverId
    //     }
    //   }
    // }).exec()

    // await doc.update({
    //   $set: {
    //     'voiceChannels.$[x].peerInfo': '',
    //     filter: [{"x.chatId": '54776f362792a36b5099cc2a8ff428432536332b2a12f46b3642eff0cc7ab377'}]
    //   },
    // })

    // await call!.disconnect() // needs work!
  }

  let textChannelArrow = ''
  let voiceChannelArrow = ''
  if(showTextChannels == false){
    textChannelArrow = ' -rotate-90'
  }
  if(showVoiceChannels == false){
    voiceChannelArrow = ' -rotate-90'
  }

  const incomingAudioUsers = callStream.incoming.map((peerData: PeerData) => {return peerData.status == VideoCallStatus.CONNECTED ? <AudioPlayer key={peerData.address} stream={peerData.stream} isMuted={false} user={peerData.address}/> : <div/>})
  // console.log("THIS USER: " + push.user!.account)

  // function SettingsModal(){
  //   const [displayName, setDisplayName] = useState(userProfile!.name)
  //   const [description, setDescription] = useState(userProfile!.desc)
  //   const [picture, setPicture] = useState(userProfile!.picture)
  //   const [loading, setLoading] = useState(false)

  //   const handleDisplayNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     // console.log("EVENT: " + event.target.value);
  //     setDisplayName(event.target.value)
  //   }

  //   const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     // console.log("EVENT: " + event.target.value);
  //     setDescription(event.target.value)
  //   }

  //   const handlePictureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     // console.log("EVENT: " + event.target.value);
  //     setPicture(event.target.value)
  //   }

  //   async function updateUserInfo(){
  //     setLoading(true)
  //     try{
  //       if(displayName != userProfile!.name){
  //         const updateResponse = await push.user!.profile.update({name: displayName!})
  //         console.log("UPDATE NAME RESPONSE: " + updateResponse)
  //       }
  //       if(description != userProfile!.desc){
  //         const updateResponse = await push.user!.profile.update({desc: description!})
  //         console.log("UPDATE DESC RESPONSE: " + updateResponse)
  //       }
  //       if(picture != userProfile!.picture){
  //         const updateResponse = await push.user!.profile.update({picture: picture!})
  //         console.log("UPDATE PIC RESPONSE: " + updateResponse)
  //       }
  //     }catch{
  //       console.log('error updating profile info')
  //     }
  //     // setUserProfile({name: displayName, desc: description, picture: picture})
  //     setUserProfile(await push.user!.profile.info())
  //     setLoading(false)
  //   }

  //   return(
  //     <>
  //       <Dialog open={showSettingsModal} onClose={() => {setShowSettingsModal(false)}} className="relative z-50 text-deep-purple-100 select-none">
  //         <div className="fixed inset-0 flex w-screen items-center justify-center">
  //           <DialogPanel className="flex flex-col w-[calc(60vw)] h-[calc(80vh)] space-y-1 bg-deep-purple-400 p-10 rounded-md">
  //             <DialogTitle className="flex font-extralight text-5xl justify-center w-full p-5">User Settings</DialogTitle>
  //             {/* <div className="flex w-full gap-10 place-items-center justify-center"> */}
  //             <div className="flex flex-col w-full place-items-center justify-center gap-5 pr-20">
  //               <div className="grid grid-cols-3 grid-flow-row-dense gap-2 w-full">
  //                 <div className="flex justify-end text-lg font-semibold shrink-0">Display Name</div>
  //                 <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={displayName!} onChange={handleDisplayNameInputChange}/>
  //                 <div className="flex justify-end text-lg font-semibold shrink-0">Description</div>
  //                 <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={description!} onChange={handleDescriptionInputChange}/>
  //                 <div className="flex justify-end text-lg font-semibold shrink-0">Image Link</div>
  //                 <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={picture!} onChange={handlePictureInputChange}/>
  //               </div>
  //               <UserInfoLarge address={push.user!.account} displayName={displayName!} description={description!} picture={picture!}/>
  //             </div>
  //             <div className="flex justify-center w-full py-3">
  //               <button className="flex justify-center place-items-center h-12 w-32 p-1 rounded bg-deep-purple-100 text-deep-purple-400 font-semibold" onClick={updateUserInfo}>
  //                 {loading ? <img className="animate-spin" src={loader} height={30} width={30}/> : <div>Save Changes</div>}
  //               </button>
  //             </div>
  //           </DialogPanel>
  //         </div>
  //       </Dialog>
  //     </>
  //   )
  // }

  function InviteUserModal(){
    const inviteLink = `http://localhost:5173/invite/${serverId}`
    return(
      <>
        <Dialog open={showInviteUserModal} onClose={() => {setShowInviteUserModal(false)}} className="relative z-50 text-deep-purple-100 select-none">
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel className="flex flex-col w-96 space-y-1 bg-deep-purple-400 p-10 rounded-md">
              <DialogTitle className="flex font-extralight text-5xl justify-center w-full p-5">Invite User</DialogTitle>
              <div>
                Send invite link to user:
              </div>
              <div className="select-text">
                {inviteLink}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }

  // const userAddress = push.user!.account.toLowerCase()

  function ServerMenu(){
    const menuRef = useRef(null)
    outsideMenuAlerter(menuRef, serverNameButtonRef)

    function outsideMenuAlerter(menuRef: React.MutableRefObject<any>, serverNameButtonRef:React.MutableRefObject<any>) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: MouseEvent) {
          if(!serverNameButtonRef.current.contains(event.target)){
            if (!menuRef.current.contains(event.target)) {
              setShowServerMenu(false)
            }
          }
          // if (!menuRef.current.contains(event.target)) {
          //   setShowServerMenu(false)
          // }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [menuRef, serverNameButtonRef]);
    }


    if(showServerMenu){
      return(
        <>
          <div ref={menuRef} className="absolute top-16 left-2 w-52 bg-off-black-400 border border-off-black-300 rounded flex flex-col gap-1 p-2">
            <button className="bg-deep-purple-300 hover:bg-deep-purple-400 text-start p-2 rounded" onClick={() => {setShowInviteUserModal(true); setShowServerMenu(false)}}>Invite User</button>
            <button className="bg-deep-purple-300 hover:bg-deep-purple-400 text-start p-2 rounded">Server Settings</button>
          </div>
        </>
      )
    }
  }

  // const callStream = useCallStore((call) => call.stream)
  console.log("callStream.meta.initiator.address: ", callStream.meta.initiator.address)
  console.log("stream.incoming[0].stream: ", callStream.incoming[0].stream) 

  const audioStreams = callStream.incoming.map((stream) => {})

  return(
    <>
      {/* <div key={props.serverId} className="w-56 bg-off-black-600 border-r-2 border-deep-purple-300 shrink-0"> */}
      <div key={serverId} className="w-56 bg-off-black-600 border-r-1 border-off-black-400 shrink-0">
        {/* <div className="flex h-14 border-b-2 border-deep-purple-300 place-items-center pl-2"> */}
        <div className="relative">
          <button
            ref={serverNameButtonRef}
            className="flex justify-between w-full h-14 z-10 border-b border-off-black-700 place-items-center px-2 shadow-md shadow-off-black-700 text-xl font-light"
            onClick={() => setShowServerMenu(!showServerMenu)}>
            {serverName}
            {
              showServerMenu ?
              <img src={close} width={35} height={35} /> :
              <img src={carrot} width={35} height={35} />
            }
          </button>
          <ServerMenu/>
          <InviteUserModal/>
        </div>
        <div key={serverId} className="flex flex-col gap-5 overflow-y-auto py-5">
          <div className="flex flex-col gap-1">
            <div className="px-1 flex flex-row place-items-center justify-between group pointer-events-none">
              <div className="flex place-items-center">
                <img className={textChannelArrow} src={carrot} width={20} height={20}/>
                <button className="p-1 group-hover:text-deep-purple-200 group-hover:underline pointer-events-auto" onClick={() => setShowTextChannels(!showTextChannels)}>
                  Text Channels
                </button>
              </div>
              {isCreator ? 
                <button className="w-6 h-6 rounded-md hover:bg-off-black-200 pointer-events-auto" onClick={() => {_openCreateChatChannelModal.set(true)}}>
                  <img src={add}/>
                </button>
              : <div/>  
              }
            </div>
            { showTextChannels ?
            // <div>{chatChannelItems}</div> : <div/>
            // <div>{chatChannelItems}</div> : <ChatChannelButton name={currentTextChannel.name} chatId={currentTextChannel.chatId}/>
            <div>{textChannelItems}</div> : <ChatChannelButton name={currentTextChannel.name} chatId={currentTextChannel.chatId} unread={currentTextChannel.unread}/>
            }
          </div>
          {/* <VoiceChannelButton name={'voice_test'} /> */}
          <div className="flex flex-col gap-1">
            <div className="px-1 flex flex-row place-items-center justify-between group pointer-events-none">
              <div className="flex place-items-center">
                <img className={voiceChannelArrow} src={carrot} width={20} height={20}/>
                <button className="p-1 group-hover:text-deep-purple-200 group-hover:underline pointer-events-auto" onClick={() => setShowVoiceChannels(!showVoiceChannels)}>
                  Voice Channels
                </button>
              </div>
              {isCreator ? 
                <button className="w-6 h-6 rounded-md hover:bg-off-black-200 pointer-events-auto" onClick={() => {_openCreateChatChannelModal.set(true)}}>
                  <img src={add}/>
                </button>
                : <div/>  
              }
            </div>
            { showVoiceChannels ?
            <div>{voiceChannelItems}</div> : <div/>
            }
          </div>
          {/* {callStream.meta.initiator.address != null ? <AudioPlayer stream={callStream.local.stream} isMuted={false} user={callStream.local.address}/> : <div/>} */}
          {/* {incomingAudioUsers} */}
          <VideoModal/>
          <button onClick={() => setOpenVideo(true)}> open video </button>
        </div>
        <AddChannelModal/>
        {/* <div className="absolute bottom-2 pointer-events-none select-none">
          {userProfile == null ? <div> loading </div> :
          <div className="flex w-56 h-10 place-items-center px-2 justify-between">
            <div className="flex gap-1 place-items-center">
              <img src={userProfile.picture} className="w-10 h-10 bg-deep-purple-100 rounded shrink-0 object-cover"/>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  {userProfile.name != null ? 
                  <p className="truncate text-lg font-semibold">{userProfile.name}</p> : <p></p>
                  }
                  <div className="flex gap-1 place-items-center pointer-events-auto">
                    <button onClick={() => setShowSettingsModal(true)} className="hover:bg-deep-purple-300 rounded-md p-1">
                      <img src={settings} height={15} width={15}/>
                    </button>
                    <SettingsModal/>
                  </div>
                </div>
                <button className='truncate text-xs hover:underline pointer-events-auto'>{userAddress.substring(0,10)}...{userAddress.substring(32,42)}</button>
              </div>
            </div>
          </div>
          }
        </div> */}
      </div>
    </>
  )
}

// function VoiceChannelButton(props: {name: string, chatId: string, stream: PushStream}){
function VoiceChannelButton(props: {name: string, chatId: string}){
  // state to handle current video call data
  // const [users, setUsers] = useState<Array<any>>()
  // const [data, setData] = useState(CONSTANTS.VIDEO.INITIAL_DATA);
  const currentTextChannel = useServerStore((state) => state.currentTextChannel)
  const serverId = useServerStore((state) => state.serverId)
  // const videoStreamData = useServerStore((state) => state.videoStreamData)
  // const stream = useCallStore((call) => call.stream)
  // const initiator = useCallStore((call) => call.initiator)
  const users = useCallStore((call) => call.users)
  const addUser = useCallStore((call) => call.addUser)
  const setInitiator = useCallStore((call) => call.setInitiator)
  const setCurrentVoiceChannel = useServerStore((server) => server.setCurrentVoiceChannel)
  const callStream = useCallStore((call) => call.stream)
  const setCall = useCallStore((call) => call.setCall)
  const setCallStream = useCallStore((call) => call.setStream)
  const stream = useServerStore((server) => server.stream)
  // const [videoData, setVideoData] = useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);

  const [videoData, setVideoData] = useState<VideoCallData>(initVideoCallData);
  
  // wrap in use effect?
    videoData.incoming.map((peerData: PeerData) => {
      if(peerData.status === CONSTANTS.VIDEO.STATUS.INITIALIZED){
        console.log('VIDEO DATA STATUS INITIALIZED: ', videoData)
        const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
        // console.log("INCOMING INITIALIZED!!!! " + currentVoiceChannel)
        
        const rules: VideoNotificationRules = {
          access: {
            type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
            data: {
              chatId: currentVoiceChannel
            },
          },
        }
        // const meta = {rules: rules}
        console.log("SINGAL DATA IN PEERINFO: ", videoData.meta.initiator.signal)
        const peerInfo: VideoPeerInfo = {
          address: videoData.meta.initiator.address,
          signal: videoData.meta.initiator.signal,
          meta: {rules: rules}
        }
  
        // gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannelsJson: string) => {
        //   // seems like the voice channel peerInfo is not updating...
        //   console.log('Voice Channels 1:', voiceChannelsJson);
        //   // setServerList([...serverList, server])
        //   // setServerList((serverList: Array<any>) => [...serverList, server]);
        //   JSON.parse(voiceChannelsJson).map(async (voiceChannel: VoiceChannel) => {
        //     // console.log('Voice Channel 1234567: ', voiceChannel);
        //     if(voiceChannel.chatId == props.chatId){
        //       // console.log("FOUND INFO " + voiceChannel.peerInfo)
        //       // console.log("UPDATE PEER INFO")
        //       // updatePeerInfo(serverId, currentVoiceChannel, JSON.stringify(peerInfo))
        //       // console.log("SERVER ID: ", serverId)
        //       console.log("CURRENT VOICE CHANNEL ID: ", currentVoiceChannel)
        //       console.log("Signal here: ", peerInfo.signal)
        //       await updatePeerInfo(serverId, currentVoiceChannel, peerInfo)
        //     }
        //   });
        // })
      }
      if(peerData.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
        console.log('set call stream 2')
        console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
      }
    })


    useEffect(() => {
    if (videoData.incoming[0].status === VideoCallStatus.CONNECTED) {
      console.log("CALL CONNECTED in USE EFFECT!")
      // setIsCallConnected(true);
      // setIsCallAccepted(false);
    }
    return () => {
      // setIsCallConnected(false);
      // setIsCallAccepted(false);
    };
  }, [videoData.incoming[0].status]);

    setCallStream(videoData)
    // videoData?.incoming.map((peerData: PeerData) => {
    //   if(peerData.status === CONSTANTS.VIDEO.STATUS.INITIALIZED){
    //     console.log('VIDEO DATA:', videoData)
    //     const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
    //     console.log("INCOMING INITIALIZED!!!! " + currentVoiceChannel)
        
    //     const rules: VideoNotificationRules = {
    //       access: {
    //         type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
    //         data: {
    //           chatId: currentVoiceChannel
    //         },
    //       },
    //     }
    //     const meta = {rules: rules}
    //     const peerInfo: VideoPeerInfo = {
    //       address: videoData.meta.initiator.address,
    //       signal: videoData.meta.initiator.signal,
    //       meta: meta
    //     }
  
    //     gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannels, key) => {
    //       // seems like the voice channel peerInfo is not updating...
    //       console.log('Voice Channels:', key, voiceChannels);
    //       // setServerList([...serverList, server])
    //       // setServerList((serverList: Array<any>) => [...serverList, server]);
    //       JSON.parse(voiceChannels).map(async (voiceChannel: VoiceChannel) => {
    //         if(voiceChannel.chatId == props.chatId){
    //           // console.log("FOUND INFO " + voiceChannel.peerInfo)
    //           console.log("UPDATE PEER INFO")
    //           // updatePeerInfo(serverId, currentVoiceChannel, JSON.stringify(peerInfo))
    //           await updatePeerInfo(serverId, currentVoiceChannel, peerInfo)
    //         }
    //       });
    //     })
    //   }
    //   if(peerData.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
    //     console.log('set call stream 2')
    //     console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
    //     setCallStream(videoData)
    //   }
    // })
  // videoData?.incoming.map((peerData: PeerData) => {
  //   if(peerData.status === CONSTANTS.VIDEO.STATUS.INITIALIZED){
  //     console.log('VIDEO DATA:', videoData)
  //     const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
  //     console.log("INCOMING INITIALIZED!!!! " + currentVoiceChannel)
      
  //     const rules: VideoNotificationRules = {
  //       access: {
  //         type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
  //         data: {
  //           chatId: currentVoiceChannel
  //         },
  //       },
  //     }
  //     const meta = {rules: rules}
  //     const peerInfo: VideoPeerInfo = {
  //       address: videoData.meta.initiator.address,
  //       signal: videoData.meta.initiator.signal,
  //       meta: meta
  //     }

  //     gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannels, key) => {
  //       // seems like the voice channel peerInfo is not updating...
  //       console.log('Voice Channels:', key, voiceChannels);
  //       // setServerList([...serverList, server])
  //       // setServerList((serverList: Array<any>) => [...serverList, server]);
  //       JSON.parse(voiceChannels).map(async (voiceChannel: VoiceChannel) => {
  //         if(voiceChannel.chatId == props.chatId){
  //           // console.log("FOUND INFO " + voiceChannel.peerInfo)
  //           console.log("UPDATE PEER INFO")
  //           // updatePeerInfo(serverId, currentVoiceChannel, JSON.stringify(peerInfo))
  //           await updatePeerInfo(serverId, currentVoiceChannel, peerInfo)
  //         }
  //       });
  //     })
  //   }

  //   if(peerData.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
  //       console.log('set call stream 2')
  //       console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
  //       setCallStream(videoData)
  //   }
  // })


  // if(videoData?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
  //   console.log('set call stream 2')
  //   console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
  //   setStream(videoData)
  // }

  async function joinCall(){
    console.log("JOIN CALL BUTTON")
    // console.log("SERVER ID: ", serverId)
    // console.log("CURRENT VOICE CHANNEL ID: ", props.chatId)
    setCurrentVoiceChannel(props.chatId)
        // const r = await push.user?.chat.group.info(props.chatId)
    // console.log("R: ", r)
    // const response = await push.user?.chat.accept('d26c6365ff5a8a1656370a8e3a8db5e7aa460777ccd2595a66c73943af2c2780')
    // console.log("ACCEPTED: d26c6365ff5a8a1656370a8e3a8db5e7aa460777ccd2595a66c73943af2c2780", response)
    // const addToGroup = await push.user!.chat.group.add('006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766', {
    //   role: 'MEMBER', // 'ADMIN' or 'MEMBER'
    //   accounts: ['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'],
    // });
    // const join = await push.user!.chat.group.
    // console.log('ADD TO GROUP: ' + JSON.stringify(join))
    // await push.user!.chat.group.join('54776f362792a36b5099cc2a8ff428432536332b2a12f46b3642eff0cc7ab377')
    // await push.user!.chat.group.info('006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766')
    // let stream = useServerStore((server) => server.stream)
    // const stream = useServerStore.getState().stream;
    // console.log("THIS IS THE STREAM!: ", stream)

    
    const callInit = await push.user!.video.initialize(setVideoData, {  
      stream: stream!, // pass the stream object, refer Stream Video
      config: {
        video: true, // to enable video on start, for frontend use
        audio: true, // to enable audio on start, for frontend use
      },
      // media?: MediaStream, // to pass your existing media stream(for backend use)
    });

    if(stream == undefined){
      console.log("STREAM IS UNDFINED! Try again....", stream)
    }else{
      // console.log("CALL INIT: ", stream)
      // const callInit = await push.user!.video.initialize(setVideoData, {
      //   stream: stream, // pass the stream object, refer Stream Video
      //   config: {
      //     video: true, // to enable video on start, for frontend use
      //     audio: true, // to enable audio on start, for frontend use
      //   },
      //   // media?: MediaStream, // to pass your existing media stream(for backend use)
      // });
      // console.log(callInit)
      setCall(callInit)
      // let peerInfo = ''
    }

    // setCall(callInit)
    // let peerInfo = null
    // const doc =  await rxdb.servers!.findOne({
    //   selector: {
    //     id: {
    //       $eq: serverId
    //     }
    //   }
    // }).exec()

    // console.log("VOICE CHANNEL CHAT ID: ", props.chatId)
      gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').once((voiceChannelsJson: string) => {
        // console.log('Voice Channels 2: ', voiceChannelsJson);
        // setServerList([...serverList, server])
        // setServerList((serverList: Array<any>) => [...serverList, server]);
        JSON.parse(voiceChannelsJson).map((voiceChannel: VoiceChannel) => {
          if(voiceChannel.chatId == props.chatId){
            console.log("PEER INFO BEFORE JOIN OR REQUEST: ", voiceChannel.peerInfo)
            // console.log("FOUND INFO " + voiceChannel.peerInfo)
            // console.log("FOUND PEER INFO")
            // peerInfo = voiceChannel.peerInfo
            // const call = useCallStore.getState().call
            // const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
            // console.log("CALL STORE CALL: ", call)
            // const stream = useCallStore.getState().stream
            if(voiceChannel.peerInfo == null){
              // if(peerInfo == null){
              // console.log("STREAM: " + stream)
              // userAlice.video.initialize(onChange, {options?});
              // const call = await push.user!.video.initialize(setData, {
              //   stream: props.stream, // pass the stream object, refer Stream Video
              //   config: {
              //     video: false, // to enable video on start, for frontend use
              //     audio: true, // to enable audio on start, for frontend use
              //   },
              //   // media?: MediaStream, // to pass your existing media stream(for backend use)
              // });

              // console.log("CALL CONFIG: " + call!.config)

              // push.user!.chat.send('0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', {
              //   type: 'Text',
              //   content: 'Hello Test!',
              // });
              // VIDEO_NOTIFICATION_ACCESS_TYPE
              
              // console.log("CURRENT VOICE CHANNEL: " + currentVoiceChannel)
              
              const rules: VideoNotificationRules = {
                access: {
                  type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
                  data: {
                    // chatId: currentTextChannel.chatId,
                    chatId: props.chatId
                    // chatId: currentVoiceChannel
                  },
                },
              }

              // const signer = ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0")
              // console.log("init user: " + JSON.stringify(signer.mnemonic))
              // const otherUser = await PushAPI.initialize(signer, {
              //   env: CONSTANTS.ENV.DEV,
              // });

              // console.log('OTHER USER: 0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465')
              console.log("CALLING USER 3: 0xf06863ead6a1c82eb976e2b8e5754a5e15b3c46d")

              callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules}).then(() => {
                console.log("THEN CALL REQUEST!")
                setInitiator(true)
                addUser(push.user!.account)
              })

              // call!.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules}).then(() => {
              //   console.log("THEN CALL REQUEST!")
              //   setInitiator(true)
              //   addUser(push.user!.account)
              // });

              // call!.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules})

              // console.log("CALLING USER 3 REQUESTED")
              // setInitiator(true)
              // addUser(push.user!.account)

              // call!.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules}).then(() => {
              //   console.log("CALLING USER 3 REQUEST")
              //   setInitiator(true)
              //   addUser(push.user!.account)
              // });

              // call!.request(['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules});

              // await call.request(['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666'], {rules: {VideoNotificationRules.access: {data: {chatId: currentTextChannel.chatId }}}});
              // console.log("CALL : " + call!.config)
              // setInitiator(true)
              // console.log("LOCAL ADDRES:::: " + JSON.stringify(stream))
              // addUser(push.user!.account)
              // await call.approve();
              
              // await call.approve(push.user!.account);
            }else{
              console.log("JOINING CALL!")
              // call!.approve(peerInfo!)
              // const info = JSON.parse(peerInfo)
              // const videoPeerInfo: VideoPeerInfo = {
              //   // address: info.address,
              //   // signal: info.signal,
              //   // meta: info.meta
              //   address: peerInfo!.address,
              //   signal: peerInfo!.signal,
              //   meta: peerInfo!.meta
              // }
              // console.log("INFO: " + info)
              // console.log("STRING INFO:: " + JSON.stringify(videoPeerInfo))
              // call!.approve(peerInfo)

              // call!.approve(voiceChannel.peerInfo)
              // await call!.approve('0x6cbc0af4e8b1022afab474a68fdabad670bd452d')

              // const call = await push.user!.video.initialize(setVideoData, {
              //   stream: stream, // pass the stream object, refer Stream Video
              //   config: {
              //     video: true, // to enable video on start, for frontend use
              //     audio: true, // to enable audio on start, for frontend use
              //   },
              //   // media?: MediaStream, // to pass your existing media stream(for backend use)
              // });
              
              // call!.approve('0x6cbc0af4e8b1022afab474a68fdabad670bd452d').then(() => {
              //   console.log("APROVED CALL!")
              //   // videoData.
              // })
              
              console.log("CALL INIT BEFORE APPROVE: ", callInit)
              // callInit.approve('0x6cbC0AF4e8b1022aFaB474A68FdAbaD670BD452D').then(() => {
              //   console.log("THEN CALL APPROVE!")
              // })
            }
            
          }else{
            console.log("DIDNT FIND INFO")
          }
        });
      })

    
    // doc.get('voiceChannels').map((voiceChannel: any) => {
    //   if(voiceChannel.chatId == props.chatId){
    //     // console.log("FOUND INFO " + voiceChannel.peerInfo)
    //     console.log("FOUND PEER INFO")
    //     peerInfo = voiceChannel.peerInfo
    //   }
    // })

    // const peerInfo = useCallStore.getState().peerInfo
  }

  // let callList: any[] = []
  // if(initiator){
  //   addUser(stream.local.address)
  // }
  // callList.push(stream.local)
  // if(stream?.incoming[0]?.status == VideoCallStatus.CONNECTED){
  //   callList.push.apply(callList, stream.incoming)
  // }
  // console.log("CALL LIST: " + JSON.stringify(callList))

  // videoStreamData.local
  // const usersInCall = videoStreamData.incoming.map((incoming: PeerData) => {return <div className="flex gap-1"><div>{incoming.address}</div><div>{incoming.audio}</div></div>})
  // const usersInCall = callList.map((call: any) => {return <div className="flex gap-1"><div>{call.address}</div><div>{call.audio}</div></div>})
  // const usersInCall = users.map((user: string) => {return <div>{user}</div>})

  return(
    <>
      <div className="w-full border-deep-purple-300 overflow-y-auto px-2">
        <button className="flex w-full h-8 place-items-center p-1 hover:bg-off-black-400 rounded-lg" onClick={joinCall}>
          <div className="flex flex-row gap-2 overflow-hidden place-items-center">
            <img src={volume} height={20} width={20}/>
            <p className="truncate">{props.name}</p>
            {/* <audio /> */}
          </div>
        </button>
      </div>
      {/* <div>{usersInCall}</div> */}
      <UsersInCall/>
    </>
  )
}



//New Testing Video
function NewVoiceChannelButton(props: {name: string, chatId: string}){
  // const setCall = useCallStore((call) => call.setCall)
  // const callStream = useCallStore((call) => call.stream)
  const setCallStream = useCallStore((call) => call.setStream)
  const stream = useServerStore((server) => server.stream)
  const [videoData, setVideoData] = useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);

  const rules: VideoNotificationRules = {
    access: {
      type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
      data: {
        chatId: props.chatId
      },
    },
  }
  // const peerInfo: VideoPeerInfo = {
  //   address: videoData.meta.initiator.address,
  //   signal: videoData.meta.initiator.signal,
  //   meta: {rules: rules}
  // }

  // const meta = {rules: rules}
  // console.log("SINGAL DATA IN PEERINFO: ", videoData.meta.initiator.signal)

  // useEffect(() => {
  //   if (videoData.incoming[0].status === VideoCallStatus.CONNECTED) {
  //     console.log("CALL CONNECTED in USE EFFECT!")
  //   }
  //   return () => {
  //   };
  // }, [videoData.incoming[0].status]);

  useEffect(() => {
    console.log("VIDEO DATA:", videoData)
    setCallStream(videoData)
  }, [videoData])

  async function joinCall(){
    console.log("JOIN CALL BUTTON")
    // setCurrentVoiceChannel(props.chatId)

    if(stream == undefined){
      console.log("STREAM IS UNDFINED! Try again....", stream)
    }else{
      console.log("CALL INIT: ", stream)
      const callInit = await push.user!.video.initialize(setVideoData, {
        stream: stream!, // pass the stream object, refer Stream Video
        config: {
          video: true, // to enable video on start, for frontend use
          audio: true, // to enable audio on start, for frontend use
        },
        // media?: MediaStream, // to pass your existing media stream(for backend use)
      });

      // setCall(callInit)

      console.log("STARTING / JOINING CALL: ", push.user!.account)

      if(push.user!.account != '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'){
        // const temp: any = stream
        // console.log("STARTING CALL!!!!:", temp.signer)
        // callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules}).then(() => {
        //   console.log("THEN CALL REQUEST!")
        // })
        // callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D']).then(() => {
        //   console.log("THEN CALL REQUEST!")
        // })
        // console.log("CALL INIT 1: ", callInit)
        await callInit.request(['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules})
        // console.log("VIDEO DATA 1:", videoData)
        // callInit.op
      }else{
        // const temp: any = stream
        // console.log("JOINING CALL!!!!:", temp.signer)
        // console.log("VIDEO DATA: ", videoData.incoming[0].)
        // console.log("CALL INIT 2:", callInit)
        // console.log("VIDEO DATA 2:", videoData)
        // console.log("CALL INIT: ", callInit)
        await callInit.approve('0x6cbC0AF4e8b1022aFaB474A68FdAbaD670BD452D');
      }
    }

  }

  // let callList: any[] = []
  // if(initiator){
  //   addUser(stream.local.address)
  // }
  // callList.push(stream.local)
  // if(stream?.incoming[0]?.status == VideoCallStatus.CONNECTED){
  //   callList.push.apply(callList, stream.incoming)
  // }
  // console.log("CALL LIST: " + JSON.stringify(callList))

  // videoStreamData.local
  // const usersInCall = videoStreamData.incoming.map((incoming: PeerData) => {return <div className="flex gap-1"><div>{incoming.address}</div><div>{incoming.audio}</div></div>})
  // const usersInCall = callList.map((call: any) => {return <div className="flex gap-1"><div>{call.address}</div><div>{call.audio}</div></div>})
  // const usersInCall = users.map((user: string) => {return <div>{user}</div>})

  return(
    <>
      <div className="w-full border-deep-purple-300 overflow-y-auto px-2">
        <button className="flex w-full h-8 place-items-center p-1 hover:bg-off-black-400 rounded-lg" onClick={joinCall}>
          <div className="flex flex-row gap-2 overflow-hidden place-items-center">
            <img src={volume} height={20} width={20}/>
            <p className="truncate">{props.name}</p>
            {/* <audio /> */}
          </div>
        </button>
      </div>
      {/* <div>{usersInCall}</div> */}
      <UsersInCall/>
    </>
  )
}

function UsersInCall(){
  const callStream = useCallStore((call) => call.stream)
  console.log("USERS IN CALL STREAM: ", callStream)
  const usersInCall = callStream.incoming.map((peer: PeerData) => {
    return <AudioPlayer stream={peer.stream} isMuted={false} user={peer.address}/>
  })

  return(
    <>
      <div className="flex w-full truncate">
        {/* MAYBE REMOVE LOCAL STREAM AND JUST HAVE PEERS SO YOU DONT HEAR YOUR OWN AUDIO???? */}
        {/* <AudioPlayer stream={callStream.local.stream} isMuted={false} user={callStream.local.address}/> */}
        {usersInCall}
      </div>
    </>
  )
}

function ChatChannelButton(props: {name: string, chatId: string, unread: boolean}){
  // const currentMessages = useServerStore((server) => server.messages)
  const currentTextChannel = useServerStore((server) => server.currentTextChannel)
  const setMessages = useServerStore((server) => server.setMessages)
  const setCurrentTextChannel = useServerStore((server) => server.setCurrentTextChannel)
  const setUsers = useServerStore((server) => server.setUsers)
  const setUserProfiles = useServerStore((server) => server.setUserProfiles)
  const clearMessages = useServerStore((server) => server.clearMessages)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if(props.chatId == currentTextChannel.chatId){
      setActive(true)
    }else{
      setActive(false)
    }
  }, [props.chatId, currentTextChannel.chatId]);

  // async function fetchHistory(reference: string|null = null): Promise<[Msg[], string]>{
  //   const history = await push.user!.chat.history(props.chatId, {reference: reference ,limit: 30})
  //   let messages: Msg[] = []
  //   let reactions: Array<{emoji: string, from: string, reference: string}> = []
  //   // history.forEach((message: any) => {
  //   // history.slice().reverse().forEach(async (message: any) => {
  //   // await Promise.all(history.slice().reverse().map(async (message: any) => {
  //   var i: number = 0
  //   for(i; i<history.length;i++){
  //     const message = history.slice().reverse()[i]
  //     // if(i == 0){
  //       // console.log("FIRST MESSAGE::::: " + JSON.stringify(message))
  //     // }
  //     // console.log("MESSAGE CONTENET: " + JSON.stringify(message))
  //     if(message.messageType == 'Reaction'){
  //       const from = message.fromDID.split(':')[1]
  //       reactions.push({emoji: message.messageContent, from: from,  reference: message.messageObj.reference})
  //     }else if(message.messageType == 'Reply'){
  //       // console.log("THIS IS A REPLY: " + JSON.stringify(message.messageObj.reference))
  //       let element = messages.find(msg => msg.cid === message.messageObj.reference)
  //       // IF YOU REPLY OR REACT TO A MESSAGE FROM 30+ messages ago THIS IS UNDEFINED :/ 
  //       // NEED TO FIX (Idea: add history to fetch in reverse: if given a reference id, fetch 30 messages sent after not before. 
  //       // so when loading chat channel you load from most recently read message and load that reference to get the most recently messages)
  //       // but that wont work when scrolling up to load more messages

  //       // new idea: add undefined items to list ( the reference id of the undefined message and the id of the current message). later add the data:
  //       // {type: 'Reply', reference: 'refId', content: 'reply message...'}
  //       // {type: 'Reaction', reference: 'refId', content: 'emoji'}
  //       if(element == undefined){
  //         const findElement: any = await push.user!.chat.history(props.chatId, {reference: message.messageObj.reference, limit: 1})
  //         const from = message.fromDID.split(':')[1]
  //         const randomId = uuidv4();
  //         const msg: Msg = {
  //           "id": randomId, "origin": from, "timestamp": message.timestamp,
  //           "chatId": currentTextChannel.chatId, "from": from.toLowerCase(),
  //           "message": { "type": "Reply", "content": { "type": message.messageObj.content.messageType, "content": message.messageContent as string }, reference: message.messageObj.reference}, "meta": { "group": true }, "messageContent": message.messageContent,
  //           "cid": message.cid,
  //           reactions: [{
  //             emoji: '',
  //             count: 0,
  //             users: []
  //           }],
  //           reply: {messageBlip: findElement[0]!.messageContent.substring(0, 75), reference: findElement[0]!.cid}
  //         }
  //         messages.push(msg)
  //       }
  //       if(element != undefined){

  //         const from = message.fromDID.split(':')[1]
  //         const randomId = uuidv4();
  //         const msg: Msg = {
  //           "id": randomId, "origin": from, "timestamp": message.timestamp,
  //           "chatId": currentTextChannel.chatId, "from": from.toLowerCase(),
  //           "message": { "type": "Reply", "content": { "type": message.messageObj.content.messageType, "content": message.messageContent as string }, reference: message.messageObj.reference}, "meta": { "group": true }, "messageContent": message.messageContent,
  //           "cid": message.cid,
  //           reactions: [{
  //             emoji: '',
  //             count: 0,
  //             users: []
  //           }],
  //           reply: {messageBlip: element!.messageContent.substring(0, 75), reference: element!.cid}
  //         }
  //         messages.push(msg)
  //       }
  //     }else{
  //       // console.log("ELSE: " + message.messageType)
  //       const from = message.fromDID.split(':')[1]
  //       const randomId = uuidv4();
  //       const msg: Msg = {
  //         "id": randomId, "origin": from, "timestamp": message.timestamp,
  //         "chatId": currentTextChannel.chatId, "from": from.toLowerCase(),
  //         "message": { "type": message.messageType, "content": message.messageContent }, "meta": { "group": true }, "messageContent": message.messageContent,
  //         "cid": message.cid,
  //         reactions: [{
  //           emoji: '',
  //           count: 0,
  //           users: []
  //         }],
  //         reply: null
  //       }
  //       messages.push(msg)
  //     }
  //   }
  // // ))
    
  //   reactions.forEach((reaction) => {
  //     const messageIndex = messages.findIndex(msg => msg.cid == reaction.reference);
  //     if(messageIndex >= 0){
  //       if(messages[messageIndex]!.reactions.some(r => r.emoji == reaction.emoji) == true){
  //         const reactionIndex = messages[messageIndex]!.reactions.findIndex(r => r.emoji == reaction.emoji);
  //         if(messages[messageIndex]!.reactions[reactionIndex].users.includes(reaction.from)){
  //           messages[messageIndex]!.reactions[reactionIndex].count -= 1
  //           const indexOfUser = messages[messageIndex]!.reactions[reactionIndex].users.indexOf(reaction.from)
  //           messages[messageIndex]!.reactions[reactionIndex].users.splice(indexOfUser, 1)
  //         }else{
  //           messages[messageIndex]!.reactions[reactionIndex].count += 1
  //           messages[messageIndex]!.reactions[reactionIndex].users.push(reaction.from)
  //         }
  //       }else{
  //         messages[messageIndex]!.reactions.push({
  //           emoji: reaction.emoji,
  //           count: 1,
  //           users: [reaction.from]
  //         })
  //       }
  //     }
  //   })
  //   let cid: string = ''
  //   try{
  //     cid = history[history.length-1].cid
  //   }catch{
  //     // new channel and no messages sent yet
  //     console.log("no messages")
  //   }

  //   const messagesRev = messages.reverse()
  //   return [messagesRev, cid];
  // }

  async function getNewMessages(chatId: string){
    let count = 0
    let reference: string | null = null
    let success = false
    let lastRef: string = ''
    let cid: string | null = null
    let lastReadCid: string = ''
    const c = await cache2.fetchChannel(chatId);
    console.log("CHANNEL before fetching push messages: ", c)
    while(true){
      // [messages, reference] = await fetchHistory(chatId, reference)
      // console.log("Fetching New Messages!!")
      // [success, reference] = await newFetchHistory(chatId, reference)
      // console.log(count + ": WHILE LOOP last read cid: " + lastReadCid);
      console.log("NEW FETCH HISTORY: chatid: " + chatId + ", reference: " + reference);
      console.log("LAST READ CID: before fetch: ", lastReadCid);
      [success, reference, cid] = await newFetchHistory(chatId, reference);
      console.log("AFTER FETCH HISTORY: RESSULTS: success: " + success + ", reference: ", reference + ", cid: " + cid);
      if(cid != null){
        console.log("last read cid is not null: ", cid);
        lastReadCid = cid;
      }
      if(!success){
        // new channel and no messages sent yet
        if(lastReadCid != ''){
          console.log("Setting last read cid 1: ", lastReadCid);
          cache2.updateLastReadMessageCid(chatId, lastReadCid);
        }
        break
      }
      if(lastRef == reference){
        console.log("CANT LOAD ANY MORE MESSAGES: " + count);
        if(lastReadCid != ''){
          console.log("Setting last read cid 2: ", lastReadCid);
          cache2.updateLastReadMessageCid(chatId, lastReadCid);
        }
        break
      }else{
        if(reference != null){
          lastRef = reference
        }
      }
      if(count > 20){
        cache2.updateLastReadMessageCid(chatId, lastReadCid)
        break
      }else{
        count += 1
      }
    }
    // console.log("AFTER WHILE Loop")
    // const channel = await cache2.fetchChannel(chatId)
    // const channel = await cache2.channels.get(chatId)
    // console.log("THIS CHANNEL AFTER: ", channel)
  }

  function getUsers(){
    let foundUser = false
    push.user!.chat.group.participants.list(
      props.chatId,
      {
        filter: {
          role: 'admin',
          pending: false,
        },
      }
    ).then((admins: {members: ChatMemberProfile[]}) => {
      push.user!.chat.group.participants.list(
        props.chatId,
        {
          filter: {
            role: 'member',
            pending: false,
          },
        }
      ).then((members: {members: ChatMemberProfile[]}) => {
        let userProfiles: any = {}
        admins.members.map((member: ChatMemberProfile) => {
          if(member.address == push.user?.account){
            foundUser = true
          }
          userProfiles[member.address.split(':')[1].toLowerCase()] = member.userInfo.profile
        })
        members.members.map((member: ChatMemberProfile) => {
          if(foundUser == false){
            if(member.address == push.user?.account){
              foundUser = true
            }
          }
          userProfiles[member.address.split(':')[1].toLowerCase()] = member.userInfo.profile
        })
        // Join if user is not in channel
        if(!foundUser){
          push.user!.chat.group.join(props.chatId)
        }
        setUserProfiles(userProfiles)
        setUsers({admins: admins.members, members: members.members})
      })
    })
  }

  async function changeChannel(){
    getUsers()
    if(currentTextChannel.chatId != props.chatId){
      console.log("changing channel!")
      clearMessages()
      setCurrentTextChannel({name: props.name, chatId: props.chatId, unread: props.unread})
      // const channels: Map<string, any> = await cache.channels!.findOne().where('chatId').eq(props.chatId).exec()
      // console.log("CHANNELS : " + JSON.stringify(channels))
      // setMessages(channels.get('messages'))
      // cache.fetchRecentMessages(props.chatId).then((messages: Message[])=> {
      //   setMessages(messages)
      // })
      // cache2.fetchRecentMessages(props.chatId).then((messages: Message[])=> {
      //   setMessages(messages)
      // })
      const cachedMessages = await cache2.fetchRecentMessages(props.chatId)
      console.log("CACHED MESSAGES: ", cachedMessages)
      setMessages(cachedMessages)
      console.log("getting new messages!!!!!")
      await getNewMessages(props.chatId)
    }
  }
  let buttonStyle = 'flex w-full h-8 place-items-center p-0.5 mb-0.5 hover:bg-off-black-400 rounded-lg'
  if(active){
    buttonStyle = 'flex w-full h-8 place-items-center p-0.5 mb-0.5 bg-deep-purple-300 rounded-lg'
  }

  return(
    <>
      <div className="w-full overflow-y-auto px-2">
        <button className={buttonStyle} onClick={changeChannel}>
          <div className="flex w-full justify-between">
            <div className="flex flex-row gap-2 overflow-hidden place-items-center">
              <img src={hashtag} height={20} width={20}/>
              <p className="truncate">{props.name}</p>
            </div>
            <div className="flex place-items-center p-2">
              {props.unread ? <div className="flex place-items-center w-2 h-2 rounded-full bg-deep-purple-100"/> : <p/>}
            </div>
          </div>
        </button>
      </div>
    </>
  )
}

export function BottomBar(){
  const [input, setInput] = useState('');
  // const push = useHookstate(_push);
  // const [image, setImage] = useState('')
  const [images, setImages] = useState<Array<string>>([])
  const [showGiphy, setShowGiphy] = useState('invisible')
  const [showStickers, setShowStickers] = useState('invisible')
  const [showEmojis, setShowEmojis] = useState('invisible')
  const currentTextChannel = useServerStore((state) => state.currentTextChannel)
  const currentDM = useDirectMessageStore(dm => dm.currentDM)
  const currentScreen = useGlobalStore(global => global.currentScreen)
  const profile = useUserStore((user) => user.profile)
  const setUserProfiles = useServerStore(server => server.setUserProfiles)
  const setReply = useServerStore((server) => server.setReply)
  const setFiles = useServerStore((server) => server.setFiles)
  const appendFile = useServerStore((server) => server.appendFile)
  const files = useServerStore((server) => server.files)
  const appendMessage = useServerStore((state) => state.appendMessage)
  const addReferenceId = useServerStore((server) => server.addReferenceId)
  const setCurrentDM = useDirectMessageStore(dm => dm.setCurrentDM)
  const setNewMessage = useDirectMessageStore(dm => dm.setNewMessage)
  // const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const wrapperRef = useRef(null);
  const giphyRef = useRef(null);
  const stickerRef = useRef(null);
  const emojiRef = useRef(null);
  
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log("EVENT: " + event.target.value);
    setInput(event.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';  // Reset the height
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;  // Set it to the scroll height
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>){
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      send();
    }
  }

  // function adjustHeight() {
  //   inputRef.current?.style.height = 'auto'; 
  //   // textarea.style.height = 'auto';  // Reset the height
  //   // textarea.style.height = `${textarea.scrollHeight}px`;  // Set height based on scroll height
  // }
  
  outsideGiphyAlerter(giphyRef);
  outsideStickersAlerter(stickerRef);
  outsideEmojisAlerter(emojiRef)

  function outsideGiphyAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          setShowGiphy('invisible')
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function outsideStickersAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          setShowStickers('invisible')
          // setShowInteractions('group-hover:visible invisible')
          // console.log("You clicked inside of me!");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function outsideEmojisAlerter(ref: React.MutableRefObject<any>) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: MouseEvent) {
        if (!ref.current.contains(event.target)) {
          setShowEmojis('invisible')
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  async function send(){
    const files = useServerStore.getState().files;
    const reply = useServerStore.getState().reply;

    let from = push.user!.account.split(':')[1]
    if(from == undefined){
      from = push.user!.account
    }

    const randomId = uuidv4();

    if(input.trim() == ''){
      if(files.length != 0){
          // var i: number = 0
          // for(i; i<files.length;i++){
        files.map(async (file: any) => {
          // console.log("FILE " + i + ": " + " type:" + files[i].type + ", name: " + files[i].name, ", base64: " + files[i].base64.substring(0,20))
          // console.log("FILE: type:" + file.type + ", name: " + file.name, ", base64: " + file.base64.substring(0,20))
          // const msg: Msg = {
          //   "id": randomId, "origin": "self", "timestamp": Date.now(),
          //   "chatId": currentTextChannel.chatId, "from": from.toLowerCase(),
          //   "message": { "type": "File", "content": `{"content":"data:${file.type};base64,${file.base64}, "name":${file.name}}`}, "meta": { "group": true }, "messageContent": message,
          //   "cid": "",
          //   reactions: [{
          //     emoji: '', count: 0,
          //     users: []
          //   }],
          //   reply: null
          // }
          // appendMessage(msg)

          // console.log("FILE: type:" + file.type + ", name: " + file.name, ", base64: " + file.base64.substring(0,20))
          const message: Message = {
            id: randomId, 
            origin: "self", 
            timestamp: Date.now(),
            chatId: currentTextChannel.chatId, 
            from: from.toLowerCase(),
            // message: { type: "File", content: `{"content":"data:${file.type};base64,${file.base64}, "name":${file.name}}`}, 
            message: {
              type: "File",
              content: `{"content":"${file.content}", "name":${file.name}}`
            },
            group: true,
            cid: "",
            reactions: {},
            reply: null
          }
          appendMessage(message)

          const fileReponse = await push.user!.chat.send(currentTextChannel.chatId, {
            type: 'File',
            // content: `{"content":"data:${file.type};base64,${file.base64}", "name":${file.name}}`,
            
            // old one works below but need to update for better code to convert content into json obj
            // content: `{"content":"data:${file.type};base64,${file.base64}, "name":${file.name}}`,
            // testing new below
            content: `{"content":"${file.content}", "name":${file.name}}`,
          });
          console.log("FILE RESPONSE: ", fileReponse)
        })
        setFiles([])
      }
    }else{
      if(reply){
        console.log("SENDING A REPLY::: of this message: " + reply.message)

        const message: Message = {
          id: randomId,
          chatId: currentTextChannel.chatId,
          origin: "self",
          timestamp: Date.now(),
          from: push.user?.account.toLowerCase()!,
          // type: 'Text',
          message: { type: 'Reply', content: { type: "Text", content: input }, reference: reply.reference },
          group: false,
          cid: "",
          // readCount: 0,
          // lastAccessed: 0,
          reply: { from: reply.from, message: reply.message, reference: reply.reference },
          reactions: {}
        }


        // appendMessage(msg)
        appendMessage(message)
        // cache.appendMessage(currentTextChannel.chatId, message)
        // setMessages
        setInput('')
        setReply(null)
        if(textareaRef.current != null){
          textareaRef.current.focus()
          textareaRef.current.style.height = 'auto';  // Reset height to auto
        }

        const replyResponse = await push.user!.chat.send(currentTextChannel.chatId, {
          type: 'Reply',
          content: {
            type: 'Text', content: input
          },
          reference: reply.reference
        })

        addReferenceId(randomId, replyResponse.cid)
        // cache.addCid(currentTextChannel.chatId, randomId, replyResponse.cid)
      }else{
        // console.log("SENDING FROM SELF::: ")
        console.log("SENDING A normal msgggg: " + input)
        const randomId = uuidv4();
        // const msg: Msg = {
        //   "id": randomId, "origin": "self", "timestamp": Date.now(),
        //   "chatId": currentTextChannel.chatId, "from": from.toLowerCase(),
        //   "message": { "type": "Text", "content": message }, "meta": { "group": true }, "messageContent": message,
        //   "cid": "",
        //   reactions: [{
        //     emoji: '', count: 0,
        //     users: []
        //   }],
        //   reply: null
        // }

        const message: Message = {
          chatId: currentTextChannel.chatId,
          id: randomId,
          origin: "self",
          timestamp: Date.now(),
          from: push.user?.account.toLowerCase()!,
          // type: 'Text',
          message: { type: 'Text', content: input },
          group: false,
          cid: "",
          // readCount: 0,
          // lastAccessed: 0,
          reply: null,
          reactions: {}
        }


        // appendMessage(msg)
        // console.log("APPENDING MESSAGE: " +JSON.stringify(message))
        // console.log("messages: " + JSON.stringify(useServerStore.getState().messages))
        appendMessage(message)
        // cache.appendMessage(currentTextChannel.chatId, message)
        setInput('')
        if(textareaRef.current != null){
          textareaRef.current.focus()
          textareaRef.current.style.height = 'auto';  // Reset height to auto
        }

        // const cid = await push.sendMessage(input, currentTextChannel.chatId);
        let chatId = currentTextChannel.chatId
        if(currentScreen == 'DirectMessages'){
          chatId = currentDM!
          // console.log("CHAT ID FROM DIRECT MESSAGES: ", chatId)
          let profiles: { [address: string]: UserProfile } = {}
          profiles[push.user?.account.toLowerCase()!] = profile!
          const recipientProfile = await push.user?.profile.info({overrideAccount: chatId})
          profiles[chatId] = recipientProfile
          setUserProfiles(profiles)
        }

        const msg = await push.user!.chat.send(chatId, {
          content: input,
          type: 'Text',
        });

        if(currentScreen == 'DirectMessages'){
          setCurrentDM(msg.chatId!)
          setNewMessage(false)
        }

        console.log("MESSAGE FROM SEND! ", msg)

        addReferenceId(randomId, msg.cid);
        // cache2.updateLastReadMessageCid(currentTextChannel.chatId, msg.cid);
        // cache.addCid(currentTextChannel.chatId, randomId, cid!)
      }
    }
  }

  function onPaste(event: any){
    // console.log("ON PASTE: " + item.itemType)
    var text = (event.originalEvent || event).clipboardData.getData(
      "text/html"
    );

    if(text.includes('<img src=')){
      const src = text.split(`<img src="`)[1].split(`"`)[0]
      setImages([...images, src])
    }
  }

  function ImageItem(props: {src: string}){
    function removeImage(src: string){
      let filteredArray = images.filter(image => image !== src)
      setImages(filteredArray)
    }

    return(
      <>
        <div className="inline-block relative p-2">
          <img className="rounded-lg object-contain w-full h-full" src={props.src}/>
          <button className="absolute top-2 right-2" onClick={() => removeImage(props.src)}>
            <img className="hover:bg-red-700 rounded-full" src={close} height={35} width={35}/>
          </button>
        </div>
      </>
    )
  }

  const imageList = images.map((src: string) => {return <ImageItem key={src} src={src}/>})

  // const [files, setFiles] = useState<Array<any>>([]);

  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: ['.txt', '.pdf'],
    readAs: "ArrayBuffer",
    validators: [
      new FileSizeValidator({ maxFileSize: 1 * 1024 * 1024 /* 1 MB */ }),
    ],
    onFilesSelected: ({ plainFiles, filesContent, errors }) => {
      // this callback is always called, even if there are errors
      console.log('onFilesSelected', plainFiles, filesContent, errors);
      // console.log('onFilesSelected: ', plainFiles)
      if(errors == undefined){
        console.log("NO ERROR FILES : ", filesContent)
        // setFiles([...files, ...plainFiles])
        let count = 0
        filesContent.map((item: any) => {
          console.log()
          // const base64String = btoa(String.fromCharCode(...new Uint8Array(filesContent[count].content)));
          // const base64String = btoa(String.fromCharCode(...new Uint8Array(filesContent[count].content)));
          // let u8s = new Uint8Array(filesContent[count].content)
          // const base64string = Base64.fromUint8Array(u8s);
          // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(filesContent[count].content)));
          console.log("CONTENT: " + filesContent[count].content)
          console.log("CONTENT TYPE: " + typeof(filesContent[count].content))
          // console.log('BASE 64 STRING:::' + base64String)
          // filesContent[count]['base64'] = base64string
          filesContent[count]['content'] = filesContent[count].content
          filesContent[count]['type'] = plainFiles[count].type
          // appendFile(filesContent[count])
          count += 1
        })
        const currentFilesState = useServerStore.getState().files;
        setFiles([...currentFilesState, ...filesContent])
        // appendFile()
        // setFileUpload(plainFiles)
      }
    },
  });

  function FileItem(props: {file: any, index: number}){
    // console.log("FILE: " + props.file + " INDEX: " + props.index)
    function removeFile(file: any){
      // console.log("FILE STUFF: " + file.content)
      console.log("FILE STUFF: " + file.base64)
      let filteredArray = files.filter(f => f !== file)
      setFiles(filteredArray)
    }

    return(
      <>
        <div className="inline-block relative group">
          <div className="py-1 px-2 bg-deep-purple-100 text-deep-purple-300 rounded">
            {props.file.name}
          </div>
          <button className="absolute -top-2 -right-3 invisible group-hover:visible z-50" onClick={() => removeFile(props.file)}>
            <img className="hover:bg-red-700 rounded-full" src={close} height={25} width={25}/>
          </button>
        </div>
      </>
    )
  }

  function addEmoji(emoji: string){
    setInput(input + emoji)
  }

  // const filesList = filesContent.map((file, index) => {return <FileItem file={file} index={index}/>})
  const filesList = files.map((file, index) => {return <FileItem key={file.file} file={file} index={index}/>})
  const emojiList = Object.values(CHAT.REACTION)
  let emojiElements = emojiList.map((emoji: string) => <button key={emoji} className="hover:bg-deep-purple-400 rounded-md" onClick={()=> addEmoji(emoji)}>{emoji}</button>)

  return(
    <>
      {/* {image != '' ? <div className="bg-deep-purple-400 rounded-t-md p-3"><span dangerouslySetInnerHTML={{ __html: image }}></span></div> : <p/>} */}
      {/* {image != '' ? <div className="bg-deep-purple-400 rounded-t-md p-3"><img src={image}/></div> : <p/>} */}
      {/* {filesList.length != 0 ? <div className="flex bg-deep-purple-300 rounded-t-md px-3 pt-2 pb-4 gap-1 mx-3 mb-1">{filesList}</div> : <p/>} */}
      {/* {filesList.length != 0 ? <div className="flex bg-deep-purple-300 rounded-md mx-3 -mt-3 px-3 pt-2 pb-4 max-h-[500px]">{filesList}</div> : <p/>}
      {images.length != 0 ? <div className="flex bg-deep-purple-300 rounded-md mx-3 -mt-3 px-3 pt-2 pb-4 max-h-[500px]">{imageList}</div> : <p/>} */}
      <div className="flex w-full justify-center shrink-0">
      {/* <div className="fixed bottom-2 w-full justify-center shrink-0"> */}
        <div className="relative h-[calc(58px)] w-full mx-3">
          {/* <input ref={inputRef} onKeyDown={e => e.key == 'Enter' ? onSend(): ''} className="z-0 w-full h-full bg-off-black-600 rounded-lg p-2 focus:outline-none pr-56" placeholder='send message' value={input} onChange={handleInputChange} autoFocus={true} onPaste={onPaste}/> */}
          <div className="absolute bottom-2 w-full">
            <Reply/>
            {filesList.length != 0 ? <div className="absolute z-50 -top-1 -translate-y-full p-2 bg-deep-purple-300 rounded-md max-h-[500px]">{filesList}</div> : <p/>}
            {images.length != 0 ? <div className="absolute z-50 -top-1 -translate-y-full bg-deep-purple-300 rounded-md p-2 max-h-[500px]">{imageList}</div> : <p/>}
            <textarea rows={1} ref={textareaRef} onKeyDown={handleKeyDown} className="z-0 w-full min-h-14 bg-off-black-600 rounded-lg px-2 py-4 focus:outline-none pr-56 resize-none" placeholder={`Send message to #${currentTextChannel.name}`} value={input} onChange={handleInputChange} autoFocus={true} onPaste={onPaste}/>
            <div className="absolute right-[calc(68px)] top-2 bg-deep-purple-300 px-2 py-1 h-10 rounded-md">
              <div className="flex place-items-center h-full w-full gap-1">
                <button onClick={()=> setShowStickers('visible')}>
                  <img src={sticker} height={30} width={30}/>
                </button>
                <button onClick={()=> setShowGiphy('visible')}>
                  <img src={gif} height={35} width={35}/>
                </button>
                <button onClick={()=> setShowEmojis('visible')}>
                  <img src={emoji2} height={30} width={30}/>
                </button>
                <button onClick={()=> openFilePicker()}>
                  <img src={file} height={30} width={30}/>
                </button>
              </div>
            </div>
            <div ref={giphyRef} className={"absolute right-0 -top-[502px] w-[500px] h-[500px] bg-deep-purple-300 rounded-t-xl " + showGiphy}>
              <GiphyGrid/>
            </div>
            <div ref={stickerRef} className={"absolute right-0 -top-[502px] w-[500px] h-[500px] bg-deep-purple-300 rounded-t-xl " + showStickers}>
              <StickerGrid/>
            </div>
            <div ref={emojiRef} className={"z-50 absolute right-5 bottom-14 bg-deep-purple-100 rounded-lg border-2 border-deep-purple-300 " + showEmojis}>
              <div className="grid gap-1 grid-cols-8 place-items-center text-3xl p-0.5 h-96 overflow-y-auto overflow-x-hidden">
                {emojiElements}
              </div>
            </div>
            <button className="absolute right-2 top-2 bg-deep-purple-300 px-2 py-1 h-10 rounded-md hover:bg-deep-purple-200" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function AddChannelModal(){
  // let [isOpen, setIsOpen] = useState(false)
  const openModal = useHookstate(_openCreateChatChannelModal);
  // const serverId = useHookstate(_serverId);
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [textChannel, setTextChannel] = useState(true)

  const serverId = useServerStore((state) => state.serverId)
  const appendTextChannel = useServerStore((state) => state.appendTextChannel)
  const appendVoiceChannel = useServerStore((state) => state.appendVoiceChannel)
  // const appendCChannel = useServerStore((state) => state.append)

  // const [image, setChannelName] = useState('');
  const [showError, setShowError] = useState(false);
  // const push = useHookstate(_push);

  const handleChannelInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("EVENT: " + event.target.value);
    setChannelName(event.target.value)
  }

  const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("EVENT: " + event.target.value);
    setDescription(event.target.value)
  }
  
  let textColor = 'text-deep-purple-300'
  if(showError){
    textColor = 'text-red-500'
  }

  async function onChannelAdd(){
    if(channelName == ''){
      setShowError(true);
    }else{
      console.log("serverId: " + serverId)
      if(serverId != ''){
        const newChatId = await push.createChannel(serverId, channelName, description, '', ['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465'], textChannel, !textChannel)
        if(newChatId != undefined){
          console.log("NEW CHAT ID: " + newChatId)
          if(textChannel){
            appendTextChannel({name: channelName, chatId: newChatId, unread: true})
          }else{
            // appendVoiceChannel({name: channelName, chatId: newChatId, peerInfo: ''})
            appendVoiceChannel({name: channelName, chatId: newChatId, peerInfo: null})
          }
        }else{
          console.log("Chat Channel Creation FAILED!")
        }
      }
      openModal.set(false);
      setShowError(false);
    }
  }

  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>Open dialog</button> */}
      <Dialog open={openModal.value} onClose={() => {openModal.set(false);setShowError(false);}} className="relative z-50 text-deep-purple-100 select-none">
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="flex flex-col max-w-lg space-y-1 bg-deep-purple-300 p-20 rounded-md">
            <DialogTitle className="font-light text-3xl">Create New Channel</DialogTitle>
            <button className="flex w-full bg-deep-purple-400 p-2 rounded-md justify-between place-items-center" onClick={() => setTextChannel(true)}>
              <div>Text Channel</div>
              <div className={"h-4 w-4 rounded-full border-2 border-deep-purple-100" + (textChannel ? ' bg-deep-purple-100' : ' bg-deep-purple-400')}/>
            </button>
            <button className="flex w-full bg-deep-purple-400 p-2 rounded-md justify-between place-items-center focus:" onClick={() => setTextChannel(false)}>
              <div>Voice Channel</div>
              <div className={"h-4 w-4 rounded-full border-2 border-deep-purple-100 " + (textChannel ? ' bg-deep-purple-400' : ' bg-deep-purple-100')}/>
            </button>
            <div className={textColor}>Channel name cannot be empty</div>
            <input className="w-full bg-deep-purple-400 p-2 rounded-md focus:outline-none placeholder:text-deep-purple-200" placeholder="enter channel name" onChange={handleChannelInputChange}/>
            <input className="w-full bg-deep-purple-400 p-2 rounded-md focus:outline-none placeholder:text-deep-purple-200" placeholder="enter description (optional)" onChange={handleDescriptionInputChange}/>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button className="bg-deep-purple-100 p-2 rounded-md text-deep-purple-300 font-bold shadow-md shadow-deep-purple-800 hover:shadow-none duration-100" onClick={() => {onChannelAdd()}}>Add</button>
              <button className="bg-deep-purple-100 p-2 rounded-md text-deep-purple-300 font-bold shadow-md shadow-deep-purple-800 hover:shadow-none duration-100 hover:text-red-500" onClick={() => {openModal.set(false);setShowError(false);}}>Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

function VideoPlayer(props: {stream: MediaStream | null, isMuted: boolean}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const videoRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      console.log("VIDEO REF: " + videoRef.current)
      videoRef.current.srcObject = props.stream;
      videoRef.current.play();
    }
  }, [videoRef, props.stream]);

  // return <video className="w-[500px] h-[500px] border-2 rounded" ref={videoRef} muted={props.isMuted} autoPlay/>;
  return <video className="w-[500px] h-[500px] border-2 rounded" ref={videoRef} muted={props.isMuted} autoPlay/>;
}


function AudioPlayer(props: {stream: MediaStream | null, isMuted: boolean, user: string}) {
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const users = useCallStore((call) => call.users)
  const audioRef = useRef<HTMLAudioElement>(null);
  // users
  // props.stream.address
  // const videoRef = useRef<any>(null);
  useEffect(() => {
    if (audioRef.current) {
      console.log("VIDEO REF: " + audioRef.current)
      audioRef.current.srcObject = props.stream;
      audioRef.current.play();
    }
  }, [audioRef, props.stream]);

  // return <video className="w-[500px] h-[500px] border-2 rounded" ref={videoRef} muted={props.isMuted} autoPlay/>;
  // return <audio className="w-[500px] h-[500px] border-2 rounded" ref={audioRef} muted={props.isMuted} autoPlay/>;
  return (
    <>
      <div>
        <audio ref={audioRef} autoPlay={true} muted={props.isMuted}/>
        <p className="pl-10 truncate line-clamp-1">{props.user}</p>
      </div>
    </>
  )
}