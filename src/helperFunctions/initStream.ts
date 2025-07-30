// import { useState } from "react"
// import { useCallStore, useServerStore } from "../state-management/store"
// import { push } from "../App"
// import { CONSTANTS, TYPES } from "@pushprotocol/restapi/src"
// // import { Message } from "../cache"
// import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream"
// import { v4 as uuidv4 } from 'uuid';
// import { Message } from "../types/messageTypes"
// import { cache2 } from "../dexie"

// export async function initStream(): Promise<PushStream | undefined> {
//   try {
//     console.log("INITIALIZING STREAM")
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
//           channels: ['*'],
//           chats: ['*'],
//         },
//         connection: {
//           retries: 3, // Retry connection 3 times if it fails
//         },
//         raw: false, // Receive events in structured format
//       }
//     );

//     stream!.on(CONSTANTS.STREAM.CONNECT, () => {
//       console.log('Stream Connected: ' + push.user!.account);
//     });
    
//     // Chat message received:
//     stream!.on(CONSTANTS.STREAM.CHAT, (pushMsg: any) => {
//       const appendMessage = useServerStore.getState().appendMessage;
//       const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
//       console.log("STREAM GOT NEW MESSAGE!!! ", stream?.uid)

//       //   // cache.updateLastReadMessageCid(pushMsg.chatId, pushMsg.reference)
//       //   cache2.updateLastReadMessageCid(pushMsg.chatId, pushMsg.cid);
//       // }

//       const randomId = uuidv4();
//       let from = pushMsg.from.split(':')[1].toLowerCase();

//       console.log("from: 1 " + from)

//       if(from == undefined){
//         from = pushMsg.from.toLowerCase();
//       }

//       console.log("from: 2 " + from)

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
//         console.log('CURRENT CHAT ID: ' + pushMsg.chatId + " push chat Id: " + pushMsg.chatId)

//         // Only append if the message is not from signed in user and to current text channel id
//         if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentChatChannel.chatId == pushMsg.chatId){
//           console.log("APPENDING MESSAGE 1")
//           appendMessage(message);
//         }
//         // cache.appendMessage(message).then((result: boolean) => {
//         //   if(result){
//         //     console.log("No error in cache!")
//         //   }else{
//         //     console.log("Message DUP!")
//         //   }
//         // }).catch(() => {
//         //   console.log("ERROR IN CACHE!")
//         // })
//         cache2.addMessage(message)
//       }

//       if(pushMsg.message.type == 'Reaction'){
//         if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
//           // addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference)
//           console.log("ADD OR REMOVE REACTION CID: ", pushMsg.cid)
//           addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference)
//           // addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference, pushMsg.cid)
//         }
//         cache2.updateReactions(pushMsg.message.content, from, pushMsg.message.reference)
//       }
      
//       if(pushMsg.message.type == 'Reply'){
//         console.log("GOT A REPLY!", pushMsg.message)
//         push.user!.chat.history(pushMsg.chatId, {reference: pushMsg.message.reference, limit: 1}).then((foundMessage: any) => {
//           console.log("FIND ELEMENT IN REPLY: " + JSON.stringify(foundMessage))
//           const message: Message = {
//             id: randomId,
//             chatId: pushMsg.chatId,
//             origin: pushMsg.origin,
//             timestamp: pushMsg.timestamp,
//             from: from,
//             // message: { type: pushMsg.message.type, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.conten}, reference: pushMsg.message.reference },
//             message: {
//               type: pushMsg.message.type,
//               content: {
//                 type: pushMsg.message.content.messageObj.messageType, 
//                 content: pushMsg.message.content.messageObj.content
//               },
//               reference: pushMsg.message.reference 
//             },
//             group: pushMsg.meta.group,
//             cid: pushMsg.reference,
//             reply: { 
//               messageBlip: foundMessage[0]!.messageObj.content.substring(0, 75), 
//               reference: pushMsg.message.reference 
//             },
//             reactions: {}
//           }
//           console.log("REPLY MESSAGE RECEIVED: ", message)
//           console.log('CURRENT CHAT ID: ' + currentChatChannel.chatId + " push chat Id: " + pushMsg.chatId)

//           // Only append if the message is not from signed in user and to current text channel id
//           if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentChatChannel.chatId == pushMsg.chatId){
//             console.log("APPENDING MESSAGE 2")
//             appendMessage(message)
//           }
//           // cache.appendMessage(message)
//           cache2.addMessage(message)
//         })
//       }
//       // console.log("PUSH MSG CID FROM STREAM: ", pushMsg.cid)
//       console.log("PUSH MSG FROM STREAM: ", pushMsg)
//       cache2.updateLastReadMessageCid(pushMsg.chatId, pushMsg.reference);
      
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
//         // const currentVoiceChannel = useServerStore.getState().currentVoiceChannel

