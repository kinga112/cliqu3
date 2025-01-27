import { useState } from "react"
import { useCallStore, useServerStore } from "../state-management/store"
import { cache, push, rxdb } from "../App"
import { CONSTANTS, TYPES } from "@pushprotocol/restapi/src"
import { Message } from "../cache"
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream"
import { v4 as uuidv4 } from 'uuid';

export async function initStream(): Promise<PushStream | undefined> {
  const appendMessage = useServerStore.getState().appendMessage;
  const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
  const currentChatChannel = useServerStore.getState().currentChatChannel;

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
    
    // Chat message received:
    stream!.on(CONSTANTS.STREAM.CHAT, (pushMsg: any) => {
      console.log("STREAM GOT NEW MESSAGE!!! ", stream?.uid)

      if(pushMsg.chatId == currentChatChannel.chatId){
        cache.updateLastReadMessageCid(pushMsg.chatId, pushMsg.reference)
      }

      const randomId = uuidv4();
      let from = pushMsg.from.split(':')[1].toLowerCase()

      console.log("from: 1 " + from)

      if(from == undefined){
        from = pushMsg.from.toLowerCase()
      }

      console.log("from: 2 " + from)

      if(pushMsg.message.type != 'Reaction' && pushMsg.message.type != 'Reply'){
        console.log("THIS MESSAGE IS NOT REACTION OR FILE OR REPLY")
        const message: Message = {
          id: randomId,
          chatId: pushMsg.chatId,
          origin: pushMsg.origin,
          timestamp: pushMsg.timestamp,
          from: from,
          message: pushMsg.message,
          group: pushMsg.meta.group,
          cid: pushMsg.reference,
          // readCount: 0,
          // lastAccessed: 0,
          reply: null,
          reactions: {}
        }
        console.log('CURRENT CHAT ID: ' + currentChatChannel.chatId + " push chat Id: " + pushMsg.chatId)

        // Only append if the message is not from signed in user and to current text channel id
        if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentChatChannel.chatId == pushMsg.chatId){
          console.log("APPENDING MESSAGE 1")
          appendMessage(message)
        }
        cache.appendMessage(message).then((result: boolean) => {
          if(result){
            console.log("NO ERROR IN CACHE!")
          }else{
            console.log("Message DUP!")
          }
        }).catch(() => {
          console.log("ERROR IN CACHE!")
        })
      }

      if(pushMsg.message.type == 'Reaction'){
        if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase())){
          addOrRemoveReaction(pushMsg.message.content, from, pushMsg.message.reference)
        }
        cache.updateReactions(pushMsg.message.content, from, pushMsg.message.reference)
      }
      
      if(pushMsg.message.type == 'Reply'){
        console.log("GOT A REPLY!", pushMsg.message)
        push.user!.chat.history(pushMsg.chatId, {reference: pushMsg.message.reference, limit: 1}).then((foundMessage: any) => {
          console.log("FIND ELEMENT IN REPLY: " + JSON.stringify(foundMessage))
          const message: Message = {
            id: randomId,
            chatId: pushMsg.chatId,
            origin: pushMsg.origin,
            timestamp: pushMsg.timestamp,
            from: from,
            // message: { type: pushMsg.message.type, content: {type: pushMsg.message.content.type, content: pushMsg.message.content.conten}, reference: pushMsg.message.reference },
            message: { 
              type: pushMsg.messageType, 
              content: { 
                type: pushMsg.message.content.messageType, 
                content: pushMsg.message.content.messageObj.content 
              }, 
              reference: pushMsg.message.reference 
            },
            group: pushMsg.meta.group,
            cid: pushMsg.cid,
            reply: { 
              messageBlip: foundMessage[0]!.messageObj.content.substring(0, 75), 
              reference: pushMsg.message.reference 
            },
            reactions: {}
          }
          console.log("REPLY MESSAGE RECEIVED: ", message)
          console.log('CURRENT CHAT ID: ' + currentChatChannel.chatId + " push chat Id: " + pushMsg.chatId)

          // Only append if the message is not from signed in user and to current text channel id
          if(pushMsg.origin != 'self' && !pushMsg.from.includes(push.user!.account.toLowerCase()) && currentChatChannel.chatId == pushMsg.chatId){
            console.log("APPENDING MESSAGE 2")
            appendMessage(message)
          }
          cache.appendMessage(message)
        })
      }
      
    });
    
    
    // Chat operation received:
    stream!.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
      console.log('Chat operation received.');
      console.log(data); // Log the chat operation data
    });

    stream!.on(CONSTANTS.STREAM.VIDEO, async (data: TYPES.VIDEO.EVENT) => {
      // console.log("VIDEO STREAM ON!!!")

      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        console.log("REQUEST CALL!!!")
        // handle call request
        // await aliceVideoCall.approve(recipientAddress);
        // const call = await push.value!.user!.video.initialize(setData, {
        //   stream: stream, // pass the stream object, refer Stream Video
        //   config: {
        //     video: false, // to enable video on start, for frontend use
        //     audio: true, // to enable audio on start, for frontend use
        //   },
        //   // media?: MediaStream, // to pass your existing media stream(for backend use)
        // });

        // const call = await push.value!.user!.video.initialize(setVideoData, {
        //   stream: stream, // pass the stream object, refer Stream Video
        //   config: {
        //     video: false, // to enable video on start, for frontend use
        //     audio: true, // to enable audio on start, for frontend use
        //   },
        //   // media?: MediaStream, // to pass your existing media stream(for backend use)
        // });

        // setCall(call)
        // const peerInfo: VideoPeerInfo = {
        //   address: data.peerInfo.address,
        //   signal: data.peerInfo.signal,
        //   meta: data.peerInfo.meta
        // }

        // setPeerInfo(peerInfo)

        // console.log("ADDRESS: " + data.peerInfo.address + ", META: " + data.peerInfo.meta)

        // call.approve(videoPeerInfo)

      }

      if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
        // handle call approve
        console.log("VIDEO APROVED!!!")
        // console.log("DATA: " + JSON.stringify(data))
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
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
        // handle call connected
        console.log("VIDEO CONNECTED!!!")
        // setCallStream(videoData) //removed?
        // console.log("DATA: " + JSON.stringify(data))
        // console.log("VIDEO DATA CONNECT: " + JSON.stringify(videoData))

        // setVideoStreamData(videoData)
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
        // handle call disconnected
        console.log("VIDEO DISCONNECTED!!!")
        // const currentVoiceChannel = useServerStore.getState().currentVoiceChannel

        // const doc = await rxdb.servers!.findOne({
        //   selector: {
        //     id: {
        //       $eq: serverId
        //     }
        //   }
        // }).exec()
        // doc.update({
        //   $set: {
        //     'voiceChannels.$[x].peerInfo': '',
        //     filter: [{"x.chatId": currentVoiceChannel}]
        //   },
        // })

      }
    });

    // console.log("BEFORE CONST CALL!")
    // await stream!.connect(); // Establish the connection after setting up listeners
    // console.log("STREAM CONNECT: " + stream?.uid)
    // setStream(stream);
    // setStream(stream)
    return stream
  } catch (error) {
    console.error('Error on Stream Init:', error);
    return undefined
    // return stream
  }
}