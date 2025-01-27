import { Immutable, ImmutableArray, ImmutableObject, useHookstate } from "@hookstate/core";
import { CHAT, ChatMemberProfile, CONSTANTS, GroupDTO, GroupInfoDTO, IFeeds, PeerData, PushAPI, TYPES, user, UserProfile, VideoCallStatus, VideoNotificationRules, VideoPeerInfo,
} from "@pushprotocol/restapi/src";
import { ethers } from "ethers";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { _db, _openCreateChatChannelModal, _push } from "../../screens/globalState";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { cache, push, rxdb } from "../../App";
import { Msg, useServerStore, Reaction, useCallStore, useUserStore } from "../../state-management/store";
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
import { RxDocument } from "rxdb";
import { fetchHistory, newFetchHistory } from "../../helperFunctions/fetch";
import StickerGrid from "./Stickers";
import LinkPreview from "./LinkPreview";
import Interactions from "./message/Interactions";
import { Message, ReferenceContent, Content } from "../../cache";
import MessageElement from "./message/MessageElement";
import { of } from "rxjs";
import { UserInfoLarge, UserInfoSmall } from "./UserInfo";
import { gun, TextChannel, updatePeerInfo, VoiceChannel } from "../../gun";
import { channel } from "diagnostics_channel";

