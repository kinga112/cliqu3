import { push } from "../App"
import { cache2 } from "../dexie";
// import { Message } from "../cache";
import { useServerStore } from "../state-management/store"
import { v4 as uuidv4 } from 'uuid';
import { Content, Message, ReferenceContent, Reply } from "../types/messageTypes";


// Fetches messages into Msg type. Returns last cid and reversed list of Messages.
// export async function fetchHistory(chatId: string, reference: string|null = null): Promise<[Msg[], string]>{
//   // reference refers to last message fetched, can fetch messages based on that message like an offset. can only grab 30 messages max with Push right now
//   const history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
//   let messages: Msg[] = []
//   let reactions: Array<{emoji: string, from: string, reference: string}> = []
//   var i: number = 0
//   for(i; i<history.length;i++){
//     const message = history.slice().reverse()[i]
//     if(message.messageType == 'Reaction'){
//     const from = message.fromDID.split(':')[1]
//     reactions.push({emoji: message.messageContent, from: from, reference: message.messageObj.reference})
//     }else if(message.messageType == 'Reply'){
//       let element = messages.find(msg => msg.cid === message.messageObj.reference)
//       if(element == undefined){
//         const findElement: any = await push.user!.chat.history(chatId, {reference: message.messageObj.reference, limit: 1})
//         const from = message.fromDID.split(':')[1]
//         const randomId = uuidv4();
//         const msg: Msg = {
//         "id": randomId, "origin": from, "timestamp": message.timestamp,
//         "chatId": chatId, "from": from.toLowerCase(),
//         "message": "cid": message.cid,
//         reactions: [{
//             emoji: '',
//             count: 0,
//             users: []
//         }],
//         reply: {messageBlip: findElement[0]!.messageContent.substring(0, 75), reference: findElement[0]!.cid}
//         }
//         messages.push(msg)
//       }
//       if(element != undefined){
//         const from = message.fromDID.split(':')[1]
//         const randomId = uuidv4();
//         const msg: Msg = {
//           "id": randomId, "origin": from, "timestamp": message.timestamp,
//           "chatId": chatId, "from": from.toLowerCase(),
//           "message": "cid": message.cid,
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
//       const from = message.fromDID.split(':')[1]
//       const randomId = uuidv4();
//       const msg: Msg = {
//         "id": randomId, "origin": from, "timestamp": message.timestamp,
//         "chatId": chatId, "from": from.toLowerCase(),
//         "message": "cid": message.cid,
//           reactions: [{
//           emoji: '',
//           count: 0,
//           users: []
//         }],
//         reply: null
//       }
//       messages.push(msg)
//     }
//   }    
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
//         emoji: reaction.emoji,
//         count: 1,
//         users: [reaction.from]
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

// export async function    fetchHistory(chatId: string, reference: string|null = null): Promise<[Msg[], string]>{
// export async function newFetchHistory(chatId: string, reference: string | null = null): Promise<[boolean, string]>{
//   console.log("Fetching Messages! New Fetch History")
//   // await cache.addChannel()
//   // const channel = await cache.fetchChannel(chatId)
//   const channel = await cache2.fetchChannel(chatId)
//   console.log("THIS CHANNEL HELLO >>> IDK: ", channel)

//   const appendMessage = useServerStore.getState().appendMessage;
//   const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
//   let history: any[]
//   // if(reference == ''){
//   //   history = await push.user!.chat.history(chatId, {reference: null, limit: 30})
//   //   push.user!.chat.latest(chatId)
//   // }else{
//   //   history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
//   // }
//   history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
//   var i = 0
//   // const lastCid = localStorage.getItem("lastReadMessage");