//         // const doc = await rxdb.servers!.findOne({
//         //   selector: {
//         //     id: {
//         //       $eq: serverId
//         //     }
//         //   }
//         // }).exec()
//         // doc.update({
//         //   $set: {
//         //     'voiceChannels.$[x].peerInfo': '',
//         //     filter: [{"x.chatId": currentVoiceChannel}]
//         //   },
//         // })

//       }
//     });

//     // console.log("BEFORE CONST CALL!")
//     // await stream!.connect(); // Establish the connection after setting up listeners
//     // console.log("STREAM CONNECT: " + stream?.uid)
//     // setStream(stream);
//     // setStream(stream)
//     return stream
//   } catch (error) {
//     console.error('Error on Stream Init:', error);
//     return undefined
//     // return stream
//   }
// }
import { useCallStore, useServerStore } from "../state-management/store"
import { push } from "../App"
import { CONSTANTS, TYPES } from "@pushprotocol/restapi/src"
// import { Message } from "../cache"
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream"
import { v4 as uuidv4 } from 'uuid';
import { Content, Message, ReferenceContent, Reply } from "../types/messageTypes"
import { cache2 } from "../dexie"
import { TextChannel } from "../types/serverTypes";
import { useGlobalStore } from "../state-management/globalStore";
import { useDirectMessageStore } from "../state-management/dmStore";