export default function Server(props: {db: any, serverId: Immutable<string>}){
  // const appendMessage = useServerStore((server) => server.appendMessage)
  // const addOrRemoveReaction = useServerStore((server) => server.addOrRemoveReaction)
  // const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  // // const addReaction = useServerStore((server) => server.addReaction)
  // // const incrementReactionCount = useServerStore((server) => server.incrementReactionCount)
  // // const decrementReactionCount = useServerStore((server) => server.decrementReactionCount)
  // // const getMessages = useServerStore((state) => state.getMessages)
  // // const addReferenceId = useServerStore((server) => server.addReferenceId)
  // const [stream, setStream] = useState<PushStream>()
  // // const [videoData, setVideoData] = useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);
  // // const setVideoStreamData = useServerStore((server) => server.setVideoStreamData)
  // // const setCall = useServerStore((server) => server.setCall)
  // // const setVideoPeerInfo = useServerStore((server) => server.setVideoPeerInfo)
  // const setCallStream = useCallStore((call) => call.setStream)
  // const setCall = useCallStore((call) => call.setCall)
  // // const setPeerInfo = useCallStore((call) => call.setPeerInfo)
  // // const setInitiator = useCallStore((call) => call.setInitiator)
  // const addUser = useCallStore((call) => call.addUser)
  // // let serverName = '';
  
  // // const serverId = useHookstate(_serverId);
  // // const currentServerId = serverId.value;

  // // console.log("RERENDER")
  // // console.log("SID: " + serverId.value + " CID: " + currentServerId)
  // // console.log("serverName: " + serverName)
  // // if(props.serverId != null && props.serverId != ''){
  // //   props.db.servers!.findOne().where('id').eq(props.serverId).exec().then((res: any) => {
  // //     // console.log('RESULT: ' + JSON.stringify(res));
  // //     // console.log("name: " + res.name)
  // //     if(serverName != res.name){
  // //       setServerName(res.name);
  // //     }
  // //     // console.log("serverName: " + serverName)
  // //     // serverName = res.name
  // //   });
  // // }
  // // console.log("SERVER DOC: " + JSON.stringify(doc));

  // // initServer();

  // useEffect(() => {
  //   console.log("INIT CHANNEL: " + props.serverId)
  //   initServer();
  // //   if (videoData?.incoming[0]?.status !== CONSTANTS.VIDEO.STATUS.UNINITIALIZED)
  // //     return; 
  // // }, [videoData.incoming[0].status])
  // })

  // const initServer = async () => {
  //   console.log("INIT SERVER INIT")
  //   // const doc =  await rxdb.servers!.findOne({
  //   //   selector: {
  //   //     id: {
  //   //       $eq: props.serverId
  //   //     }
  //   //   }
  //   // }).exec()

  //   // await doc.update({
  //   //   $set: {
  //   //     'voiceChannel.$[x].peerInfo': '',
  //   //     filter: [{"x.chatId": '006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766'}]
  //   //   },
  //   // })

  //   // await doc.get('voiceChannels').map((voiceChannel: any) => {
  //   //   if(voiceChannel.chatId == '006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766'){
  //   //     console.log("INIT FOUND INFO!!!!!!! " + voiceChannel.peerInfo)
  //   //     // peerInfo = voiceChannel.peerInfo
  //   //   }
  //   // })
    
  //   try {
  //     // const stream = await user!.initStream(
  //     const stream = await push.user?.initStream(
  //       [
  //         CONSTANTS.STREAM.CHAT, // Listen for chat messages
  //         // CONSTANTS.STREAM.NOTIF, // Listen for notifications
  //         CONSTANTS.STREAM.CONNECT, // Listen for connection events
  //         CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
  //         CONSTANTS.STREAM.VIDEO // CALLS
  //       ],
  //       {
  //         // Filter options:
  //         filter: {
  //         // Listen to all channels and chats (default):
  //           channels: ['*'],
  //           chats: ['*'],
  //           // chats: [props.channelId]
  //           // Listen to specific channels and chats:
  //           // channels: ['channel-id-1', 'channel-id-2'],
  //           // chats: ['chat-id-1', 'chat-id-2'],
      
  //           // Listen to events with a specific recipient:
  //           // recipient: '0x...' (replace with recipient wallet address)
  //         },
  //         // Connection options:
  //         connection: {
  //           retries: 3, // Retry connection 3 times if it fails
  //         },
  //         raw: false, // Receive events in structured format
  //       }
  //     );
      
  //     // Chat event listeners:
      
  //     // // Stream connection established:
  //     stream!.on(CONSTANTS.STREAM.CONNECT, () => {
  //       // console.log('Stream Connected: ' + user!.account);
  //       console.log('Stream Connected: ' + push.user!.account);
        
      
  //       // Send initial message to PushAI Bot:
  //       // console.log('Sending message to test wallet');
      
  //       // await user!.chat.send('0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', {
  //       //   content: 'Hello, from test user',
  //       //   type: 'Text',
  //       // });
      
  //       // console.log('Message sent to test wallet');
  //     });
      
  //     // Chat message received:
  //     stream!.on(CONSTANTS.STREAM.CHAT, (pushMsg: any) => {
  //       console.log("STREAM GOT NEW MESSAGE!!! ", stream?.uid)
  //       if(pushMsg.chatId == currentChatChannel.chatId){
  //         cache.updateLastReadMessageCid(pushMsg.chatId, pushMsg.reference)
  //       }
  //       const randomId = uuidv4();
  //       let from = pushMsg.from.split(':')[1].toLowerCase()
  //       console.log("from: 1 " + from)
  //       if(from == undefined){
  //         from = pushMsg.from.toLowerCase()
  //       }
  //       console.log("from: 2 " + from)
  //       // localStorage.setItem("lastReadMessage", pushMsg.cid);
  //       // if(message.message.type == 'Text'){
  //       if(pushMsg.message.type != 'Reaction' && pushMsg.message.type != 'Reply'){
  //         console.log("THIS MESSAGE IS NOT REACTION OR FILE OR REPLY")
  //         const message: Message = {
  //           id: randomId,
  //           chatId: pushMsg.chatId,
  //           origin: pushMsg.origin,
  //           timestamp: pushMsg.timestamp,
  //           from: from,
  //           message: pushMsg.message,
  //           group: pushMsg.meta.group,
  //           cid: pushMsg.reference,
  //           // readCount: 0,
  //           // lastAccessed: 0,
  //           reply: null,
  //           reactions: {}
  //         }
  //         if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
  //           console.log("APPENDING MESSAGE 1")
  //           appendMessage(message)
  //         }
  //         cache.appendMessage(message).then((result: boolean) => {
  //           if(result){
  //             console.log("NO ERROR IN CACHE!")
  //           }else{
  //             console.log("Message DUP!")
  //           }
  //         }).catch(() => {
  //           console.log("ERROR IN CACHE!")
  //         })
  //       }
  //       if(pushMsg.message.type == 'Reaction'){
  //         // console.log
  //         if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
  //           addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference)
  //         }
  //         cache.updateReactions(pushMsg.message.content, from, pushMsg.message.reference)
  //       }if(pushMsg.message.type == 'Reply'){
  //         console.log("GOT A REPLY!" + pushMsg.message.reference)
  //         // console.log()
  //         push.user!.chat.history(pushMsg.chatId, {reference: pushMsg.message.reference, limit: 1}).then((foundMessage: any) => {
  //           console.log("FIND ELEMENT IN REPLY: " + JSON.stringify(foundMessage))
  //           const message: Message = {
  //             id: randomId,
  //             chatId: pushMsg.chatId,
  //             origin: pushMsg.origin,
  //             timestamp: pushMsg.timestamp,
  //             from: from,
  //             // message: { type: pushMsg.message.type, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.conten}, reference: pushMsg.message.reference },
  //             message: { type: pushMsg.messageType, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.content}, reference: pushMsg.message.reference },
  //             group: pushMsg.meta.group,
  //             cid: pushMsg.cid,
  //             reply: { messageBlip: foundMessage[0]!.messageObj.content.substring(0, 75), reference: pushMsg.message.reference },
  //             reactions: {}
  //           }
  //           if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
  //             console.log("APPENDING MESSAGE 2")
  //             appendMessage(message)
  //           }
  //           cache.appendMessage(message)
  //         })
  //         // console.log("FIND ELEMENT IN REPLY: " + JSON.stringify(findElement))
  //         // const message: Message = {
  //         //   id: randomId,
  //         //   chatId: pushMsg.chatId,
  //         //   origin: pushMsg.origin,
  //         //   timestamp: pushMsg.timestamp,
  //         //   from: from,
  //         //   // message: { type: pushMsg.message.type, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.conten}, reference: pushMsg.message.reference },
  //         //   message: { type: pushMsg.messageType, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.content}, reference: pushMsg.message.reference },
  //         //   group: pushMsg.meta.group,
  //         //   cid: pushMsg.cid,
  //         //   reply: {messageBlip: findElement[0]!.message.content.substring(0, 75), reference: pushMsg.message.reference},
  //         //   reactions: {}
  //         // }
  //         // if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
  //         //   appendMessage(message)
  //         // }
  //         // cache.appendMessage(message)
  //       }
        
  //     });
      
      
  //     // Chat operation received:
  //     stream!.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
  //       console.log('Chat operation received.');
  //       console.log(data); // Log the chat operation data
  //     });

  //     stream!.on(CONSTANTS.STREAM.VIDEO, async (data: TYPES.VIDEO.EVENT) => {
  //       // console.log("VIDEO STREAM ON!!!")

  //       if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
  //         console.log("REQUEST CALL!!!")
  //         // handle call request
  //         // await aliceVideoCall.approve(recipientAddress);
  //         // const call = await push.value!.user!.video.initialize(setData, {
  //         //   stream: stream, // pass the stream object, refer Stream Video
  //         //   config: {
  //         //     video: false, // to enable video on start, for frontend use
  //         //     audio: true, // to enable audio on start, for frontend use
  //         //   },
  //         //   // media?: MediaStream, // to pass your existing media stream(for backend use)
  //         // });

  //         // const call = await push.value!.user!.video.initialize(setVideoData, {
  //         //   stream: stream, // pass the stream object, refer Stream Video
  //         //   config: {
  //         //     video: false, // to enable video on start, for frontend use
  //         //     audio: true, // to enable audio on start, for frontend use
  //         //   },
  //         //   // media?: MediaStream, // to pass your existing media stream(for backend use)
  //         // });

  //         // setCall(call)
  //         // const peerInfo: VideoPeerInfo = {
  //         //   address: data.peerInfo.address,
  //         //   signal: data.peerInfo.signal,
  //         //   meta: data.peerInfo.meta
  //         // }

  //         // setPeerInfo(peerInfo)

  //         // console.log("ADDRESS: " + data.peerInfo.address + ", META: " + data.peerInfo.meta)

  //         // call.approve(videoPeerInfo)

  //       }
  
  //       if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
  //         // handle call approve
  //         console.log("VIDEO APROVED!!!")
  //         // console.log("DATA: " + JSON.stringify(data))
  //         // console.log("VIDEO DATA APPROVE: " + JSON.stringify(videoData))
  //         // setVideoData(videoData)
  //         // setCallStream(videoData) // removed?
  //         // const peerInfo: VideoPeerInfo = {
  //         //   address: data.peerInfo.address,
  //         //   signal: data.peerInfo.signal,
  //         //   meta: data.peerInfo.meta
  //         // }
  //         // setPeerInfo(peerInfo)
  //         // setVideoStreamData(videoData)
  //       }
  
  //       if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
  //         // handle call denied
  //       }
  
  //       if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
  //         // handle call connected
  //         console.log("VIDEO CONNECTED!!!")
  //         // setCallStream(videoData) //removed?
  //         // console.log("DATA: " + JSON.stringify(data))
  //         // console.log("VIDEO DATA CONNECT: " + JSON.stringify(videoData))

  //         // setVideoStreamData(videoData)
  //       }
  
  //       if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
  //         // handle call disconnected
  //         console.log("VIDEO DISCONNECTED!!!")
  //         const currentVoiceChannel = useServerStore.getState().currentVoiceChannel

  //         const doc = await rxdb.servers!.findOne({
  //           selector: {
  //             id: {
  //               $eq: props.serverId
  //             }
  //           }
  //         }).exec()
  //         // .then((doc: RxDocument) => {
  //         //   doc.update({
  //         //     $set: {
  //         //       'voiceChannel.$[x].peerInfo': '',
  //         //       filter: [{"x.chatId": currentVoiceChannel}]
  //         //     },
  //         //   }).then((newDoc: any) => {
  //         //     console.log("DOC UPDATED")
  //         //   })
  //         // })
  //         doc.update({
  //           $set: {
  //             'voiceChannels.$[x].peerInfo': '',
  //             filter: [{"x.chatId": currentVoiceChannel}]
  //           },
  //         })

  //       }
  //     });


  //     console.log("BEFORE CONST CALL!")
  //     // const call = await push.value!.user!.video.initialize(setVideoData, {
  //     //   stream: stream, // pass the stream object, refer Stream Video
  //     //   config: {
  //     //     video: true, // to enable video on start, for frontend use
  //     //     audio: true, // to enable audio on start, for frontend use
  //     //   },
  //     //   // media?: MediaStream, // to pass your existing media stream(for backend use)
  //     // });

  //     // setCall(call)
      
  //     // Connect the stream:
  //     await stream!.connect(); // Establish the connection after setting up listeners
  //     // Stream disconnection:
  //     // stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  //     //   console.log('Stream Disconnected');
  //     // });
  //     setStream(stream);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // console.log("EVENT: " + event.target.value);
  //   // setServerName(event.target.value)
  // }

  // if(videoData?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.INITIALIZED){
  //   console.log('set call stream 1:::' + JSON.stringify(videoData))
  //   // setCallStream(videoData)
  //   const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
  //   console.log("INCOMING INITIALIZED!!!! " + currentVoiceChannel)
  //   const rules: VideoNotificationRules = {
  //   access: {
  //     type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
  //     data: {
  //       // chatId: currentChatChannel.chatId,
  //       chatId: currentVoiceChannel
  //     },
  //   },
  // }
  //   const meta = {rules: rules}
  //   const peerInfo: VideoPeerInfo = {
  //     address: videoData.meta.initiator.address,
  //     signal: videoData.meta.initiator.signal,
  //     meta: meta
  //   }

  //   // const doc = rxdb.servers!.findOne().where('id').eq(props.serverId).where('voiceChannel').eq('chatId').eq(currentVoiceChannel).exec()
  //   rxdb.servers!.findOne({
  //     selector: {
  //       id: {
  //         $eq: props.serverId
  //       }
  //     }
  //   }).exec().then((doc: RxDocument) => {
  //     doc.update({
  //       $set: {
  //         'voiceChannel.$[x].peerInfo': JSON.stringify(peerInfo),
  //         filter: [{"x.chatId": currentVoiceChannel}]
  //       },
  //     }).then((newDoc: any) => {
  //       console.log("DOC UPDATED")
  //     })
  //   })
  // }
  // // videoData?.incoming[0]?.
  // if(videoData?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
  //   // console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
  //   // const initiator = useCallStore.getState().initiator;
  //   // const users = useCallStore.getState().users;
  //   console.log('set call stream 2')
  //   console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
  //   setCallStream(videoData)
  //   // if(!initiator){
  //   //   // console.log("I DID NOT START CALL::: " + videoData?.incoming)
  //   //   // addUser(videoData?.incoming[0].address)
  //   //   const address = videoData?.local.address
  //   //   if(!users.includes(address)){
  //   //     addUser(address)
  //   //   }
  //   // }
  //   // else{
  //     // addUser(videoData?.incoming[0].address)
  //   // }
  // }
  // if(videoData?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.RECEIVED){
  //   console.log("VIDEO INIT: " + JSON.stringify(videoData))
  //   const users = useCallStore.getState().users;
  //   console.log('set call stream 3')
  //   setCallStream(videoData)
  //   const initiator = useCallStore.getState().initiator;
  //   if(!initiator){
  //     console.log("I DID NOT START CALL::: " + videoData?.incoming[0].address)
  //     const address = videoData?.incoming[0].address
  //     if(!users.includes(address)){
  //       addUser(address)
  //     }
  //   }
    // else{
      // videoData.meta.broadcast?.livepeerInfo
      // console.log("I STARTED CALL: " + JSON.stringify(videoData.meta.broadcast?.livepeerInfo))
      // const currentChatChannel = useServerStore.getState().currentChatChannel
      // const doc = rxdb.servers!.findOne().where('id').eq('').exec();
      // rxdb.servers!.findOne({
      //   selector: {
      //     voiceChannel: {
      //       chatId: {
      //         $eq: currentChatChannel.chatId
      //       }
      //     }
      //   }
      // }).exec().then((doc: RxDocument) => {
      //   console.log("DOC!!!: " + JSON.stringify(doc))
      //   // doc.modify((docData: any) => {
      //   //   // docData.peerInfo = videoData
      //   //   return docData.this;
      //   // })
      // })
    // }
  // }else if(videoData?.local.address){
    // console.log("YOU STARTmED A CALL!")
    // setInitiator(true)
    // setCallStream(videoData)
  // }
  const stream = useServerStore((server) => server.stream)
  console.log('SERVER: ', stream!.uid)

  return (
    <>
      <div className="flex h-full z-50">
        {/* SERVER ID: {props.serverId} */}
        <SideBar serverId={props.serverId} stream={stream!}/>
        <ChatChannel/>
      </div>
    </>
  )
}