//   for(i; i<history.length;i++){
//     // const pushMsg = history.slice().reverse()[i]
//     const pushMsg = history[i]
//     console.log("This message: ", pushMsg.cid)
//     console.log("LAST MESSAGE READ: ", channel.lastReadMessageCid)
//     console.log("Timestamp: ", pushMsg.timestamp)
//     if(channel.lastReadMessageCid == pushMsg.cid){
//       // console.log("LAST READ MESSAGE CID: ", channel.lastReadMessageCid)
//       // console.log("CID: ", pushMsg.cid)
//       console.log("NO messages To load from PUSH!")
//       return [false, '']
//     }else{
//       cache2.updateLastReadMessageCid(chatId, pushMsg.cid)
//     }
//     // if(pushMsg.cid == lastCid){
//     //   return [false, '']
//     // }else{
//     //   localStorage.setItem("lastReadMessage", pushMsg.cid);
//     // }
//     const randomId = uuidv4();
//     const from: string = pushMsg.fromDID.split(':')[1].toLowerCase()
//     console.log("PUSH MESSAGES NEW FETCH: " + JSON.stringify(pushMsg))
//     if(pushMsg.messageType == 'Reaction'){
//       // cache.updateReactions(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       cache2.updateReactions(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       addOrRemoveReaction(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       // addOrRemoveReaction(pushMsg.messageContent, from, pushMsg.messageObj.reference, pushMsg.messageObj.cid)
//     }else if(pushMsg.messageType == 'Reply'){
//       const findElement: any = await push.user!.chat.history(chatId, {reference: pushMsg.messageObj.reference, limit: 1})
//       const message: Message = {
//         id: randomId,
//         chatId: chatId,
//         origin: pushMsg.origin,
//         timestamp: pushMsg.timestamp,
//         from: from,
//         message: {
//           type: pushMsg.messageType, 
//           content: {
//             type: pushMsg.message.content.type, 
//             content: pushMsg.message.content.content
//           },
//           reference: pushMsg.messageObj.reference 
//         },
//         // group: pushMsg.meta.group,
//         group: true,
//         cid: pushMsg.cid,
//         // readCount: 0,
//         // lastAccessed: 0,
//         reply: { 
//           messageBlip: findElement[0]!.message.content.substring(0, 75), 
//           reference: pushMsg.messageObj.reference 
//         },
//         reactions: {}
//       }
//       // const success = await cache.appendMessage(message)
//       const success = await cache2.addMessage(message)
//       // messages.push(message)
//       console.log("SUCCESS?? i: " + i + ", type: reply: succ: " + success)
//       // messages.push(message)
//       if(success){
//         console.log("1 APPENDING MESSAGE: " + message)
//         appendMessage(message)
//       }
//       // if(!success){
//       //   return [success, '']
//       // }
//     }else{
//       const message: Message = {
//         id: randomId,
//         chatId: chatId,
//         origin: pushMsg.origin,
//         timestamp: pushMsg.timestamp,
//         from: from,
//         // type: pushMsg.message.type,
//         message: { type: pushMsg.messageType, content: pushMsg.messageContent },
//         // group: pushMsg.meta.group,
//         group: true,
//         cid: pushMsg.cid,
//         // readCount: 0,
//         // lastAccessed: 0,
//         reply: null,
//         reactions: {}
//       }
      
//       // const success = await cache.appendMessage(message)
//       const success = await cache2.addMessage(message)
//       // console.log("SUCCESS??? BEFORE APPEND: " + success)
//       if(success){
//         console.log("2 APPENDING MESSAGE: " + message)
//         appendMessage(message)
//       }
//       // messages.push(message)
//       console.log("SUCCESS?? i: " + i + ", else: succ: " + success)
//       // if(!success){
//       //   return [success, '']
//       // }
//     }
//   }
//   // return [messagesRev, cid];
//   let cid = ''
//   try{
//     cid = history[history.length-1].cid
//   }catch{
//     // new channel and no messages sent yet
//     console.log("no messages")
//   }
//   console.log("cid before return: " + cid)
//   return [true, cid]
// }


// export async function newFetchHistory(chatId: string, reference: string | null = null): Promise<[boolean, string | null, string | null]>{
//   console.log("Fetching Messages! New Fetch History")
//   // await cache.addChannel()
//   // const channel = await cache.fetchChannel(chatId)
//   const channel = await cache2.fetchChannel(chatId)
//   // console.log("THIS CHANNEL HELLO >>> IDK: ", channel)

//   const appendNewMessages = useServerStore.getState().appendNewMessages;
//   const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
//   // let history: any[]
//   // if(reference == ''){
//   //   history = await push.user!.chat.history(chatId, {reference: null, limit: 30})
//   //   push.user!.chat.latest(chatId)
//   // }else{
//   //   history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
//   // }
//   const history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
//   var i = 0
//   // const lastCid = localStorage.getItem("lastReadMessage");

