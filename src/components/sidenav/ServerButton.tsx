import { useEffect, useState } from "react"
import { useServerStore } from "../../state-management/store"
import { newFetchHistory } from "../../helperFunctions/fetch"
// import { cache, push } from "../../App"
// import { Message } from "../../cache"
import { ChatMemberProfile } from "@pushprotocol/restapi/src"
import { push } from "../../App"
import { cache2 } from "../../dexie"
import { Message } from "../../types/messageTypes"
import { GunServer, TextChannel, VoiceChannel } from "../../types/serverTypes"
import { useGlobalStore } from "../../state-management/globalStore"
import Server from "../server/Server"
import { useDirectMessageStore } from "../../state-management/dmStore"

export function ServerButton(props: {server: GunServer }){
  const serverId = useServerStore((state) => state.serverId)
  const setCurrentScreen = useGlobalStore((globals) => globals.setCurrentScreen)
  const setServerId = useServerStore((state) => state.setServerId)
  const setCreator = useServerStore((state) => state.setCreator)
  const setPicture = useServerStore((state) => state.setPicture)
  const setDescription = useServerStore((state) => state.setDescription)
  const appendVoiceChannel = useServerStore((state) => state.appendVoiceChannel)
  const setTextChannels = useServerStore((state) => state.setTextChannels)
  const setVoiceChannels = useServerStore((server) => server.setVoiceChannels)
  const setCurrentChatChannel = useServerStore((server) => server.setCurrentTextChannel)
  const setName = useServerStore((state) => state.setName)
  const setMessages = useServerStore((server) => server.setMessages)
  const setUserProfiles = useServerStore((server) => server.setUserProfiles)
  const setUsers = useServerStore((server) => server.setUsers)
  const clearMessages = useServerStore((server) => server.clearMessages)
  // const setCurrentDM = useGlobalStore((globals) => globals.setCurrentDM)
  const setCurrentDM = useDirectMessageStore((dm) => dm.setCurrentDM)
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
    let reference: string | null = null
    let success = false
    let lastRef: string = ''
    let cid: string | null = null
    let lastReadCid: string = ''
    while(true){
      [success, reference, cid] = await newFetchHistory(chatId, reference);
      if(cid != null){
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
        console.log("CANT LOAD ANY MORE MESSAGES: " + count)
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
    // setCurrentDM(null)
    if(props.server.id != serverId){
      clearMessages()
      setTextChannels([])
      // setVoiceChannels([])
      setVoiceChannels({})
      
      if(props.server.id != null && props.server.id != ''){
        setServerId(props.server.id)
        setCurrentScreen('Server')
        setName(props.server.name)
        setCreator(props.server.creator)
        if(props.server.picture){
          setPicture(props.server.picture)
        }
        if(props.server.description){
          setDescription(props.server.description)
        }

        const textChannels: TextChannel[] = JSON.parse(props.server.textChannels!)
        console.log("UPDATING TEXT CHANNELS:", textChannels)
        // console.log("TEXT CHANNELS: ", channels)
        setTextChannels(textChannels)
        setCurrentChatChannel(textChannels[0])
        // console.log("CHAT ID: " + textChannels[0].chatId)
        getUsers(textChannels[0].chatId)
        // cache.fetchRecentMessages(textChannels[0].chatId).then((messages: Message[])=> {
        //   setMessages(messages)
        // })
        // cache2.fetchRecentMessages(textChannels[0].chatId).then((messages: Message[])=> {
        //   setMessages(messages)
        // })
        const cachedMessages = await cache2.fetchRecentMessages(textChannels[0].chatId)
        setMessages(cachedMessages)
        console.log("fetched all cached messages!")
        // getNewMessages(textChannels[0].chatId).then(() => {
        //   console.log("Getting new Messages from push!!")
        // })
        await getNewMessages(textChannels[0].chatId)
        const voiceChannels: VoiceChannel[] = JSON.parse(props.server.voiceChannels!)
        voiceChannels.map((voiceChannel: VoiceChannel) => {
          appendVoiceChannel(voiceChannel)
        })
        console.log("APPENDED VOICE CHANNELS TO STATE:", voiceChannels)
      }
    }
  }

  function Button(){
    const buttonStyle = `
      flex flex-col w-16 h-16 bg-deep-purple-300 rounded-2xl 
      justify-center place-items-center duration-200 hover:scale-105
      pointer-events-auto ml-4 shrink-0 overflow-hidden`

    if(props.server.picture == '' || !props.server.picture){ 
      let serverInitials = props.server.name
      try{
        const wordList = props.server.name.split(' ')
        let i = 0
        for(i; i < 4; i++){
          try{
            serverInitials = serverInitials + wordList[i][0]
          }catch{}
        }
      }catch{

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