function ChatChannel(){
  const currentChatChannel = useServerStore((state) => state.currentChatChannel)
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
          {currentChatChannel.name}
          {currentChatChannel.chatId != '' ? <div className="flex">
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
      {currentChatChannel.chatId != '' && showUsers ? <MembersList key={currentChatChannel.chatId}/> : <div/>}
    </>
  )
}

export function Messages(){
  const messages = useServerStore((state) => state.messages)
  const currentChatChannel = useServerStore((state) => state.currentChatChannel)
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // const reply = useServerStore.getState().reply;
  // const setReply = useServerStore((server) => server.setReply)
  // let messageList = messages.map((message: Msg) => <Message key={message.id} message={message}/>);
  // console.log("MESSAGES: " + JSON.stringify(messages))
  // let messageList = messages.map((message: Message) => <MessageElement key={message.cid != '' ? message.cid : message.id} message={message}/>);
  // let messageList = messages.map((message: Message) => (
  //   <MessageElement key={message.cid || message.id} message={message} />
  // ));

  // const messageList = useMemo(() => 
  //   messages.map((message: Message) => <MessageElement key={message.cid + message.id} message={message}/>), 
  //   [messages]
  // );

  const messageList = useMemo(() => 
    messages.map((message: Message, index: number) => {
      // console.log("MESSAGE INDEX: " + index)
      // console.log("LAST MESSAGE INDEX FROM: " + messages[index-1].from)
      // let lastMessageFrom = ''
      // if(index != 0){
      //   lastMessageFrom = messages[index-1].from
      // }
      // console.log("LAST MESSAGE INDEX: " + messages[index-1].message.content)
      return <MessageElement key={message.cid + message.id} message={message} lastMessage={messages[index-1]}/>
    }), 
    [messages]
  );



  useEffect(() => {
    // const container = containerRef.current;
    if (ref.current != null) {
      const { clientHeight, scrollHeight } = ref.current;
      setHasScrollbar(clientHeight < scrollHeight);
      ref.current.scrollTop = ref.current.scrollHeight;
      console.log("CLIENT HEIGHT: " + clientHeight + ", SCROLL HEIGHT: " + scrollHeight)
      // if(hasScrollbar){
      //   ref.current.scrollTop = ref.current.scrollHeight;
      // }else{
      //   ref.current.scrollTop = ref.current.scrollHeight - 52;
      // }
      // console.log("SETTING SCROLLLLLL!!!!!")
      // ref.current.scrollTop = ref.current.scrollHeight;
      // const { clientHeight, scrollHeight } = ref.current;
      // setHasScrollbar(clientHeight < scrollHeight);
    }

  }, [messages]);


  let marginRight = 'mr-8'
  if(hasScrollbar){
    marginRight = ''
  }

  let marginTop = ''
  if(messageList.length < 5){
    marginTop = 'mt-36'
  }

  return(
    <>
      {hasScrollbar ? <div/> : <div className="flex flex-grow"/>} {/* spacer to push messages to bottom  */}
      <div ref={ref} className={"block overflow-y-auto " + marginRight}>
        <div key={currentChatChannel.chatId} className={"flex flex-col pb-6 pt-4 " + marginTop}>
          {messageList}
        </div>
      </div>
      <div className="h-3 shrink-0"/> 
    </>
  )
}