//   let fetchedMessages: Message[] = []
//   // console.log("LAST INDEX HISTORY:", history[0])
//   let lastReadCid: string | null = null
//   console.log("REF FOR FETCH: ", reference)
//   if(reference == null){
//     try{
//       lastReadCid = history[0].cid
//       console.log("setting last read cid in fetch: " + lastReadCid)
//     }catch{
//       console.log("new channel so no messages yet... so no history.. duhh")
//     }
//   }
//   for(i; i<history.length;i++){
//     // const pushMsg = history.slice().reverse()[i]
//     const pushMsg = history[i]
//     // console.log("This message: ", pushMsg.cid)
//     console.log("LAST MESSAGE READ: ", channel.lastReadMessageCid)
//     // console.log("Timestamp: ", pushMsg.timestamp)
//     if(channel.lastReadMessageCid == pushMsg.cid){
//       // console.log("LAST READ MESSAGE CID: ", channel.lastReadMessageCid)
//       // console.log("CID: ", pushMsg.cid)
//       // console.log("NO messages To load from PUSH!")
//       // console.log("I: ", i)
//       console.log("This message CID is last Read mesasge CID: ", pushMsg.cid)
//       // console.log("MESSAGE CONTENT: ", pushMsg)
//       console.log("FETCHED MESSAGES with false in reverse ", fetchedMessages.reverse())
//       // cache2.messages.bulkAdd(fetchedMessages)
//       appendNewMessages(fetchedMessages)
//       console.log("BEFORE RETURN IF")
//       return [false, null, lastReadCid]
//     }else{
//       console.log("update last read message cid after while loop of fetch finishes. ")
//       // cache2.updateLastReadMessageCid(chatId, pushMsg.cid)
//     }
//     // if(pushMsg.cid == lastCid){
//     //   return [false, '']
//     // }else{
//     //   localStorage.setItem("lastReadMessage", pushMsg.cid);
//     // }
//     const randomId = uuidv4();
//     const from: string = pushMsg.fromDID.split(':')[1].toLowerCase()
//     // console.log("PUSH MESSAGES NEW FETCH: " + JSON.stringify(pushMsg))
//     if(pushMsg.messageType == 'Reaction'){
//       // cache.updateReactions(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       cache2.updateReactions(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       addOrRemoveReaction(pushMsg.messageContent, from, pushMsg.messageObj.reference)
//       // addOrRemoveReaction(pushMsg.messageContent, from, pushMsg.messageObj.reference, pushMsg.messageObj.cid)
//     }else if(pushMsg.messageType == 'Reply'){
//       console.log("THIS IS A REPLY FETCHED FROM PUSH")
//       const findElement: any = await push.user!.chat.history(chatId, {reference: pushMsg.messageObj.reference, limit: 1})
//       console.log("reply message: ", pushMsg) 
//       const message: Message = {
//         id: randomId,
//         chatId: chatId,
//         origin: pushMsg.origin,
//         timestamp: pushMsg.timestamp,
//         from: from,
//         message: {
//           type: pushMsg.messageType,
//           content: {
//             type: pushMsg.messageObj.content.messageType,
//             content: pushMsg.messageObj.content.messageObj.content
//           },
//           reference: pushMsg.messageObj.reference
//         },
//         // group: pushMsg.meta.group,
//         group: true,
//         cid: pushMsg.cid,
//         reply: {
//           messageBlip: findElement[0]!.messageObj.content.substring(0, 75), 
//           reference: pushMsg.messageObj.reference 
//         },
//         reactions: {}
//       }

//       fetchedMessages.push(message)
//       cache2.addMessage(message)
//       // const success = await cache.appendMessage(message)
//       // const success = await cache2.addMessage(message)
//       // messages.push(message)
//       // console.log("SUCCESS?? i: " + i + ", type: reply: succ: " + success)
//       // messages.push(message)
//       // if(success){
//         // console.log("1 APPENDING MESSAGE: " + message)
//         // appendMessage(message)
//         // fetchedMessages.push(message)
//       // }
//       // if(!success){
//       //   return [success, '']
//       // }
//     }else{
//       const message: Message = {
//         id: randomId,
//         chatId: chatId,
//         origin: pushMsg.origin,
//         timestamp: pushMsg.timestamp,
//         from: from,
//         // type: pushMsg.message.type,
//         message: { type: pushMsg.messageType, content: pushMsg.messageContent },
//         // group: pushMsg.meta.group,
//         group: true,
//         cid: pushMsg.cid,
//         // readCount: 0,
//         // lastAccessed: 0,
//         reply: null,
//         reactions: {}
//       }
//       cache2.addMessage(message)
//       fetchedMessages.push(message)
//       // const success = await cache.appendMessage(message)
//       // const success = await cache2.addMessage(message)
//       // console.log("SUCCESS??? BEFORE APPEND: " + success)
//       // if(success){
//       //   console.log("2 APPENDING MESSAGE: " + message)
//       //   // appendMessage(message)
//       //   fetchedMessages.push(message)
//       // }
//       // messages.push(message)
//       // console.log("SUCCESS?? i: " + i + ", else: succ: " + success)
//       // if(!success){
//       //   return [success, '']
//       // }
//     }
//   }
//   // return [messagesRev, cid];
//   let cid = ''
//   try{
//     cid = history[history.length-1].cid
//   }catch{
//     // new channel and no messages sent yet
//     console.log("no messages")
//   }
//   console.log("reference before return: " + cid)
//   console.log("FETCHED MESSAGES with true: ", fetchedMessages)
//   appendNewMessages(fetchedMessages)
//   console.log("BEFORE RETURN ELSE")
//   return [true, cid, lastReadCid]
// }

