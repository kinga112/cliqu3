// import { useEffect, useRef, useState } from "react"
// import { push } from "../App"
// import { IFeeds, user, UserProfile } from "@pushprotocol/restapi/src"
// import add from "../assets/icons/add-cropped.svg"
// import { BottomBar } from "../components/server/Server"
// import { useServerStore, useUserStore } from "../state-management/store"
// import { getNewMessages, newFetchHistory } from "../helperFunctions/fetch"
// // import { Message } from "../cache"
// import { Messages } from "../components/server/Messages"
// import { Message } from "../types/messageTypes"
// import { cache2 } from "../dexie"
// import { UserInfoLarge } from "../components/user/UserInfo"
// import { useGlobalStore } from "../state-management/globalStore"

// function DirectMessages(){
//   const clearMessages = useServerStore((server) => server.clearMessages)
//   const [directmessages, setDirectMessages] = useState<IFeeds[]>([])
//   const [newMessage, setNewMessage] = useState(false)

//   useEffect(() => {
//     clearMessages()
//     fetchChats()
//   }, [])

//   async function fetchChats(){
//     const chats = await push.user!.chat.list('CHATS', {limit: 30})
//     chats.map((chat: IFeeds) => {
//       // console.log("CHATTT: ", chat)
//       if(chat.groupInformation == undefined){
//         console.log("CHATTT: ", chat)
//         setDirectMessages([...directmessages, chat])
//         cache2.addChannel({
//           chatId: chat.chatId!,
//           name: chat.name!,
//           users: [],
//           lastReadMessageCid: ""
//         })
//       }else if(chat.groupInformation?.groupDescription == 'GROUP DM'){
//         console.log("CHATTT: ", chat)
//         setDirectMessages([...directmessages, chat])
//         cache2.addChannel({
//           chatId: chat.chatId!,
//           name: chat.name!,
//           users: [],
//           lastReadMessageCid: ""
//         })
//       }
//     })
//     // setDirectMessages(chats)
//   }
  
//   async function sendNewDirectMessage(recipient: string, message: string){
//     await push.user!.chat.send(recipient, {
//       content: message
//     })
//   }

//   const dmList = directmessages.map((chat: IFeeds) => { return <DirectMessageButton key={chat.chatId!} chatId={chat.chatId!} did={chat.did}/>})
  
//   return(
//     <>
//       <div className="flex w-full h-full">
//         <div className="flex flex-col gap-2 w-56 shrink-0 bg-off-black-600 p-2">
//           <div className="flex justify-between place-items-center">
//             <div className="text-lg font-semibold">
//               Direct Messages
//             </div>
//             <button className="bg-off-black-400 hover:bg-off-black-300 p-2 rounded-md" onClick={() => setNewMessage(true)}>
//               <img src={add} width={15} height={15}/>
//             </button>
//           </div>
//           { dmList.length == 0 ? <div>No Messages</div> : <div>{dmList}</div> }
//         </div>
//         {newMessage ? <NewDirectMessage/> : <DirectMessage />}
//       </div>
//     </>
//   )
// }

// export default DirectMessages

// function DirectMessageButton(props: {chatId: string, did: string}){
//   const setUserProfiles = useServerStore((server) => server.setUserProfiles)
//   const setMessages = useServerStore((server) => server.setMessages)
//   // const setUserProfiles = useServerStore((server) => server)
//   const profile = useUserStore((user) => user.profile)
//   const currentDM = useGlobalStore((globals) => globals.currentDM)
//   const setCurrentDM = useGlobalStore((globals) => globals.setCurrentDM)

