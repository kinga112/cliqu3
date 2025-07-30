import { useEffect, useState } from "react"
import { useServerStore } from "../../../state-management/store"
import { IFeeds } from "@pushprotocol/restapi/src"
import { cache2 } from "../../../dexie"
import { push } from "../../../App"
import { DirectMessageNavButton } from "./DirectMessageNavButton"
import { useDirectMessageStore } from "../../../state-management/dmStore"
import loader from "../../../assets/icons/loader2.svg"

export function NavItems(){
  const currentNavOption = useDirectMessageStore((dm) => dm.currentNavOption)
  const [chats, setChats] = useState<IFeeds[]>([])
  const [requests, setRequests] = useState<IFeeds[]>([])
  const [loading, setLoading] = useState(false);
  
  // useEffect(() => {
    // console.log("RUNNING NAV ITEMS")
    // setCurrentDM('')
    // clearMessages()
  // }, [currentNavOption])

  useEffect(() => {
    // console.log("FETCHING DMS")
    fetchChats()
  }, [currentNavOption])

  async function fetchChats(){
    setLoading(true)
    let i = 1
    // let tempChatList: string[] = []
    // let tempRequestList: string[] = []
    let tempChatList: IFeeds[] = []
    let tempRequestList: IFeeds[] = []
    while(true){
      const fetched = await push.user!.chat.list(currentNavOption, {limit: 30, page: i})
      if(fetched.length == 0){
        break
      }
      i = i + 1
      // console.log("FETCHED " + currentNavOption + " FOR DM: ", fetched)
      fetched.map((chat: IFeeds) => {
        if(chat.groupInformation == undefined || chat.groupInformation?.groupDescription == 'GROUP DM'){
          // console.log("CHATTT 2: ", chat)
          // console.log('')
          if(currentNavOption == 'CHATS'){
            // console.log("before adding a chat, chats:", chats)
            // if(!chats.includes(chat.chatId!)){
            if(!chats.includes(chat)){
              // console.log("chat not inclusded: ", chat.chatId)
              // setChats([...chats, chat.chatId!])
              tempChatList.push(chat)
              setChats(tempChatList.reverse())
            }
          }else{
            // if(!requests.includes(chat.chatId!)){
            if(!requests.includes(chat)){
              // setRequests([...requests, chat.chatId!])
              tempRequestList.push(chat)
              setRequests(tempRequestList.reverse())
            }
          }
          cache2.addChannel({
            chatId: chat.chatId!,
            name: chat.name!,
            users: [],
            lastReadMessageCid: ""
          })
        }
      })
    }
    setLoading(false)
  }

  async function acceptChat(chatId: string){
    const response = await push.user?.chat.accept(chatId)
    let tempRequests: IFeeds[] = []
    requests.map((request: IFeeds) => {
      if(chatId != request.chatId){
        tempRequests.push(request)
      }
    })
    setRequests(tempRequests)
    // console.log("ACCPET CHAT RESPNSE: ", response)
  }

  async function rejectChat(chatId: string){
    const response = await push.user?.chat.reject(chatId)
    let tempRequests: IFeeds[] = []
    requests.map((request: IFeeds) => {
      if(chatId != request.chatId){
        tempRequests.push(request)
      }
    })
    setRequests(tempRequests)
    // console.log("REJECT CHAT RESPNSE: ", response)
  }

  // Return component based on CHATS or REQUESTS
  if(currentNavOption == 'CHATS'){
    // const navItems = chats.map((chat: IFeeds) => { return <DirectMessageNavButton key={chat.chatId!} chatId={chat.chatId!} did={chat.did}/>})
    // const navItems = chats.map((chatId: string) => { return <DirectMessageNavButton key={chatId} chatId={chatId}/>})
    const navItems = chats.map((chat: IFeeds) => { return <DirectMessageNavButton key={chat.chatId!} chat={chat}/>})
    return(
      <>
        <div className="flex flex-col gap-1 place-items-center w-full">
          { loading ? 
            <img 
              src={loader}
              className='w-10 h-10 transition-all duration-300 animate-spin'
            /> : <div/> }
          { !loading && navItems.length == 0 ? <div>No Chats</div> : <div className="flex flex-col gap-1 w-full">{navItems}</div> }
        </div>
      </>
    )
  }if(currentNavOption == 'REQUESTS'){
    // const navItems = requests.map((chat: IFeeds) => { return <DirectMessageNavButton key={chat.chatId!} chatId={chat.chatId!} did={chat.did}/>})
    // const navItems = requests.map((chatId: string) => { return <DirectMessageNavButton key={chatId} chatId={chatId}/>})
    const navItems = requests.map((chat: IFeeds) => { 
      return <div className="flex flex-col gap-0.5">
        <DirectMessageNavButton key={chat.chatId} chat={chat}/>
        <div className="flex justify-end gap-1">
          <button className="p-1 rounded-lg hover:bg-green-900 bg-opacity-75" onClick={() => acceptChat(chat.chatId!)}>Accept</button>
          <button className="p-1 rounded-lg hover:bg-red-900 bg-opacity-75"  onClick={() => rejectChat(chat.chatId!)}>Reject</button>
        </div>
      </div>
    })
    return(
       <>
        <div className="flex flex-col gap-1 place-items-center w-full">
          { loading ? <img className="animate-spin w-10 h-10" src={loader}/> : <div/> }
          { !loading && navItems.length == 0 ? <div>No Requests</div> : <div className="flex flex-col gap-1">{navItems}</div> }
        </div>
      </>
    )
  }
}