export async function initStream(): Promise<PushStream | undefined> {
  try {
    console.log("INITIALIZING STREAM")
    const stream = await push.user?.initStream(
      [
        CONSTANTS.STREAM.CHAT, // Listen for chat messages
        // CONSTANTS.STREAM.NOTIF, // Listen for notifications
        CONSTANTS.STREAM.CONNECT, // Listen for connection events
        CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
        CONSTANTS.STREAM.VIDEO // CALLS
      ],
      {
        // Filter options:
        filter: {
          channels: ['*'],
          chats: ['*'],
        },
        connection: {
          retries: 3, // Retry connection 3 times if it fails
        },
        raw: false, // Receive events in structured format
      }
    );

    stream!.on(CONSTANTS.STREAM.CONNECT, () => {
      console.log('Stream Connected: ' + push.user!.account);
    });
    
    stream!.on(CONSTANTS.STREAM.CHAT, async (pushMsg: any) => {
      const appendMessage = useServerStore.getState().appendMessage;
      const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
      const currentScreen = useGlobalStore.getState().currentScreen;
      const currentDM = useDirectMessageStore.getState().currentDM;
      const currentTextChannel = useServerStore.getState().currentTextChannel;
      const textChannel = useServerStore.getState().textChannels;
      const setTextChannels = useServerStore.getState().setTextChannels;
      console.log("STREAM GOT NEW MESSAGE!!! ", stream?.uid)

      const randomId = uuidv4();
      let from = pushMsg.from.split(':')[1].toLowerCase();

      console.log("from: 1 " + from)
      if(from == undefined){
        from = pushMsg.from.toLowerCase();
      }
      console.log("from: 2 " + from)

      if(pushMsg.message.type == 'Reaction'){
        if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
          addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference)
        }
        console.log("ADD OR REMOVE REACTION: ", pushMsg.message)
        // update message in cache with reaction
        cache2.updateReactions(pushMsg.message.content, from, pushMsg.message.reference)
      }else{
        console.log("NOT REACTION")
        let content: Content | ReferenceContent = pushMsg.message
        let reply: Reply | null = null
        if(pushMsg.message.type == 'Reply'){
          console.log("GOT A REPLY!", pushMsg.message)
          const foundMessage = await push.user!.chat.history(pushMsg.chatId, {reference: pushMsg.message.reference, limit: 1})
          console.log("FIND ELEMENT IN REPLY: ", foundMessage)
          content = {
            type: pushMsg.message.type,
            content: {
              // type: pushMsg.message.content.messageObj.messageType,
              type: pushMsg.message.content.messageType,
              content: pushMsg.message.content.messageObj.content
            },
            reference: pushMsg.message.reference
          }

          const from: string = foundMessage[0]!.fromDID.replace('eip155:', '')
          console.log("REPLY FROM: ", from)

          let replyContent = foundMessage[0]!.messageObj.content
          if(typeof replyContent !== "string"){
            replyContent = foundMessage[0]!.messageObj.content.messageObj.content
          }

          console.log("message content: ", replyContent)

          reply = {
            from: from.toLowerCase(),
            message: replyContent,
            reference: pushMsg.message.reference 
          }
        }else{
          console.log("THIS MESSAGE IS NOT REACTION OR REPLY")
        }

        const message: Message = {
          id: randomId,
          chatId: pushMsg.chatId,
          origin: pushMsg.origin,
          timestamp: Number(pushMsg.timestamp),
          from: from,
          message: content,
          group: pushMsg.meta.group,
          cid: pushMsg.reference,
          reply: reply,
          reactions: {}
        }
        
        // Append to state if user is not the sender and user is in received message channel
        let chatId = currentTextChannel.chatId
        if(currentScreen == 'DirectMessages'){
          chatId = currentDM!
        }
        // if(currentScreen == 'Server'){
        //   if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentChatChannel.chatId == pushMsg.chatId){
        //     console.log("APPENDING MESSAGE")
        //     appendMessage(message)
        //   }
        // }else if(currentScreen == 'DirectMessages'){
        //   chatId = currentDM
        //   if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentDM == pushMsg.chatId){
        //     console.log("APPENDING DM")
        //     appendMessage(message)
        //   }
        // }

        if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && chatId == pushMsg.chatId){
          console.log("APPENDING MESSAGE")
          appendMessage(message)
        }

        // Use add message to cache if not Reaction, seperate function for reaction
        console.log("BEFORE MESSAGE ADD")
        cache2.addMessage(message)
        console.log("AFTER MESSAGE ADD")
        let tempTextChannels: TextChannel[] = []
        console.log("MESSAGE ID: ", message.chatId)
        console.log("CURRENT: ", chatId)
        if(message.chatId != chatId){
          console.log("Starting FOR EACH!!")
          textChannel.map((textChannel: TextChannel) => {
            if(textChannel.chatId == message.chatId){
              console.log("NEW NOTIFICATION!!!!")
              tempTextChannels.push({ name: textChannel.name, chatId: textChannel.chatId, unread: true})
            }else{
              tempTextChannels.push(textChannel)
            }
          })
          console.log("Setting Chat Channels!!!!")
          setTextChannels(tempTextChannels)
        }
      }
      // Update the lastReadMessageCid to sync for fetch
      // CHECK THIS FOR MIDDLE MESSAGE ERRORS, if user doesnt open channel and fetch 
      // from history will middle messages get lost if stream updates last read message cid? Yes... big issue :(((
      cache2.updateLastReadMessageCid(pushMsg.chatId, pushMsg.reference);
    });
    
    
    // Chat operation received:
    stream!.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
      console.log('Chat operation received.');
      console.log(data); // Log the chat operation data
    });

    stream!.on(CONSTANTS.STREAM.VIDEO, async (data: TYPES.VIDEO.EVENT) => {
      // console.log("VIDEO STREAM ON!!!")
      console.log("VIDEO EVENT IS OCCURING!")

      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        console.log("REQUEST CALL!!!")
        console.log("DATA: ", data)
        // let incomingCallerAddress = data.peerInfo.address;
        // console.log("INCOMING USER: ", incomingCallerAddress)

        // users
        // handle call request
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.RETRY_APPROVE) {
        console.log("RETRY APPROVE!!!")

      }

      if (data.event === CONSTANTS.VIDEO.EVENT.RETRY_REQUEST) {
        console.log("RETRY REQUEST!!!")
        console.log("DATA REQUEST: ", data)
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
        // handle call approve
        console.log("VIDEO APROVED!!!")
        
        console.log("DATA APPROVE: ", data)
        // console.log("VIDEO DATA APPROVE: " + JSON.stringify(videoData))
        // setVideoData(videoData)
        // setCallStream(videoData) // removed?
        // const peerInfo: VideoPeerInfo = {
        //   address: data.peerInfo.address,
        //   signal: data.peerInfo.signal,
        //   meta: data.peerInfo.meta
        // }
        // setPeerInfo(peerInfo)
        // setVideoStreamData(videoData)
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
        // handle call denied
        console.log("CALL DENIED!!!")
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
        // handle call connected
        console.log("VIDEO CONNECTED!!!")
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
        // handle call disconnected
        console.log("VIDEO DISCONNECTED!!!")
      }
    });
    // await stream!.connect();
    return stream
  } catch (error) {
    console.error('Error on Stream Init:', error);
    return undefined
  }
}