//   async function changeDM(){
//     console.log("CHANGE DM: " + props.chatId + ", currentDM: " + currentDM)
//     // console.log("CHANGING SERVER SERVER IDDDDDD: " + props.server.id)
//     if(props.chatId != currentDM){
//       setCurrentDM(props.chatId)
//       console.log("NO EQUAL setting current dm to: ", props.chatId)
//       const chatInfo = await push.user?.chat.info(props.chatId)
//       console.log("CHAT INFO: ", chatInfo)
//       if(chatInfo?.meta.group){
//         console.log("GROUP DM")
//       }else{
//         let profiles: { [address: string]: UserProfile } = {}
//         profiles[push.user?.account.toLocaleLowerCase()!] = profile!
//         // let myProfile = 
//         push.user?.profile.info({overrideAccount: chatInfo?.recipient}).then((info: any) => {
//           const recipient = chatInfo?.recipient.split(':')[1].toLowerCase()!
//           profiles[recipient] = info
//         })
//         console.log("PROFILES: ", profiles)
//         setUserProfiles(profiles)
//       }
//       const cachedMessages = await cache2.fetchRecentMessages(props.chatId)
//       setMessages(cachedMessages)
//       console.log("fetched all cached dms!")
//       // const messages = await push.user?.chat.history(props.chatId, { limit: 30 })
//       // setMessages(messages)
//       await getNewMessages(props.chatId)
//     }
//   }

//   async function fetchMessages(){
//     console.log("DID: ", props.did)
//     console.log("FETCHING DM!!!")
//     let userProfiles: any = {}
//     push.user?.profile.info({overrideAccount: props.did}).then((info: any) => {
//       console.log("INFO: ", info)
//       // setUserProfiles()
//       userProfiles[props.did] = info
//       push.user?.profile.info().then((profile: any) => {
//         console.log("MY PROFILE: ", profile)
//         // setUserProfiles({})
//         // userProfiles.push(profile)
//         userProfiles[push.user!.account.toLowerCase()] = profile
//         setUserProfiles(userProfiles)
//       })
//       // setRecipientInfo(info)
//       // setCurrentChatChannel({chatId: event.target.value, name: ''})
//     }).catch((error) => {
//       console.log("ERROR::: " + error)
//       // setRecipientInfo(null)
//     })
//     // setCurrentChatChannel({chatId: props.chatId, name: ''})
//     // const messages = await push.user!.chat.history(props.chatId)
//     // console.log("DM MESSAGES: ", messages)
//     // setMessages(messages)


//     // cache.fetchRecentMessages(props.chatId).then((messages: Message[])=> {
//     //   console.log("MESSAGES: ", messages)
//     //   setMessages(messages)
//     // })
//     // cache2.fetchRecentMessages(props.chatId).then((messages: Message[])=> {
//     //   console.log("MESSAGES: ", messages)
//     //   setMessages(messages)
//     // })


//     // let count = 0
//     // // let messages: Msg[] = []
//     // let reference: string | null = null
//     // let success = false
//     // let lastRef: string = ''
//     // while(true){
//     //   // [messages, reference] = await fetchHistory(chatId, reference)
//     //   [success, reference] = await newFetchHistory(props.chatId, reference)
//     //   // if(messages.length == 0){
//     //   //   // new channel and no messages sent yet
//     //   //   break
//     //   // }
//     //   if(!success){
//     //     // new channel and no messages sent yet
//     //     break
//     //   }
//     //   if(lastRef == reference){
//     //     console.log("CANT LOAD ANY MORE MESSAGES: " + count)
//     //     break
//     //   }else{
//     //     lastRef = reference
//     //   }
//     //   // const currentChatChannel = useServerStore.getState().currentChatChannel
//     //   // if channel gets changed while loading messages
//     //   // if(chatId == currentChatChannel.chatId || currentChatChannel.chatId == ''){
//     //     // setMessages(messages)
//     //   // }
//     //   if(count > 20){
//     //     break
//     //   }else{
//     //     count += 1
//     //   }
//     // }

//   }

//   return(
//     <>
//       <button onClick={changeDM} className="bg-off-black-500 p-2 w-full shrink hover:bg-off-black-400 rounded-lg">
//         <p className="truncate overflow-hidden">
//           {props.chatId}
//         </p>
//       </button>
//     </>
//   )
// }

// function NewDirectMessage(){
//   const setCurrentChatChannel = useServerStore((server) => server.setCurrentChatChannel)
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [recepientInfo, setRecipientInfo] = useState<'' | null | UserProfile>('');
//   const [address, setAddress] = useState('')