export async function newFetchHistory(chatId: string, reference: string | null = null): Promise<[boolean, string | null, string | null]>{
  console.log("Fetching Messages! New Fetch History")
  const appendNewMessages = useServerStore.getState().appendNewMessages;
  const addOrRemoveReaction = useServerStore.getState().addOrRemoveReaction;
  const channel = await cache2.fetchChannel(chatId)
  const history = await push.user!.chat.history(chatId, {reference: reference, limit: 30})
  
  let fetchedMessages: Message[] = []
  let lastReadCid: string | null = null

  console.log("REF FOR FETCH: ", reference)
  if(reference == null){
    try{
      lastReadCid = history[0].cid
      if(channel.lastReadMessageCid == lastReadCid){
        console.log("first message is last read CID")
        return [false, null, null]
      }
      console.log("setting last read cid in fetch: " + lastReadCid)
    }catch{
      console.log("new channel so no messages yet... so no history.. duhh")
      return [false, null, null]
    }
  }
  
  let cid = ''
  var i = 0
  for(i; i<history.length;i++){
    const pushMsg = history[i]
    const randomId = uuidv4();
    const from: string = pushMsg.fromDID.split(':')[1].toLowerCase()

    console.log(i)
    // console.log(pushMsg)

    if(i == (history.length - 1)){
      cid = pushMsg.cid
    }
    
    console.log("LAST MESSAGE READ: ", channel.lastReadMessageCid)
    
    if(channel.lastReadMessageCid == pushMsg.cid){
      console.log("This message CID is last Read mesasge CID: ", pushMsg)
      console.log("FETCHED MESSAGES with false in reverse ", fetchedMessages.reverse())
      appendNewMessages(fetchedMessages)
      // console.log("BEFORE RETURN IF")
      return [false, null, lastReadCid]
    }else{
      console.log("update last read message cid after while loop of fetch finishes.")
    }

    if(pushMsg.messageType == 'Reaction'){
      console.log("THIS IS A REACTION FETCHED FROM PUSH")
      console.log("reaction message: ", pushMsg)
      addOrRemoveReaction(pushMsg.messageContent, from, pushMsg.messageObj.reference)
      cache2.updateReactions(pushMsg.messageContent, from, pushMsg.messageObj.reference)
    }else{
      // let content: Content | ReferenceContent = { type: pushMsg.messageType, content: pushMsg.messageContent }
      let content: Content | ReferenceContent = { type: pushMsg.messageType, content: pushMsg.messageObj.content }
      let reply: Reply | null = null
      if(pushMsg.messageType == 'Reply'){
        console.log("THIS IS A REPLY FETCHED FROM PUSH")
        const foundMessage: any = await push.user!.chat.history(chatId, {reference: pushMsg.messageObj.reference, limit: 1})
        console.log("reply message: ", pushMsg)

        content = {
          type: pushMsg.messageType,
          content: {
            type: pushMsg.messageObj.content.messageType,
            content: pushMsg.messageObj.content.messageObj.content
          },
          reference: pushMsg.messageObj.reference
        }

        const replyFrom = foundMessage[0]!.fromDID.split(':')[1].toLowerCase()
        let replyContent = foundMessage[0]!.messageObj.content
        if(typeof replyContent !== "string"){
          replyContent = foundMessage[0]!.messageObj.content.messageObj.content
        }

        console.log("message content: ", pushMsg)

        reply = {
          from: replyFrom,
          message: replyContent,
          reference: pushMsg.messageObj.reference
        }


        // reply = {
        //   from: findElement[0]!.from,
        //   message: findElement[0]!.messageObj.content, 
        //   reference: pushMsg.messageObj.reference 
        // }

      }else{
        console.log("FETCHED MESSAGE NOT REPLY OR REACTION")
        console.log("reaction message: ", pushMsg)
      }
      const message: Message = {
        id: randomId,
        chatId: chatId,
        origin: pushMsg.origin,
        timestamp: pushMsg.timestamp,
        from: from,
        message: content,
        // group: pushMsg.meta.group,
        group: true,
        cid: pushMsg.cid,
        reply: reply,
        reactions: {}
      }
      cache2.addMessage(message)
      fetchedMessages.push(message)
    }
  }

  console.log("reference before return: " + cid)
  console.log("FETCHED MESSAGES with true: ", fetchedMessages)
  appendNewMessages(fetchedMessages)
  console.log("BEFORE RETURN ELSE")
  return [true, cid, lastReadCid]
}


export async function getNewMessages(chatId: string){
  let count = 0
  let reference: string | null = null
  let success = false
  let lastRef: string = ''
  let cid: string | null = null
  let lastReadCid: string = ''
  const c = await cache2.fetchChannel(chatId);
  console.log("CHANNEL before fetching push messages: ", c)
  while(true){
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
}