function Reply(){
  const setReply = useServerStore((server) => server.setReply)
  const reply = useServerStore((server) => server.reply)
  // console.log("REPLY IN REPLY: " + reply.reference)
  
  let showReply = 'invisible'
  if(reply.messageBlip != ''){
    showReply = 'visible'
  }

  let overflow = false
  if(reply.messageBlip.length == 50){
    overflow = true
  }

  return(
    <>
      <div className={"absolute z-50 -top-4 rounded-e-md rounded-tl-md p-1 bg-deep-purple-300 " + showReply}>
        <div className="flex gap-3">
          <div className="flex gap-0">
            <p>Replying to: "{reply.messageBlip}</p>
            {overflow ? <p>...</p> : <p/>}
            <p>"</p>
          </div>
          <button onClick={() => setReply({messageBlip: '', reference: ''})}>
            <img className="hover:bg-red-700 rounded-full" src={close} height={25} width={25}/>
          </button>
        </div>
      </div>
    </>
  )
}

export function ReactionElement(props: {emoji: string, count: number, users: string[], cid: string, userProfiles: any}){
  const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  // const userProfiles = useServerStore((server) => server.userProfiles)
  const addOrRemoveReaction = useServerStore((server) => server.addOrRemoveReaction)

  const [showUsers, setShowUsers] = useState('invisible');

  const buttonStyle = `
    flex flex-row gap-1 bg-deep-purple-300 w-10 h-6 
    rounded-md place-items-center justify-center border 
    border-deep-purple-100 hover:bg-deep-purple-400`

  async function reactionOnClick(){
    addOrRemoveReaction(props.emoji, push.user?.account.toLowerCase()!, props.cid)

    const reaction = await push.user!.chat.send(currentChatChannel.chatId, {
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
  const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  const addOrRemoveReaction = useServerStore((server) => server.addOrRemoveReaction)

  async function sendReaction(){
    // console.log("REACTIONS: " + JSON.stringify(props.reactions) + ", EMOJI: " + props.emoji)
    addOrRemoveReaction(props.emoji, push.user?.account.toLowerCase()!, props.cid)

    const reaction = await push.user!.chat.send(currentChatChannel.chatId, {
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

function SideBar(props: {serverId: string, stream: PushStream}){
  const serverName = useServerStore((server) => server.name)
  const creator = useServerStore((server) => server.creator)
  // const serverId = useServerStore((server) => server.serverId)
  // const serverId = useServerStore((server) => server.serverId)
  // const chatChannels = useServerStore((server) => server.chatChannels)
  // const setChatChannels = useServerStore((server) => server.setChatChannels)
  // const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([])
  // const voiceChannels = useServerStore((server) => server.voiceChannels)
  // const setVoiceChannels = useServerStore((server) => server.setVoiceChannels)
  const [textChannels, setTextChannels] = useState<TextChannel[]>([])
  const [voiceChannels, setVoiceChannels] = useState<VoiceChannel[]>([])
  const [openVideo, setOpenVideo] = useState(false)
  const [showTextChannels, setShowTextChannels] = useState(true)
  const [showVoiceChannels, setShowVoiceChannels] = useState(true)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showInviteUserModal, setShowInviteUserModal] = useState(false)
  const [showServerMenu, setShowServerMenu] = useState(false)
  // const [userProfile, setUserProfile] = useState<any>({})
  const userProfile = useUserStore((user) => user.profile)
  const setUserProfile = useUserStore((user) => user.setProfile)
  const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  const serverTextChannels = useServerStore((server) => server.chatChannels)
  const serverVoiceChannels = useServerStore((server) => server.voiceChannels)
  // const [userProfile]

  let isCreator = false
  if(push.user!.account.toLowerCase() == creator){
    isCreator = true
  }

  useEffect(() => {
    setTextChannels(serverTextChannels)
    setVoiceChannels(serverVoiceChannels)
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
    gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('textChannels').on((textChannels, key) => {
      console.log('Text Channels:', key, textChannels);
      // setServerList([...serverList, server])
      // setServerList((serverList: Array<any>) => [...serverList, server]);
      JSON.parse(textChannels).map((textChannel: TextChannel) => {
        cache.addChannel({
          chatId: textChannel.chatId,
          name: textChannel.name,
          users: [],
          lastReadMessageCid: ""
        })
        setTextChannels(prevTextChannels => {
          // Check if the server is already in the list based on a unique property (e.g., server.id or key)
          const channelExists = prevTextChannels.some(existingChanel => existingChanel.chatId === textChannel.chatId);
      
          // Only add the server if it doesn't already exist in the list
          if (!channelExists) {
            push.user!.chat.group.join(textChannel.chatId)
            return [...prevTextChannels, textChannel];
          }
          
          // If server already exists, return the current list
          return prevTextChannels;
        });
      })
    });

    gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('voiceChannels').on((voiceChannels, key) => {
      console.log('Voice Channels:', key, voiceChannels);
      // setServerList([...serverList, server])
      // setServerList((serverList: Array<any>) => [...serverList, server]);
      JSON.parse(voiceChannels).map((voiceChannel: VoiceChannel) => {
        setVoiceChannels(prevVoiceChannels => {
          // Check if the server is already in the list based on a unique property (e.g., server.id or key)
          const channelExists = prevVoiceChannels.some(existingChanel => existingChanel.chatId === voiceChannel.chatId);
      
          // Only add the server if it doesn't already exist in the list
          if (!channelExists) {
            push.user!.chat.group.join(voiceChannel.chatId)
            return [...prevVoiceChannels, voiceChannel];
          }
          
          // If server already exists, return the current list
          return prevVoiceChannels;
        });
      })
    });
  }, [props.serverId, textChannels, voiceChannels])
  // }, [])

  // const fetchChannels = async () => {
  //   try{
      

  //   }catch(error) {
  //     console.error('Error fetching channels:', error);
  //   }
  // }

  // gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('textChannels').on(function(data, key){
  //   // {property: 'value'}, 'key'
  //   console.log("GUN DATA TC: " + JSON.stringify(data))
  //   console.log("GUN KEY: " + key)

  //   const textChannels: TextChannel[] = JSON.parse(data)
  //   textChannels.map((textChannel) => {
  //     push.user!.chat.group.join(textChannel.chatId)
  //   })
  //   setChatChannels(textChannels)
  // })

  // gun.get('cliqu3-servers-test-db-3').get(props.serverId).get('voiceChannels').on(function(data, key){
  //   // {property: 'value'}, 'key'
  //   console.log("GUN DATA VC: " + JSON.stringify(data))
  //   console.log("GUN KEY: " + key)

  //   const voiceChannels: VoiceChannel[] = JSON.parse(data)
  //   voiceChannels.map((voiceChannel) => {
  //     push.user!.chat.group.join(voiceChannel.chatId)
  //   })
  //   setChatChannels(voiceChannels)
  // })

  // let chatChannelItems = chatChannels.map((channel: {name: string, chatId: string}) => <ChatChannelButton key={channel.chatId} name={channel.name} chatId={channel.chatId}/>);
  let textChannelItems = textChannels.map((channel: {name: string, chatId: string}) => <ChatChannelButton key={channel.chatId} name={channel.name} chatId={channel.chatId}/>);

  let voiceChannelItems = voiceChannels.map((voiceChannel: VoiceChannel) => <VoiceChannelButton key={voiceChannel.chatId} name={voiceChannel.name} chatId={voiceChannel.chatId} stream={props.stream}/>);
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

  const stream = useCallStore((server) => server.stream)

  // needs fix
  async function endCall(){
    const call = useCallStore.getState().call
    const doc =  await rxdb.servers!.findOne({
      selector: {
        id: {
          $eq: props.serverId
        }
      }
    }).exec()

    await doc.update({
      $set: {
        'voiceChannels.$[x].peerInfo': '',
        filter: [{"x.chatId": '54776f362792a36b5099cc2a8ff428432536332b2a12f46b3642eff0cc7ab377'}]
      },
    })

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

  const incomingAudioUsers = stream.incoming.map((peerData: PeerData) => {return peerData.status == VideoCallStatus.CONNECTED ? <AudioPlayer key={peerData.address} stream={peerData.stream} isMuted={false} user={peerData.address}/> : <div/>})
  console.log("THIS USER: " + push.user!.account)

  function SettingsModal(){
    const [displayName, setDisplayName] = useState(userProfile.name)
    const [description, setDescription] = useState(userProfile.desc)
    const [picture, setPicture] = useState(userProfile.picture)
    const [loading, setLoading] = useState(false)

    const handleDisplayNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("EVENT: " + event.target.value);
      setDisplayName(event.target.value)
    }

    const handleDescriptionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("EVENT: " + event.target.value);
      setDescription(event.target.value)
    }

    const handlePictureInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // console.log("EVENT: " + event.target.value);
      setPicture(event.target.value)
    }

    async function updateUserInfo(){
      setLoading(true)
      try{
        if(displayName != userProfile.name){
          const updateResponse = await push.user!.profile.update({name: displayName})
          console.log("UPDATE NAME RESPONSE: " + updateResponse)
        }
        if(description != userProfile.desc){
          const updateResponse = await push.user!.profile.update({desc: description})
          console.log("UPDATE DESC RESPONSE: " + updateResponse)
        }
        if(picture != userProfile.picture){
          const updateResponse = await push.user!.profile.update({picture: picture})
          console.log("UPDATE PIC RESPONSE: " + updateResponse)
        }
      }catch{
        console.log('error updating profile info')
      }
      setUserProfile({name: displayName, desc: description, picture: picture})
      setLoading(false)
    }


    return(
      <>
        <Dialog open={showSettingsModal} onClose={() => {setShowSettingsModal(false)}} className="relative z-50 text-deep-purple-100 select-none">
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel className="flex flex-col w-[calc(60vw)] h-[calc(80vh)] space-y-1 bg-deep-purple-400 p-10 rounded-md">
              <DialogTitle className="flex font-extralight text-5xl justify-center w-full p-5">User Settings</DialogTitle>
              {/* <div className="flex w-full gap-10 place-items-center justify-center"> */}
              <div className="flex flex-col w-full place-items-center justify-center gap-5 pr-20">
                <div className="grid grid-cols-3 grid-flow-row-dense gap-2 w-full">
                  <div className="flex justify-end text-lg font-semibold shrink-0">Display Name</div>
                  <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={displayName} onChange={handleDisplayNameInputChange}/>
                  <div className="flex justify-end text-lg font-semibold shrink-0">Description</div>
                  <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={description} onChange={handleDescriptionInputChange}/>
                  <div className="flex justify-end text-lg font-semibold shrink-0">Image Link</div>
                  <input className="w-full bg-deep-purple-500 p-2 focus:outline-none col-span-2" defaultValue={picture} onChange={handlePictureInputChange}/>
                </div>
                <UserInfoLarge address={push.user!.account} displayName={displayName} description={description} picture={picture}/>
              </div>
              <div className="flex justify-center w-full py-3">
                <button className="flex justify-center place-items-center h-12 w-32 p-1 rounded bg-deep-purple-100 text-deep-purple-400 font-semibold" onClick={updateUserInfo}>
                  {loading ? <img className="animate-spin" src={loader} height={30} width={30}/> : <div>Save Changes</div>}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </>
    )
  }

  function InviteUserModal(){
    const inviteLink = `http://localhost:5173/invite/${props.serverId}`
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

  const userAddress = push.user!.account.toLowerCase()

  function ServerMenu(){
    const menuRef = useRef(null)
    outsideMenuAlerter(menuRef)

    function outsideMenuAlerter(ref: React.MutableRefObject<any>) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: MouseEvent) {
          if (!ref.current.contains(event.target)) {
            setShowServerMenu(false)
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

  return(
    <>
      {/* <div key={props.serverId} className="w-56 bg-off-black-600 border-r-2 border-deep-purple-300 shrink-0"> */}
      <div key={props.serverId} className="w-56 bg-off-black-600 border-r-1 border-off-black-400 shrink-0">
        {/* <div className="flex h-14 border-b-2 border-deep-purple-300 place-items-center pl-2"> */}
        <div className="relative">
          <button className="flex justify-between w-full h-14 z-10 border-b border-off-black-700 place-items-center px-2 shadow-md shadow-off-black-700 text-xl font-light" onClick={() => setShowServerMenu(!showServerMenu)}>
            {serverName}
            <img src={carrot} width={35} height={35} />
          </button>
          <ServerMenu/>
          <InviteUserModal/>
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto py-5">
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
            // <div>{chatChannelItems}</div> : <ChatChannelButton name={currentChatChannel.name} chatId={currentChatChannel.chatId}/>
            <div>{textChannelItems}</div> : <ChatChannelButton name={currentChatChannel.name} chatId={currentChatChannel.chatId}/>
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
          {stream.meta.initiator.address != null ? <AudioPlayer stream={stream.local.stream} isMuted={false} user={stream.local.address}/> : <div/>}
          {incomingAudioUsers}
          {/* <VideoModal/> */}
          {/* <button onClick={() => setOpenVideo(true)}> open video </button> */}
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

function VoiceChannelButton(props: {name: string, chatId: string, stream: PushStream}){
  // state to handle current video call data
  // const [users, setUsers] = useState<Array<any>>()
  // const [data, setData] = useState(CONSTANTS.VIDEO.INITIAL_DATA);
  const currentChatChannel = useServerStore((state) => state.currentChatChannel)
  const serverId = useServerStore((state) => state.serverId)
  // const videoStreamData = useServerStore((state) => state.videoStreamData)
  // const stream = useCallStore((call) => call.stream)
  // const initiator = useCallStore((call) => call.initiator)
  const users = useCallStore((call) => call.users)
  const addUser = useCallStore((call) => call.addUser)
  const setInitiator = useCallStore((call) => call.setInitiator)
  const setCurrentVoiceChannel = useServerStore((server) => server.setCurrentVoiceChannel)
  const stream = useCallStore((call) => call.stream)
  const setCall = useCallStore((call) => call.setCall)
  const setStream = useCallStore((call) => call.setStream)
  const [videoData, setVideoData] = useState<TYPES.VIDEO.DATA>(CONSTANTS.VIDEO.INITIAL_DATA);
  
    videoData?.incoming.map((peerData: PeerData) => {
      if(peerData.status === CONSTANTS.VIDEO.STATUS.INITIALIZED){
        // console.log('set call stream 1:::' + JSON.stringify(videoData))
        const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
        console.log("INCOMING INITIALIZED!!!! " + currentVoiceChannel)
        const rules: VideoNotificationRules = {
        access: {
          type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
          data: {
            chatId: currentVoiceChannel
          },
        },
      }
        const meta = {rules: rules}
        const peerInfo: VideoPeerInfo = {
          address: videoData.meta.initiator.address,
          signal: videoData.meta.initiator.signal,
          meta: meta
        }

        gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').on((voiceChannels, key) => {
          console.log('Voice Channels:', key, voiceChannels);
          // setServerList([...serverList, server])
          // setServerList((serverList: Array<any>) => [...serverList, server]);
          JSON.parse(voiceChannels).map((voiceChannel: VoiceChannel) => {
            if(voiceChannel.chatId == props.chatId){
              // console.log("FOUND INFO " + voiceChannel.peerInfo)
              console.log("UPDATE PEER INFO")
              updatePeerInfo(serverId, currentVoiceChannel, JSON.stringify(peerInfo))
            }
          });
        })
    
        // const doc = rxdb.servers!.findOne().where('id').eq(props.serverId).where('voiceChannel').eq('chatId').eq(currentVoiceChannel).exec()
        // rxdb.servers!.findOne({
        //   selector: {
        //     id: {
        //       $eq: serverId
        //     }
        //   }
        // }).exec().then((doc: RxDocument) => {
        //   doc.update({
        //     $set: {
        //       'voiceChannels.$[x].peerInfo': JSON.stringify(peerInfo),
        //       filter: [{"x.chatId": currentVoiceChannel}]
        //     },
        //   }).then((newDoc: any) => {
        //     console.log("DOC UPDATED")
        //   })
        // })
      }

      if(peerData.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
          console.log('set call stream 2')
          console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
          setStream(videoData)
      }
    })
  // if(videoData?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.CONNECTED){
  //   console.log('set call stream 2')
  //   console.log("VIDEO DATA CONNECTED: " + JSON.stringify(videoData))
  //   setStream(videoData)
  // }

  async function joinCall(){
    setCurrentVoiceChannel(props.chatId)
    // const addToGroup = await push.user!.chat.group.add('006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766', {
    //   role: 'MEMBER', // 'ADMIN' or 'MEMBER'
    //   accounts: ['0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'],
    // });
    // const join = await push.user!.chat.group.
    // console.log('ADD TO GROUP: ' + JSON.stringify(join))
    // await push.user!.chat.group.join('54776f362792a36b5099cc2a8ff428432536332b2a12f46b3642eff0cc7ab377')
    // await push.user!.chat.group.info('006d8396c569e64aeab44b42c5ad4c53109b3a1068587f5c10fa5ffd38547766')
    const callInit = await push.user!.video.initialize(setVideoData, {
      stream: props.stream, // pass the stream object, refer Stream Video
      config: {
        // video: true, // to enable video on start, for frontend use
        audio: true, // to enable audio on start, for frontend use
      },
      // media?: MediaStream, // to pass your existing media stream(for backend use)
    });

    setCall(callInit)
    let peerInfo = ''
    // const doc =  await rxdb.servers!.findOne({
    //   selector: {
    //     id: {
    //       $eq: serverId
    //     }
    //   }
    // }).exec()

    gun.get('cliqu3-servers-test-db-3').get(serverId).get('voiceChannels').on((voiceChannels, key) => {
      console.log('Voice Channels:', key, voiceChannels);
      // setServerList([...serverList, server])
      // setServerList((serverList: Array<any>) => [...serverList, server]);
      JSON.parse(voiceChannels).map((voiceChannel: VoiceChannel) => {
        if(voiceChannel.chatId == props.chatId){
          // console.log("FOUND INFO " + voiceChannel.peerInfo)
          console.log("FOUND PEER INFO")
          peerInfo = voiceChannel.peerInfo
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
    const call = useCallStore.getState().call
    const currentVoiceChannel = useServerStore.getState().currentVoiceChannel
    // const stream = useCallStore.getState().stream
    if(peerInfo == ''){
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

      console.log("CALL CONFIG: " + call!.config)

      // push.user!.chat.send('0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', {
      //   type: 'Text',
      //   content: 'Hello Test!',
      // });
      // VIDEO_NOTIFICATION_ACCESS_TYPE
      
      console.log("CURRENT VOICE CHANNEL: " + currentVoiceChannel)
      const rules: VideoNotificationRules = {
        access: {
          type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
          data: {
            // chatId: currentChatChannel.chatId,
            // chatId: 'c77b6723d5b72ed3238b957d826b3f8a2f86440027aa88e977e7243ea1b624ed'
            chatId: currentVoiceChannel
          },
        },
      }

      // const signer = ethers.Wallet.fromMnemonic("stadium chase abuse leg monitor uncle pledge category flip luxury antenna extra", "m/44'/60'/0'/0/0")
      // console.log("init user: " + JSON.stringify(signer.mnemonic))
      // const otherUser = await PushAPI.initialize(signer, {
      //   env: CONSTANTS.ENV.DEV,
      // });

      console.log('OTHER USER: 0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465')

      await call!.request(['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0xF06863EaD6A1c82Eb976E2b8E5754a5e15b3C46D'], {rules});

      // await call.request(['0xDEC4399dDb5655237Ee0cCBEe1B79273FDD3B465', '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666'], {rules: {VideoNotificationRules.access: {data: {chatId: currentChatChannel.chatId }}}});
      // console.log("CALL : " + call!.config)
      setInitiator(true)
      // console.log("LOCAL ADDRES:::: " + JSON.stringify(stream))
      addUser(push.user!.account)
      // await call.approve();
      
      // await call.approve(push.user!.account);
    }else{
      console.log("JOINING CALL!")
      // call!.approve(peerInfo!)
      const info = JSON.parse(peerInfo)
      const videoPeerInfo: VideoPeerInfo = {
        address: info.address,
        signal: info.signal,
        meta: info.meta
      }
      // console.log("INFO: " + info)
      // console.log("STRING INFO:: " + JSON.stringify(videoPeerInfo))
      call!.approve(videoPeerInfo)
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
        <button className="flex w-full h-8 place-items-center p-1 hover:bg-deep-purple-300 rounded" onClick={ async () => joinCall()}>
          <div className="flex flex-row gap-2 overflow-hidden place-items-center">
            <img src={volume} height={20} width={20}/>
            <p className="truncate">{props.name}</p>
          </div>
        </button>
      </div>
      {/* <div>{usersInCall}</div> */}
      {/* <UsersInCall/> */}
    </>
  )
}

function UsersInCall(){
  const users = useCallStore((call) => call.users)
  console.log("USERS IN CALL: " + JSON.stringify(users))
  const usersInCall = users.map((user: string) => {return <div>{user}</div>})
  return(
    <>
      {usersInCall}
    </>
  )
}

function ChatChannelButton(props: {name: string, chatId: string}){
  // const currentMessages = useServerStore((server) => server.messages)
  const currentChatChannel = useServerStore((server) => server.currentChatChannel)
  const setMessages = useServerStore((server) => server.setMessages)
  const setCurrentChatChannel = useServerStore((server) => server.setCurrentChatChannel)
  const setUsers = useServerStore((server) => server.setUsers)
  const setUserProfiles = useServerStore((server) => server.setUserProfiles)
  const clearMessages = useServerStore((server) => server.clearMessages)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if(props.chatId == currentChatChannel.chatId){
      setActive(true)
    }else{
      setActive(false)
    }
  }, [props.chatId, currentChatChannel.chatId]);

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
  //           "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
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
  //           "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
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
  //         "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
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
    // let messages: Msg[] = []
    let reference: string = ''
    let success = false
    let lastRef: string = ''
    while(true){
      // [messages, reference] = await fetchHistory(chatId, reference)
      // console.log("Fetching New Messages!!")
      // [success, reference] = await newFetchHistory(chatId, reference)
      [success, reference] = await newFetchHistory(chatId, reference);
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
        lastRef = reference
      }
      // const currentChatChannel = useServerStore.getState().currentChatChannel
      // if channel gets changed while loading messages
      // if(chatId == currentChatChannel.chatId || currentChatChannel.chatId == ''){
        // setMessages(messages)
      // }
      if(count > 20){
        break
      }else{
        count += 1
      }
    }
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
    if(currentChatChannel.chatId != props.chatId){
      console.log("changing channel!")
      clearMessages()
      setCurrentChatChannel({name: props.name, chatId: props.chatId})
      // const channels: Map<string, any> = await cache.channels!.findOne().where('chatId').eq(props.chatId).exec()
      // console.log("CHANNELS : " + JSON.stringify(channels))
      // setMessages(channels.get('messages'))
      cache.fetchRecentMessages(props.chatId).then((messages: Message[])=> {
        setMessages(messages)
      })
      console.log("getting new messages!!!!!")
      await getNewMessages(props.chatId)
    }
  }
  let buttonStyle = 'flex w-full h-8 place-items-center p-0.5 mb-0.5 hover:bg-deep-purple-300 rounded'
  if(active){
    buttonStyle = 'flex w-full h-8 place-items-center p-0.5 mb-0.5 hover:bg-deep-purple-400 bg-deep-purple-300 rounded'
  }

  return(
    <>
      <div className="w-full overflow-y-auto px-2">
        <button className={buttonStyle} onClick={changeChannel}>
          <div className="flex flex-row gap-2 overflow-hidden place-items-center">
            <img src={hashtag} height={20} width={20}/>
            <p className="truncate">{props.name}</p>
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
  const currentChatChannel = useServerStore((state) => state.currentChatChannel)
  const setReply = useServerStore((server) => server.setReply)
  const setFiles = useServerStore((server) => server.setFiles)
  const appendFile = useServerStore((server) => server.appendFile)
  const files = useServerStore((server) => server.files)
  const appendMessage = useServerStore((state) => state.appendMessage)
  const addReferenceId = useServerStore((server) => server.addReferenceId)
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
          //   "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
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
          const msg: Message = {
            id: randomId, 
            origin: "self", 
            timestamp: Date.now(),
            chatId: currentChatChannel.chatId, 
            from: from.toLowerCase(),
            message: { type: "File", content: `{"content":"data:${file.type};base64,${file.base64}, "name":${file.name}}`}, 
            group: true,
            cid: "",
            reactions: {},
            reply: null
          }
          appendMessage(msg)

          const fileReponse = await push.user!.chat.send(currentChatChannel.chatId, {
            type: 'File',
            // content: `{"content":"data:${file.type};base64,${file.base64}", "name":${file.name}}`,

            // old one works below but need to update for better code to convert content into json obj
            content: `{"content":"data:${file.type};base64,${file.base64}, "name":${file.name}}`,
          });
          // console.log("FILE RESPONSE: " + JSON.stringify(fileReponse))
        })
        setFiles([])
      }
    }else{
      if(reply.messageBlip != '' && reply.reference != ''){
        console.log("SENDING A REPLY::: of this message: " + reply.messageBlip)

        const message: Message = {
          id: randomId,
          chatId: currentChatChannel.chatId,
          origin: "self",
          timestamp: Date.now(),
          from: push.user?.account.toLowerCase()!,
          // type: 'Text',
          message: { type: 'Reply', content: { type: 'Text', content: input }, reference: reply.reference },
          group: false,
          cid: "",
          // readCount: 0,
          // lastAccessed: 0,
          reply: { messageBlip: reply.messageBlip, reference: reply.reference },
          reactions: {}
        }


        // appendMessage(msg)
        appendMessage(message)
        // cache.appendMessage(currentChatChannel.chatId, message)
        // setMessages
        setInput('')
        setReply({messageBlip: '', reference: ''})
        if(textareaRef.current != null){
          textareaRef.current.focus()
          textareaRef.current.style.height = 'auto';  // Reset height to auto
        }

        const replyResponse = await push.user!.chat.send(currentChatChannel.chatId, {
          type: 'Reply',
          content: {
            type: 'Text', content: input
          },
          reference: reply.reference
        })

        addReferenceId(randomId, replyResponse.cid)
        // cache.addCid(currentChatChannel.chatId, randomId, replyResponse.cid)
      }else{
        // console.log("SENDING FROM SELF::: ")
        console.log("SENDING A normal msgggg: " + input)
        const randomId = uuidv4();
        // const msg: Msg = {
        //   "id": randomId, "origin": "self", "timestamp": Date.now(),
        //   "chatId": currentChatChannel.chatId, "from": from.toLowerCase(),
        //   "message": { "type": "Text", "content": message }, "meta": { "group": true }, "messageContent": message,
        //   "cid": "",
        //   reactions: [{
        //     emoji: '', count: 0,
        //     users: []
        //   }],
        //   reply: null
        // }

        const message: Message = {
          chatId: currentChatChannel.chatId,
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
        // cache.appendMessage(currentChatChannel.chatId, message)
        setInput('')
        if(textareaRef.current != null){
          textareaRef.current.focus()
          textareaRef.current.style.height = 'auto';  // Reset height to auto
        }

        const cid = await push.sendMessage(input, currentChatChannel.chatId);
        addReferenceId(randomId, cid!)
        // cache.addCid(currentChatChannel.chatId, randomId, cid!)
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
          let u8s = new Uint8Array(filesContent[count].content)
          const base64string = Base64.fromUint8Array(u8s);
          // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(filesContent[count].content)));
          console.log("CONTENT: " + filesContent[count].content)
          console.log("CONTENT TYPE: " + typeof(filesContent[count].content))
          // console.log('BASE 64 STRING:::' + base64String)
          filesContent[count]['base64'] = base64string
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
  let emojiElements = emojiList.map((emoji: string) => <button className="hover:bg-deep-purple-400 rounded-md" onClick={()=> addEmoji(emoji)}>{emoji}</button>)


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
            <textarea rows={1} ref={textareaRef} onKeyDown={handleKeyDown} className="z-0 w-full min-h-14 bg-off-black-600 rounded-lg px-2 py-4 focus:outline-none pr-56 resize-none" placeholder={`Send message to #${currentChatChannel.name}`} value={input} onChange={handleInputChange} autoFocus={true} onPaste={onPaste}/>
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
  const appendChatChannel = useServerStore((state) => state.appendChatChannel)
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
            appendChatChannel({name: channelName, chatId: newChatId})
          }else{
            appendVoiceChannel({name: channelName, chatId: newChatId, peerInfo: ''})
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
        <audio ref={audioRef} muted={props.isMuted} autoPlay/>
        <div className="pl-10">{props.user.substring(0, 10)}</div>
      </div>
    </>
  )
}