//   const handleRecepientChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     console.log("EVENT: " + event.target.value);
//     if(!event.target.value){
//       console.log("NULL")
//       setRecipientInfo('')
//     }else{
//       push.user?.profile.info({overrideAccount: event.target.value}).then((info: UserProfile) => {
//         console.log("INFO: ", info)
//         setAddress(event.target.value)
//         setRecipientInfo(info)
//         setCurrentChatChannel({chatId: event.target.value, name: ''})
//       }).catch((error) => {
//         console.log("ERROR::: " + error)
//         setRecipientInfo(null)
//       })
//     }
//   }

//   if(inputRef.current != null){
//     inputRef.current.focus()
//     inputRef.current.style.height = 'auto';  // Reset height to auto
//   }

//   return(
//     <>
//       <div className="relative flex flex-col overflow-hidden h-full w-full bg-off-black-500 p-2">
//         <div className="relative flex h-14 w-full">
//           <input ref={inputRef} className="flex p-2 h-full w-full rounded-lg focus:outline-none bg-off-black-600" placeholder="Recipient Address" onChange={handleRecepientChange}/>
//           { recepientInfo == '' ?
//             <p/> : 
//               recepientInfo ?
//               <div className="absolute flex gap-2 top-14 p-2 bg-off-black-600 rounded-md">
//                 <UserInfoLarge address={address} userProfile={recepientInfo}/>
//                 {/* <img className="h-16 w-16 rounded-md" src={recepientInfo.picture!}/>
//                 <div className="flex flex-col gap-2">
//                   <div>{recepientInfo.name!}</div>
//                   <div>{recepientInfo.desc!}</div>
//                 </div> */}
//               </div>
//                : 
//               <div className="absolute top-14 p-2 bg-off-black-600 rounded-md">User Not Found</div>
//           } 
//         </div>
//         {/* <div className="flex flex-col h-full justify-end">
//           <BottomBar/>
//         </div> */}
//         <div className="flex flex-col overflow-hidden h-full w-full">
//           <Messages/>
//           <BottomBar/>
//         </div>
//           </div>
//         </>
//       )
// }
// function DirectMessage(){
// // function DirectMessage(props: { recipient: { address: string, name: string | null, desc: string | null, picture: string | null } }){
//   // const [recepientInfo, setRecipientInfo] = useState<any>('');
//   const userProfiles = useServerStore((server) => server.userProfiles)
//   // const currentChatChannel = useServerStore((server) => server.currentChatChannel)
//   const currentDM = useGlobalStore((globals) => globals.currentDM)
  

//   // useEffect(() => {
//   //   // console.log("DID: ", props.did)
//   //   push.user?.chat.group.info(currentDM)
//   //   // push.user?.profile.info({overrideAccount: props.did}).then((info: any) => {
//   //   //   console.log("INFO: ", info)
//   //   //   setRecipientInfo(info)
//   //   //   // setCurrentChatChannel({chatId: event.target.value, name: ''})
//   //   // }).catch((error) => {
//   //   //   console.log("ERROR::: " + error)
//   //   //   setRecipientInfo(null)
//   //   // })

//   // }, [currentDM])

//   // userProfiles 

//   // let recipient = {
//   //   address: "",
//   //   name: "",
//   //   desc: "",
//   //   picture: ""
//   // }

//   // Object.keys(userProfiles!).forEach(function(key, index) {
//   //   // myObject[key] *= 2;
//   //   // console.log("USER: ", userProfiles[key])
//   //   if(push.user!.account.toLowerCase() != key){
//   //     recipient = {
//   //       address: key,
//   //       name: userProfiles[key].name!,
//   //       desc: userProfiles[key].desc!,
//   //       picture: userProfiles[key].picture!,
//   //     }
//   //   }
//   // });

//   // userProfiles.map((user: any) => {
//   //   console.log("USER: ", user)
//   // })

//   return(
//     <>
//       <div className="flex flex-col overflow-hidden h-full w-full bg-off-black-500">
//         <div className="flex gap-2 p-2 bg-off-black-600 place-items-center">
//           <img className="h-16 w-16 rounded-md" src={''}/>
//           {/* <div className="flex flex-col"> */}
//             {/* <div>{props.recipient.name}</div> */}
//             {/* <div>{props.recipient.address}</div> */}
//           {/* </div> */}
//         </div>
//         <Messages/>
//         <BottomBar/>
//       </div>
//     </>
//   )
// }
